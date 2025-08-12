/**
 * API service functions for KPI Threshold management
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches the list of all collections from the backend
 * @returns {Promise<object>} - API response with collections data
 */
export const fetchCollections = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/collectionList`);
    const data = await response.json();
    
    console.log('Collections response:', data);
    
    return {
      success: data.success,
      collections: data.collections || [],
      error: null
    };
  } catch (error) {
    console.error('Error fetching collections:', error);
    return {
      success: false,
      collections: [],
      error: 'Error connecting to server'
    };
  }
};

/**
 * Fetches the fields for a specific collection
 * @param {string} collectionName - Name of the collection
 * @returns {Promise<object>} - API response with fields data
 */
export const fetchCollectionFields = async (collectionName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/collectionFields/${collectionName}`);
    const data = await response.json();
    
    console.log('Fields response for', collectionName, ':', data);
    
    return {
      success: data.success,
      fields: data.fields || [],
      collectionName: data.collectionName,
      error: null
    };
  } catch (error) {
    console.error('Error fetching fields:', error);
    return {
      success: false,
      fields: [],
      collectionName,
      error: 'Error fetching collection fields'
    };
  }
};

/**
 * Fetches sample data from a collection (limited to 5 records)
 * @param {string} collectionName - Name of the collection
 * @returns {Promise<object>} - API response with sample data
 */
export const fetchCollectionSampleData = async (collectionName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/find/${collectionName}?limit=5&page=1`);
    const data = await response.json();
    
    console.log('Sample data response for', collectionName, ':', data);
    
    return {
      success: data.success,
      data: data.data || [],
      collectionName: data.collectionName,
      error: null
    };
  } catch (error) {
    console.error('Error fetching sample data:', error);
    return {
      success: false,
      data: [],
      collectionName,
      error: 'Error fetching sample data'
    };
  }
};

/**
 * Saves a threshold configuration to the backend
 * @param {object} thresholdData - Threshold configuration object
 * @param {string} thresholdData.collectionName - Name of the collection
 * @param {string} thresholdData.field - Field name
 * @param {number} thresholdData.green - Green threshold value
 * @param {number} thresholdData.amber - Amber threshold value
 * @param {string} thresholdData.direction - Direction ('higher' or 'lower')
 * @returns {Promise<object>} - API response
 */
export const saveThreshold = async (thresholdData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/threshold-api/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        collectionName: thresholdData.collectionName,
        field: thresholdData.field,
        green: parseFloat(thresholdData.green),
        amber: parseFloat(thresholdData.amber),
        direction: thresholdData.direction
      }),
    });

    const data = await response.json();
    
    console.log('Threshold save response:', data);
    
    return {
      success: data.success,
      message: data.message || (data.success ? 'Threshold saved successfully!' : 'Failed to save threshold'),
      data: data.threshold || null,
      error: null
    };
  } catch (error) {
    console.error('Error saving threshold:', error);
    return {
      success: false,
      message: 'Error connecting to server',
      data: null,
      error: error.message
    };
  }
};

/**
 * Fetches existing threshold for a specific collection and field
 * @param {string} collectionName - Name of the collection
 * @param {string} field - Field name
 * @returns {Promise<object>} - API response with threshold data
 */
export const fetchThreshold = async (collectionName, field) => {
  try {
    const response = await fetch(`${API_BASE_URL}/threshold-api/single?collectionName=${collectionName}&field=${field}`);
    const data = await response.json();
    
    console.log('Threshold fetch response:', data);
    
    return {
      success: data.success,
      threshold: data.threshold || null,
      error: null
    };
  } catch (error) {
    console.error('Error fetching threshold:', error);
    return {
      success: false,
      threshold: null,
      error: 'Error fetching threshold data'
    };
  }
};

/**
 * Fetches all thresholds for a specific collection
 * @param {string} collectionName - Name of the collection
 * @returns {Promise<object>} - API response with thresholds data
 */
export const fetchThresholdsByCollection = async (collectionName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/threshold-api/?collectionName=${collectionName}`);
    const data = await response.json();
    
    console.log('Collection thresholds response:', data);
    
    return {
      success: data.success,
      thresholds: data.thresholds || [],
      error: null
    };
  } catch (error) {
    console.error('Error fetching collection thresholds:', error);
    return {
      success: false,
      thresholds: [],
      error: 'Error fetching collection thresholds'
    };
  }
};
