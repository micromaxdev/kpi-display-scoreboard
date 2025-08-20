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

        // Sort collections alphabetically if present
        const collections = (data.collections || []).slice().sort((a, b) => {
            if (typeof a === 'string' && typeof b === 'string') {
                return a.localeCompare(b);
            }
            return 0;
        });

        return {
            success: data.success,
            collections,
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
    const requestBody = {
      collectionName: thresholdData.collectionName,
      field: thresholdData.field,
      green: thresholdData.green,
      amber: thresholdData.amber,
      direction: thresholdData.direction
    };
    const response = await fetch(`${API_BASE_URL}/threshold-api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    const data = await response.json();
    
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

export const saveDisplayConfig = async (displayData) => {
  try {
    const requestBody = {
      displayName: displayData.displayName,
      time: displayData.time || 30,
      thresholdId: displayData.thresholdId,
    };
    const response = await fetch(`${API_BASE_URL}/display-api/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();

    return {
      success: data.success,
      message: data.message || (data.success ? 'Display configuration saved successfully!' : 'Failed to save display configuration'),
      data: data.display || null,
      error: null
    };
  } catch (error) {
    console.error('Error saving display configuration:', error);
    return {
      success: false,
      message: 'Error connecting to server',
      data: null,
      error: error.message
    };
  }
}
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

/**
 * Calls the analyze API with given parameters
 * @param {{collectionName: string, field: string, greenThreshold: string|number, amberThreshold: string|number, direction: 'higher'|'lower'}} payload
 * @returns {Promise<object>} - API response from analyze
 */
export const analyzeKPIData = async ({ collectionName, field, greenThreshold, amberThreshold, direction }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/kpi-api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collectionName,
        field,
        greenThreshold,
        amberThreshold,
        direction,
      }),
    });
    const data = await response.json();
    return { success: data.success !== false, data, error: null };
  } catch (error) {
    console.error('Error calling analyze API:', error);
    return { success: false, data: null, error: error.message };
  }
};

/**
 * Fetches display configuration by display name
 * @param {string} displayName - Name of the display
 * @returns {Promise<object>} - API response with display data and thresholds
 */
export const fetchDisplayConfig = async (displayName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/display-api/${displayName}`);
    const data = await response.json();
    return {
      success: data.success,
      display: data.display || null,
      error: data.error || null,
    };
  } catch (error) {
    console.error('Error fetching display config:', error);
    return {
      success: false,
      display: null,
      error: 'Error connecting to server',
    };
  }
};

/**
 * Downloads Excel file with KPI analysis data
 * @param {object} downloadData - Download configuration object
 * @param {string} downloadData.collectionName - Name of the collection
 * @param {string} downloadData.field - Field name
 * @param {string|number} downloadData.greenThreshold - Green threshold value
 * @param {string|number} downloadData.amberThreshold - Amber threshold value
 * @param {string} downloadData.direction - Direction ('higher' or 'lower')
 * @returns {Promise<object>} - API response
 */
export const downloadExcel = async (downloadData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/kpi-api/download-excel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        collectionName: downloadData.collectionName,
        field: downloadData.field,
        greenThreshold: downloadData.greenThreshold,
        amberThreshold: downloadData.amberThreshold,
        direction: downloadData.direction,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the filename from the response headers
    const contentDisposition = response.headers.get('content-disposition');
    let filename = 'kpi-analysis.xlsx'; // default fallback
    console.log('conten')
    if (contentDisposition) {
      console.log('Content-Disposition header:', contentDisposition);
      
      // Simple and reliable approach: look for filename="..." or filename=...
      const filenameMatch = contentDisposition.match(/filename=["']?([^"']+)["']?/);
      if (filenameMatch) {
        filename = filenameMatch[1];
        console.log('Extracted filename:', filename);
      } else {
        console.log('No filename found in Content-Disposition, using default');
      }
    } else {
      console.log('No Content-Disposition header found');
    }

    // Create blob from response
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return {
      success: true,
      message: 'Excel file downloaded successfully!',
      error: null
    };
  } catch (error) {
    console.error('Error downloading Excel file:', error);
    return {
      success: false,
      message: 'Error downloading Excel file',
      error: error.message
    };
  }
};
