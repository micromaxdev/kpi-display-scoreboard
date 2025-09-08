/**
 * API service functions for KPI Threshold management
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches screen configuration by screen name
 * @param {string} screenName - Name of the screen
 * @returns {Promise<object>} - API response with screen data
 */
export const fetchScreenConfig = async (screenName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/screen-api/${screenName}`);
    const data = await response.json();
    return {
      success: true,
      screen: data,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching screen config:', error);
    return {
      success: false,
      screen: null,
      error: 'Error connecting to server',
    };
  }
};

/**
 * Fetches all screens from the backend
 * @returns {Promise<object>} - API response with screens array
 */
export const fetchAllScreens = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/screen-api`);
    const data = await response.json();
    return {
      success: true,
      screens: Array.isArray(data) ? data : [],
      error: null,
    };
  } catch (error) {
    console.error('Error fetching all screens:', error);
    return {
      success: false,
      screens: [],
      error: 'Error connecting to server',
    };
  }
};

/**
 * Creates a new screen
 * @param {object} screenData - Screen data to create
 * @returns {Promise<object>} - API response with created screen
 */
export const createScreen = async (screenData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/screen-api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(screenData),
    });
    const data = await response.json();
    return {
      success: response.ok,
      screen: data,
      error: response.ok ? null : data.error || 'Failed to create screen',
    };
  } catch (error) {
    console.error('Error creating screen:', error);
    return {
      success: false,
      screen: null,
      error: 'Error connecting to server',
    };
  }
};

/**
 * Updates a screen by name
 * @param {string} screenName - Name of the screen to update
 * @param {object} screenData - Updated screen data
 * @returns {Promise<object>} - API response with updated screen
 */
export const updateScreen = async (screenName, screenData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/screen-api/${screenName}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(screenData),
    });
    const data = await response.json();
    return {
      success: response.ok,
      screen: data,
      error: response.ok ? null : data.error || 'Failed to update screen',
    };
  } catch (error) {
    console.error('Error updating screen:', error);
    return {
      success: false,
      screen: null,
      error: 'Error connecting to server',
    };
  }
};

/**
 * Deletes a screen by name
 * @param {string} screenName - Name of the screen to delete
 * @returns {Promise<object>} - API response
 */
export const deleteScreen = async (screenName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/screen-api/${screenName}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return {
      success: response.ok,
      message: data.message || 'Screen deleted successfully',
      error: response.ok ? null : data.error || 'Failed to delete screen',
    };
  } catch (error) {
    console.error('Error deleting screen:', error);
    return {
      success: false,
      message: null,
      error: 'Error connecting to server',
    };
  }
};

/**
 * Fetches all displays from the backend
 * @returns {Promise<object>} - API response with displays array
 */
