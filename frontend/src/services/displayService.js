const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Display Service - Handles all display-related API operations
 */
export class DisplayService {
  /**
   * Create a new display
   * @param {string} displayName - Name of the new display
   * @param {number} time - Cycle time for the display
   * @returns {Promise<Object>} Result of creation
   */
  static async createDisplay(displayName, time) {
    try {
      const response = await fetch(`${API_BASE_URL}/display-api`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ displayName, time })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating display:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete a display by name
   * @param {string} displayName - Name of the display to delete
   * @returns {Promise<Object>} Result of deletion
   */
  static async deleteDisplay(displayName) {
    try {
      const response = await fetch(`${API_BASE_URL}/display-api/${displayName}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting display:', error);
      return { success: false, error: error.message };
    }
  }
  /**
   * Fetch available display options for populating display list
   * @returns {Promise<Array>} Array of display option objects
   */
  static async getDisplayOptions() {
    try {
      const response = await fetch(`${API_BASE_URL}/display-api`);
      if (!response.ok) {
        throw new Error(`Failed to fetch display options: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (!data.success || !Array.isArray(data.displays)) {
        throw new Error(data.message || 'Invalid display options response');
      }
      // Map to display option objects for UI
      return data.displays.map(d => ({
        displayName: d.displayName,
        thresholdIds: d.thresholdIds,
        time: d.time,
        updatedAt: d.updatedAt
      }));
    } catch (error) {
      console.error('Error fetching display options:', error);
      return [];
    }
  }
  
  /**
   * Fetch display configuration and thresholds
   * @param {string} displayName - Name of the display
   * @returns {Promise<Object>} Display configuration with thresholds
   */
  static async fetchDisplayConfig(displayName) {
    if (!displayName) {
      throw new Error('Display name is required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/display-api/${displayName}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch display: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch display configuration');
      }

      return {
        success: true,
        thresholds: data.display?.thresholdIds || [],
        display: data.display
      };
    } catch (error) {
      console.error('Error fetching display configuration:', error);
      return {
        success: false,
        error: error.message,
        thresholds: []
      };
    }
  }

  /**
   * Reorder thresholds in a display
   * @param {string} displayName - Name of the display
   * @param {Array<string>} thresholdIds - Array of threshold IDs in new order
   * @returns {Promise<Object>} Result of reorder operation
   */
  static async reorderThresholds(displayName, thresholdIds) {
    if (!displayName || !Array.isArray(thresholdIds)) {
      throw new Error('Display name and threshold IDs array are required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/display-api/${displayName}/thresholds/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thresholdIds: thresholdIds
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to reorder thresholds: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to reorder thresholds');
      }

      return {
        success: true,
        display: data.display,
        message: 'Threshold order updated successfully'
      };
    } catch (error) {
      console.error('Error reordering thresholds:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Remove a threshold from a display
   * @param {string} displayName - Name of the display
   * @param {string} thresholdId - ID of the threshold to remove
   * @returns {Promise<Object>} Result of remove operation
   */
  static async removeThreshold(displayName, thresholdId) {
    if (!displayName || !thresholdId) {
      throw new Error('Display name and threshold ID are required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/display-api/${displayName}/thresholds`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: displayName,
          thresholdId: thresholdId
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to remove threshold: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to remove threshold');
      }

      return {
        success: true,
        display: data.display,
        message: 'Threshold removed successfully'
      };
    } catch (error) {
      console.error('Error removing threshold:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
    /**
     * Updates display configuration (time and thresholds)
     * @param {string} displayName - Name of the display to update
     * @param {number} time - Polling/cycling time in seconds
     * @param {Array} thresholdIds - Array of threshold IDs
     * @returns {Promise<object>} - API response
     */
    static async updateDisplayConfig(displayName, time, thresholdIds) {
    try {
        const response = await fetch(`${API_BASE_URL}/display-api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            displayName,
            time,
            thresholdIds
        }),
        });
        
        const data = await response.json();
        return {
        success: data.success || response.ok,
        data: data.data || null,
        error: data.error || null,
        };
    } catch (error) {
        console.error('Error updating display config:', error);
        return {
        success: false,
        data: null,
        error: 'Error connecting to server',
        };
    }
    };
}

export default DisplayService;
