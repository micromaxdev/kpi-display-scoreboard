/**
 * Custom hooks for threshold form management
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCollections, fetchCollectionFields, saveThreshold, fetchCollectionSampleData, analyzeKPIData, saveDisplayConfig, fetchSingleThreshold, fetchExcludedFields } from '../services/apiService';
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
 * @param {string} selectedDisplayName - The display name selected from DisplaySelector
 * @returns {object} - Form state and handlers
 */
export const useThresholdForm = (selectedDisplayName = null) => {
  const navigate = useNavigate();
  
  // Function to get initial form state with localStorage persistence
  const getPersistedFormState = () => {
    try {
      const saved = sessionStorage.getItem('kpi-threshold-form-data');
      if (saved) {
        const parsedData = JSON.parse(saved);
        console.log('Restored form data from sessionStorage:', parsedData);
        // Ensure direction always has a default value
        if (!parsedData.direction) {
          parsedData.direction = 'higher';
        }
        return parsedData;
      }
    } catch (error) {
      console.warn('Failed to restore form data from sessionStorage:', error);
    }
    console.log('No saved data found, using initial state');
    const initialState = getInitialFormState();
    // Ensure direction is always set to 'higher' by default
    initialState.direction = 'higher';
    return initialState;
  };

  const [formData, setFormData] = useState(getPersistedFormState());
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [thresholdValidation, setThresholdValidation] = useState({ isValid: true, message: '' });
  const [autoPopulating, setAutoPopulating] = useState(false);

  /**
   * Function to fetch excluded fields for current selection
   */
  const fetchExcludedFieldsForCurrentSelection = useCallback(async (collectionName, field) => {
    if (collectionName && field) {
      console.log('Fetching excluded fields for:', collectionName, field);
      
      try {
        const excludedFieldsResponse = await fetchExcludedFields(collectionName, field);
        
        if (excludedFieldsResponse.success) {
          const fetchedExcludedFields = excludedFieldsResponse.excludedFields || [];
          console.log('Auto-fetched excluded fields:', fetchedExcludedFields);
          return fetchedExcludedFields;
        } else {
          // If no excluded fields found or error, return empty array
          console.log('No excluded fields found, returning empty array');
          return [];
        }
      } catch (error) {
        console.error('Error auto-fetching excluded fields:', error);
        return [];
      }
    } else {
      // Return empty array when collection or field is not selected
      console.log('Missing collection/field, returning empty array');
      return [];
    }
  }, []);

  /**
   * Fetch and populate threshold data and direction when collection and field are chosen
   */
  const fetchAndPopulateThreshold = async (collectionName, field) => {
    if (!collectionName || !field) return;
    setAutoPopulating(true);
    try {
      const result = await fetchSingleThreshold(collectionName, field);
      if (result.success && result.threshold) {
        setFormData(prev => ({
          ...prev,
          greenThreshold: result.threshold.green,
          amberThreshold: result.threshold.amber,
          direction: result.threshold.direction,
        }));
      } else {
        // Clear threshold fields and direction if not found
        setFormData(prev => ({
          ...prev,
          greenThreshold: '',
          amberThreshold: '',
          direction: '',
        }));
      }
    } catch (error) {
      console.error('Error fetching threshold:', error);
      setFormData(prev => ({
        ...prev,
        greenThreshold: '',
        amberThreshold: '',
        direction: '',
      }));
    } finally {
      setAutoPopulating(false);
    }
  };

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
      sessionStorage.setItem('kpi-threshold-form-data', JSON.stringify(formData));
      console.log('Form data saved to sessionStorage:', formData);
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
    // Ensure direction is always set to 'higher'
    initialState.direction = 'higher';
    setFormData(initialState);
    setMessage({ type: '', text: '' });
    // Clear sessionStorage when resetting
    try {
      sessionStorage.removeItem('kpi-threshold-form-data');
      console.log('Form data cleared from sessionStorage'); 
    } catch (error) {
      console.warn('Failed to clear form data from sessionStorage:', error);
    }
  };

  // Clear messages
  const clearMessage = () => {
    setMessage({ type: '', text: '' });
  };

  // Shared logic for preview and save+preview
  const processForm = async ({ save = false, e = null, excludedFields = [] }) => {
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
          direction: validation.values.direction,
          ...(excludedFields.length > 0 && { excludedFields })
        };

        const saveResult = await saveThreshold(thresholdData);
        if (!saveResult.success) {
          setMessage(createMessage('error', saveResult.message || 'Failed to save threshold'));
          setLoading(false);
          return;
        }
        ///////////////////////////////////////////
        // Save Display as well with thresholdID //
        ///////////////////////////////////////////
        if (selectedDisplayName) {
          const displayConfig = {
            displayName: selectedDisplayName,
            thresholdId: saveResult.data._id // Assuming saveResult contains the saved threshold data
          };

          const saveDisplay = await saveDisplayConfig(displayConfig);
          
          if (!saveDisplay.success) {
            console.warn('Failed to save display config:', saveDisplay.message);
            // Continue with the process even if display config save fails
          }
        } else {
          console.warn('No display name provided, skipping display config save');
        }
      }

      // Analyze KPI data
      const analysisData = {
        collectionName: validation.values.collectionName,
        field: validation.values.field,
        greenThreshold: parseFloat(validation.values.green),
        amberThreshold: parseFloat(validation.values.amber),
        direction: validation.values.direction,
        excludedFields: excludedFields
      };

      console.log('Analysis data with excluded fields:', analysisData);

      const analysisResult = await analyzeKPIData(analysisData);


      if (!analysisResult.success) {
        setMessage(createMessage('error', analysisResult.error || 'Failed to analyze KPI data'));
        setLoading(false);
        return;
      }

      // Navigate to preview page with results
      navigate('/show-preview', {
        state: {
          analysisData: analysisResult.data,
          field: validation.values.field,
          collectionName: validation.values.collectionName,
          greenThreshold: parseFloat(validation.values.green),
          amberThreshold: parseFloat(validation.values.amber),
          direction: validation.values.direction,
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
  const handlePreview = (e, excludedFields = []) => processForm({ save: false, e, excludedFields });

  // Handle save and preview (saves to database then navigates to preview)
  const handleSaveAndPreview = (excludedFields = []) => processForm({ save: true, excludedFields });

  // Function to check if there are direction-related validation errors
  const hasDirectionError = () => {
    const { direction, greenThreshold, amberThreshold } = formData;
    
    // If direction is not set, that's an error
    if (!direction) {
      return true;
    }

    // If thresholds are set, check logical validation
    if (greenThreshold && amberThreshold) {
      const greenValue = parseFloat(greenThreshold);
      const amberValue = parseFloat(amberThreshold);
      
      if (!isNaN(greenValue) && !isNaN(amberValue)) {
        if (direction === 'higher' && greenValue <= amberValue) {
          return true; // Direction error: green should be > amber for "higher is better"
        } else if (direction === 'lower' && greenValue >= amberValue) {
          return true; // Direction error: green should be < amber for "lower is better"
        }
      }
    }
    
    return false;
  };

  return {
    formData,
    message,
    loading,
    thresholdValidation,
    autoPopulating,
    updateField,
    resetForm,
    clearMessage,
    handlePreview,
    handleSaveAndPreview,
    fetchAndPopulateThreshold,
    fetchExcludedFieldsForCurrentSelection,
    validation: validateThresholdForm(formData),
    hasDirectionError: hasDirectionError()
  };
};

/**
 * Custom hook for managing form state with collections and fields
 * @param {string} selectedDisplayName - The display name selected from DisplaySelector
 * @returns {object} - Complete form state and handlers
 */
export const useThresholdFormWithData = (selectedDisplayName = null) => {
  const formHook = useThresholdForm(selectedDisplayName);
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
