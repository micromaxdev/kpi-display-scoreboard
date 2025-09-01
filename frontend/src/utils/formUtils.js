/**
 * Form utility functions for threshold management
 */

/**
 * Validates threshold form data
 * @param {object} formData - Form data object
 * @param {string} formData.selectedCollection - Selected collection name
 * @param {string} formData.selectedField - Selected field name
 * @param {string} formData.greenThreshold - Green threshold value
 * @param {string} formData.amberThreshold - Amber threshold value
 * @param {string} formData.direction - Direction value
 * @returns {object} - Validation result
 */
export const validateThresholdForm = (formData) => {
  const errors = [];
  const { selectedCollection, selectedField, greenThreshold, amberThreshold, direction } = formData;

  // Required field validation
  if (!selectedCollection) {
    errors.push('Collection is required');
  }

  if (!selectedField) {
    errors.push('Field is required');
  }

  // Accept 0 as valid
  if (greenThreshold === undefined || greenThreshold === '') {
    errors.push('Green threshold is required');
  }

  if (amberThreshold === undefined || amberThreshold === '') {
    errors.push('Amber threshold is required');
  }

  if (!direction) {
    errors.push('Direction is required');
  }

  // Numeric validation
  const greenValue = parseFloat(greenThreshold);
  const amberValue = parseFloat(amberThreshold);

  if (greenThreshold && isNaN(greenValue)) {
    errors.push('Green threshold must be a valid number');
  }

  if (amberThreshold && isNaN(amberValue)) {
    errors.push('Amber threshold must be a valid number');
  }

  // Logical validation - green should be better than amber
  if (!isNaN(greenValue) && !isNaN(amberValue)) {
    if (direction === 'higher' && greenValue <= amberValue) {
      errors.push('For "Higher is Better", Green threshold should be greater than Amber threshold');
    } else if (direction === 'lower' && greenValue >= amberValue) {
      errors.push('For "Lower is Better", Green threshold should be less than Amber threshold');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    values: {
      collectionName: selectedCollection,
      field: selectedField,
      green: greenValue,
      amber: amberValue,
      direction
    }
  };
};

/**
 * Resets form state to initial values
 * @returns {object} - Initial form state
 */
export const getInitialFormState = () => ({
  selectedCollection: '',
  selectedField: '',
  greenThreshold: '',
  amberThreshold: '',
  direction: 'higher'
});

/**
 * Creates a message object for UI feedback
 * @param {string} type - Message type ('success', 'error', 'warning', 'info')
 * @param {string} text - Message text
 * @returns {object} - Message object
 */
export const createMessage = (type, text) => ({
  type,
  text
});

/**
 * Formats threshold values for display
 * @param {number} value - Threshold value
 * @param {string} direction - Direction ('higher' or 'lower')
 * @returns {string} - Formatted display string
 */
export const formatThresholdDisplay = (value, direction) => {
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;
  const directionText = direction === 'higher' ? '↑' : '↓';
  return `${formattedValue} ${directionText}`;
};

/**
 * Gets placeholder text based on form state
 * @param {object} state - Current form state
 * @param {string} fieldType - Type of field ('collection' or 'field')
 * @returns {string} - Appropriate placeholder text
 */
export const getPlaceholderText = (state, fieldType) => {
  const { selectedCollection, fields, loading } = state;

  if (fieldType === 'collection') {
    return loading ? 'Loading collections...' : 'Select a collection...';
  }

  if (fieldType === 'field') {
    if (!selectedCollection) {
      return 'Select a collection first...';
    }
    if (loading) {
      return 'Loading fields...';
    }
    if (fields && fields.length === 0) {
      return 'No measurable fields found';
    }
    return 'Select a field...';
  }

  return '';
};

/**
 * Checks if form submission should be disabled
 * @param {object} formData - Current form data
 * @param {boolean} loading - Loading state
 * @returns {boolean} - True if form should be disabled
 */
export const isFormDisabled = (formData, loading) => {
  const validation = validateThresholdForm(formData);
  return loading || !validation.isValid;
};

/**
 * Formats field name for display (converts snake_case/camelCase to readable format)
 * @param {string} fieldName - Raw field name
 * @returns {string} - Formatted field name
 */
export const formatFieldDisplayName = (fieldName) => {
  return fieldName
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/[_-]/g, ' ') // Replace underscores and hyphens with spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Validates threshold values based on direction
 * @param {string|number} greenThreshold - Green threshold value
 * @param {string|number} amberThreshold - Amber threshold value
 * @param {string} direction - Direction ('higher' or 'lower')
 * @returns {object} - Validation result with success status and message
 */
export async function checkThresholds(greenThreshold, amberThreshold, direction) {
    const green = parseFloat(greenThreshold);
    const amber = parseFloat(amberThreshold);
    
    // Check if values are valid numbers
    if (isNaN(green) || isNaN(amber)) {
        return {
            success: false,
            message: 'Threshold values must be valid numbers'
        };
    }
    
    if (direction === 'higher') {
        if (green <= amber) {
            return {
                success: false,
                message: 'For HIGHER direction, green threshold must be greater than amber threshold'
            };
        }
    } else if (direction === 'lower') {
        if (green >= amber) {
            return {
                success: false,
                message: 'For LOWER direction, green threshold must be less than amber threshold'
            };
        }
    } else {
        return {
            success: false,
            message: 'Direction must be either HIGHER or LOWER'
        };
    }
    
    return { success: true };
}
