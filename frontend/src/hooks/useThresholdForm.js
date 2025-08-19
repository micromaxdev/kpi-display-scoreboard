/**
 * Custom hooks for threshold form management
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCollections, fetchCollectionFields, saveThreshold, fetchCollectionSampleData, analyzeKPIData } from '../services/apiService';
import { filterMeasurableFields } from '../utils/fieldUtils';
import { validateThresholdForm, createMessage, getInitialFormState, checkThresholds } from '../utils/formUtils';

/**
 * Custom hook for managing collections data
 * @returns {object} - Collections state and loading status
 */
export const useCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCollections = async () => {
    setLoading(true);
    setError(null);
    
    const result = await fetchCollections();
    
    if (result.success) {
      setCollections(result.collections);
    } else {
      setError(result.error);
      setCollections([]);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadCollections();
  }, []);

  return {
    collections,
    loading,
    error,
    refetch: loadCollections
  };
};

/**
 * Custom hook for managing collection fields
 * @param {string} selectedCollection - Currently selected collection
 * @returns {object} - Fields state and loading status
 */
export const useCollectionFields = (selectedCollection) => {
  const [fields, setFields] = useState([]);
  const [allFields, setAllFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFields = async (collectionName) => {
    if (!collectionName) {
      setFields([]);
      setAllFields([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    const result = await fetchCollectionFields(collectionName);
    
    if (result.success) {
      const measurableFields = filterMeasurableFields(result.fields);
      setAllFields(result.fields);
      setFields(measurableFields);
      
      console.log('All fields:', result.fields);
      console.log('Filtered measurable fields:', measurableFields);
    } else {
      setError(result.error);
      setFields([]);
      setAllFields([]);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadFields(selectedCollection);
  }, [selectedCollection]);

  return {
    fields,
    allFields,
    loading,
    error,
    refetch: () => loadFields(selectedCollection)
  };
};

/**
 * Custom hook for managing collection sample data
 * @param {string} selectedCollection - Currently selected collection
 * @returns {object} - Sample data state and loading status
 */
export const useCollectionSampleData = (selectedCollection) => {
  const [sampleData, setSampleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  const loadSampleData = async (collectionName) => {
    if (!collectionName) {
      setSampleData([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    const result = await fetchCollectionSampleData(collectionName);
    
    if (result.success) {
      setSampleData(result.data);
      console.log('Sample data loaded:', result.data);
    } else {
      setError(result.error);
      setSampleData([]);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadSampleData(selectedCollection);
  }, [selectedCollection]);

  return {
    sampleData,
    loading,
    error,
    refetch: () => loadSampleData(selectedCollection)
  };
};

/**
 * Custom hook for managing threshold form state
 * @returns {object} - Form state and handlers
 */
export const useThresholdForm = () => {
  const navigate = useNavigate();
  
  // Function to get initial form state with localStorage persistence
  const getPersistedFormState = () => {
    try {
      const saved = localStorage.getItem('kpi-threshold-form-data');
      if (saved) {
        const parsedData = JSON.parse(saved);
        console.log('Restored form data from localStorage:', parsedData);
        return parsedData;
      }
    } catch (error) {
      console.warn('Failed to restore form data from localStorage:', error);
    }
    console.log('No saved data found, using initial state');
    return getInitialFormState();
  };

  const [formData, setFormData] = useState(getPersistedFormState());
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [thresholdValidation, setThresholdValidation] = useState({ isValid: true, message: '' });

  // Real-time threshold validation
  const validateThresholds = async () => {
    const { greenThreshold, amberThreshold, direction } = formData;
    
    // Only validate if both thresholds have values
    if (greenThreshold && amberThreshold && direction) {
      const result = await checkThresholds(greenThreshold, amberThreshold, direction);
      setThresholdValidation({
        isValid: result.success,
        message: result.message || ''
      });
    } else {
      // Reset validation if fields are empty
      setThresholdValidation({ isValid: true, message: '' });
    }
  };

  // Run threshold validation when relevant fields change
  useEffect(() => {
    validateThresholds();
  }, [formData.greenThreshold, formData.amberThreshold, formData.direction]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('kpi-threshold-form-data', JSON.stringify(formData));
      console.log('Form data saved to localStorage:', formData);
    } catch (error) {
      console.warn('Failed to save form data to localStorage:', error);
    }
  }, [formData]);

  // Update individual form fields
  const updateField = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Reset form to initial state
  const resetForm = () => {
    const initialState = getInitialFormState();
    setFormData(initialState);
    setMessage({ type: '', text: '' });
    // Clear localStorage when resetting
    try {
      localStorage.removeItem('kpi-threshold-form-data');
      console.log('Form data cleared from localStorage');
    } catch (error) {
      console.warn('Failed to clear form data from localStorage:', error);
    }
  };

  // Clear messages
  const clearMessage = () => {
    setMessage({ type: '', text: '' });
  };

  // Shared logic for preview and save+preview
  const processForm = async ({ save = false, e = null }) => {
    if (e) e.preventDefault();

    // Validate form
    const validation = validateThresholdForm(formData);

    console.log(save ? 'Save and Preview - Form data:' : 'Form data:', formData);
    console.log(save ? 'Save and Preview - Validation result:' : 'Validation result:', validation);

    if (!validation.isValid) {
      setMessage(createMessage('error', validation.errors.join(', ')));
      return;
    }

    setLoading(true);

    try {
      // Save threshold if required 
      if (save) {
        const thresholdData = {
          collectionName: validation.values.collectionName,
          field: validation.values.field,
          green: parseFloat(validation.values.green),
          amber: parseFloat(validation.values.amber),
          direction: validation.values.direction
        };

        console.log('Threshold data being saved:', thresholdData);

        const saveResult = await saveThreshold(thresholdData);
        ///////////////////////////////////////////
        // Save Display as well with thresholdID //
        ///////////////////////////////////////////
        if (!saveResult.success) {
          setMessage(createMessage('error', saveResult.message || 'Failed to save threshold'));
          setLoading(false);
          return;
        }
      }

      // Analyze KPI data
      const analysisData = {
        collectionName: validation.values.collectionName,
        field: validation.values.field,
        greenThreshold: parseFloat(validation.values.green),
        amberThreshold: parseFloat(validation.values.amber),
        direction: validation.values.direction
      };

      console.log('Analysis data being sent:', analysisData);

      const analysisResult = await analyzeKPIData(analysisData);


      if (!analysisResult.success) {
        setMessage(createMessage('error', analysisResult.error || 'Failed to analyze KPI data'));
        setLoading(false);
        return;
      }

      // Navigate to preview page with results
      navigate('/preview', {
        state: {
          analysisData: analysisResult.data,
          field: validation.values.field,
          collectionName: validation.values.collectionName,
          ...(save && { saved: true })
        }
      });

    } catch (error) {
      console.error(save ? 'Error in save and preview:' : 'Error in form submission:', error);
      setMessage(createMessage('error', 'An unexpected error occurred'));
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (preview only, no save)
  const handlePreview = (e) => processForm({ save: false, e });

  // Handle save and preview (saves to database then navigates to preview)
  const handleSaveAndPreview = () => processForm({ save: true });

  return {
    formData,
    message,
    loading,
    thresholdValidation,
    updateField,
    resetForm,
    clearMessage,
    handlePreview,
    handleSaveAndPreview,
    validation: validateThresholdForm(formData)
  };
};

/**
 * Custom hook for managing form state with collections and fields
 * @returns {object} - Complete form state and handlers
 */
export const useThresholdFormWithData = () => {
  const formHook = useThresholdForm();
  const collectionsHook = useCollections();
  const fieldsHook = useCollectionFields(formHook.formData.selectedCollection);
  const sampleDataHook = useCollectionSampleData(formHook.formData.selectedCollection);

  // When collection changes, reset field selection only if the current field is not valid for the new collection
  useEffect(() => {
    if (formHook.formData.selectedCollection && fieldsHook.fields.length > 0) {
      const currentField = formHook.formData.selectedField;
      const isFieldValid = fieldsHook.fields.some(field => field.name === currentField);
      
      console.log('Field validation check:', {
        collection: formHook.formData.selectedCollection,
        currentField,
        availableFields: fieldsHook.fields.map(f => f.name),
        isFieldValid
      });
      
      // Only reset field if it's not valid for the current collection
      if (currentField && !isFieldValid) {
        console.log('Field', currentField, 'is not valid for collection', formHook.formData.selectedCollection, '. Resetting field selection.');
        formHook.updateField('selectedField', '');
      } else if (currentField && isFieldValid) {
        console.log('Field', currentField, 'is valid for collection', formHook.formData.selectedCollection, '. Keeping field selection.');
      }
    }
  }, [formHook.formData.selectedCollection, fieldsHook.fields]);

  // Combine loading states
  const isLoading = formHook.loading || collectionsHook.loading || fieldsHook.loading;

  // Combine error handling
  useEffect(() => {
    if (collectionsHook.error) {
      formHook.clearMessage();
      setTimeout(() => {
        formHook.updateField('message', createMessage('error', collectionsHook.error));
      }, 100);
    }
  }, [collectionsHook.error]);

  useEffect(() => {
    if (fieldsHook.error) {
      formHook.clearMessage();
      setTimeout(() => {
        formHook.updateField('message', createMessage('error', fieldsHook.error));
      }, 100);
    }
  }, [fieldsHook.error]);

  return {
    // Form state
    ...formHook,
    
    // Data
    collections: collectionsHook.collections,
    fields: fieldsHook.fields,
    allFields: fieldsHook.allFields,
    sampleData: sampleDataHook.sampleData,
    
    // Loading states
    loading: isLoading,
    collectionsLoading: collectionsHook.loading,
    fieldsLoading: fieldsHook.loading,
    sampleDataLoading: sampleDataHook.loading,
    
    // Refetch functions
    refetchCollections: collectionsHook.refetch,
    refetchFields: fieldsHook.refetch,
    refetchSampleData: sampleDataHook.refetch
  };
};