export const fetchAllDisplays = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/display-api`);
    const data = await response.json();
    return {
      success: data.success !== false,
      displays: data.displays || [],
      error: data.error || null,
    };
  } catch (error) {
    console.error('Error fetching all displays:', error);
    return {
      success: false,
      displays: [],
      error: 'Error connecting to server',
    };
  }
};

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
      direction: thresholdData.direction,
      ...(thresholdData.excludedFields && { excludedFields: thresholdData.excludedFields })
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
 * Calls the analyze API with given parameters
 * @param {{collectionName: string, field: string, greenThreshold: string|number, amberThreshold: string|number, direction: 'higher'|'lower'}} payload
 * @returns {Promise<object>} - API response from analyze
 */
export const analyzeKPIData = async ({ collectionName, field, greenThreshold, amberThreshold, direction, excludedFields}) => {
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
        excludedFields
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

/**
 * Utility function to convert string to camelCase
 * @param {string} str - String to convert
 * @returns {string} - CamelCase string
 */
const toCamelCase = (str) => {
  return str
    .replace(/[^a-zA-Z0-9 ]+/g, '') // Remove non-alphanumeric except spaces
    .trim()
    .split(/\s+/)
    .map((word, idx) =>
      idx === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
};

/**
 * Validates file for upload
 * @param {File} file - File object to validate
 * @returns {object} - Validation result
 */
const validateFile = (file) => {
  const allowedTypes = ['.csv', '.xlsx', '.xls'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  if (!allowedTypes.includes(fileExtension)) {
    return {
      isValid: false,
      error: 'Please select a CSV or Excel file (.csv, .xlsx, .xls)'
    };
  }

  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 50MB'
    };
  }

  return { isValid: true, error: null };
};

/**
 * Uploads a file to create or update a collection
 * @param {string} collectionName - Name of the collection
 * @param {File} file - File to upload
 * @returns {Promise<object>} - Upload result
 */
export const uploadFileToCollection = async (collectionName, file) => {
  try {
    // Validate inputs
    if (!collectionName?.trim()) {
      return {
        success: false,
        message: 'Collection name is required',
        error: 'INVALID_COLLECTION_NAME'
      };
    }

    if (!file) {
      return {
        success: false,
        message: 'File is required',
        error: 'NO_FILE_SELECTED'
      };
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.error,
        error: 'INVALID_FILE'
      };
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);

    // Convert collection name to camelCase
    const camelCaseCollectionName = toCamelCase(collectionName);

    // Setup timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes timeout

    try {
      const response = await fetch(`${API_BASE_URL}/file-api/${camelCaseCollectionName}/upload`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const result = await response.json();

      if (response.ok && result.success) {
        return {
          success: true,
          data: result.data,
          collectionName: camelCaseCollectionName,
          originalName: collectionName,
          message: `Successfully uploaded ${result.data?.insertedCount || 0} records`
        };
      } else {
        return {
          success: false,
          message: result.message || 'Upload failed',
          error: 'UPLOAD_FAILED'
        };
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return {
          success: false,
          message: 'Upload timed out. Please try again.',
          error: 'TIMEOUT'
        };
      }
      
      return {
        success: false,
        message: 'Network error occurred. Please check your connection.',
        error: 'NETWORK_ERROR'
      };
    }

  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      message: 'Unexpected error occurred',
      error: 'UNEXPECTED_ERROR'
    };
  }
};

/**
 * Fetch a single threshold by collection and field
 */
export const fetchSingleThreshold = async (collectionName, field) => {
  try {
    const response = await fetch(`${API_BASE_URL}/threshold-api/single?collectionName=${encodeURIComponent(collectionName)}&field=${encodeURIComponent(field)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching single threshold:', error);
    return { success: false, threshold: null, error: error.message };
  }
};

/**
 * Creates a new display/playlist
 * @param {string} displayName - Name of the new display
 * @param {number} time - Cycle time for the display in seconds
 * @returns {Promise<object>} - API response
 */
export const createDisplay = async (displayName, time = 30) => {
  try {
    const response = await fetch(`${API_BASE_URL}/display-api/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        displayName,
        time
      }),
    });
    const data = await response.json();
    
    return {
      success: data.success,
      message: data.message || (data.success ? 'Display created successfully!' : 'Failed to create display'),
      data: data.display || null,
      error: data.error || null
    };
  } catch (error) {
    console.error('Error creating display:', error);
    return {
      success: false,
      message: 'Error connecting to server',
      data: null,
      error: error.message
    };
  }
};

/**
 * Deletes a display/playlist
 * @param {string} displayName - Name of the display to delete
 * @returns {Promise<object>} - API response
 */
export const deleteDisplay = async (displayName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/display-api/${encodeURIComponent(displayName)}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    
    return {
      success: data.success,
      message: data.message || (data.success ? 'Display deleted successfully!' : 'Failed to delete display'),
      error: data.error || null
    };
  } catch (error) {
    console.error('Error deleting display:', error);
    return {
      success: false,
      message: 'Error connecting to server',
      error: error.message
    };
  }
};

/**
 * Fetches excluded fields for a threshold by collection and field
 * @param {string} collectionName - Name of the collection
 * @param {string} field - Field name
 * @returns {Promise<object>} - API response with excluded fields
 */
export const fetchExcludedFields = async (collectionName, field) => {
  try {
    const response = await fetch(`${API_BASE_URL}/threshold-api/excluded-fields?collectionName=${encodeURIComponent(collectionName)}&field=${encodeURIComponent(field)}`);
    const data = await response.json();
    
    return {
      success: data.success,
      excludedFields: data.data?.excludedFields || [],
      error: data.error || null
    };
  } catch (error) {
    console.error('Error fetching excluded fields:', error);
    return {
      success: false,
      excludedFields: [],
      error: 'Error connecting to server'
    };
  }
};

/**
 * Fetches all saved thresholds
 * @returns {Promise<object>} - API response with all thresholds
 */
export const fetchAllThresholds = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/threshold-api/all`);
    const data = await response.json();
    
    return {
      success: data.success,
      thresholds: data.thresholds || [],
      error: data.error || null
    };
  } catch (error) {
    console.error('Error fetching all thresholds:', error);
    return {
      success: false,
      thresholds: [],
      error: 'Error connecting to server'
    };
  }
};
