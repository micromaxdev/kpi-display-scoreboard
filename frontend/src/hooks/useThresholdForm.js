/**
 * Custom hooks for threshold form management
 */
import { useState, useEffect } from 'react';
import { fetchCollections, fetchCollectionFields, saveThreshold, fetchCollectionSampleData } from '../services/apiService';
import { filterMeasurableFields } from '../utils/fieldUtils';
import { validateThresholdForm, createMessage, getInitialFormState } from '../utils/formUtils';

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
  const [formData, setFormData] = useState(getInitialFormState());
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // Update individual form fields
  const updateField = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData(getInitialFormState());
    setMessage({ type: '', text: '' });
  };

  // Clear messages
  const clearMessage = () => {
    setMessage({ type: '', text: '' });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateThresholdForm(formData);
    
    if (!validation.isValid) {
      setMessage(createMessage('error', validation.errors.join(', ')));
      return;
    }

    // Submit to API
    setLoading(true);
    const result = await saveThreshold(validation.values);
    
    if (result.success) {
      setMessage(createMessage('success', result.message));
      resetForm();
    } else {
      setMessage(createMessage('error', result.message));
    }
    
    setLoading(false);
  };

  return {
    formData,
    message,
    loading,
    updateField,
    resetForm,
    clearMessage,
    handleSubmit,
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

  // When collection changes, reset field selection
  useEffect(() => {
    if (formHook.formData.selectedCollection) {
      formHook.updateField('selectedField', '');
    }
  }, [formHook.formData.selectedCollection]);

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
