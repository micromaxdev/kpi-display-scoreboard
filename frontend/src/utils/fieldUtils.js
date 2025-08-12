/**
 * Utility functions for field filtering and validation
 */

/**
 * Determines if a field name represents a measurable/numeric field suitable for KPI calculations
 * @param {string} fieldName - The name of the field to evaluate
 * @returns {boolean} - True if the field is considered measurable
 */
export const isMeasurableField = (fieldName) => {
  const fieldLower = fieldName.toLowerCase();
  
  // Common measurable field patterns
  const measurablePatterns = [
    // Numeric/Amount fields
    'amount', 'balance', 'total', 'sum', 'count', 'quantity', 'qty',
    'price', 'cost', 'value', 'revenue', 'profit', 'loss', 'fee',
    'rate', 'percentage', 'percent', 'ratio', 'score', 'rating',
    'weight', 'height', 'length', 'width', 'depth', 'size',
    'volume', 'capacity', 'duration', 'time', 'hours', 'minutes',
    'days', 'weeks', 'months', 'years', 'age', 'experience',
    'salary', 'income', 'expense', 'budget', 'target', 'goal',
    'metric', 'kpi', 'performance', 'efficiency', 'productivity',
    'sales', 'orders', 'transactions', 'payments', 'refunds',
    'inventory', 'stock', 'units', 'items', 'products', 'services',
    'customers', 'users', 'members', 'employees', 'staff',
    'visits', 'views', 'clicks', 'downloads', 'uploads',
    'margin', 'discount', 'tax', 'interest', 'commission',
    // Date fields (for time-based measurements)
    'date', 'time', 'created', 'updated', 'modified', 'timestamp',
    'start', 'end', 'deadline', 'due', 'expiry', 'expires'
  ];
  
  // Field name exclusions (typically non-measurable)
  const excludePatterns = [
    'id', 'name', 'title', 'description', 'comment', 'note',
    'status', 'type', 'category', 'class', 'group', 'tag',
    'email', 'phone', 'address', 'city', 'state', 'country',
    'url', 'link', 'path', 'file', 'image', 'photo',
    'password', 'hash', 'token', 'key', 'secret', 'code',
    'message', 'text', 'content', 'body', 'subject','employee'
  ];
  
  // Check if field should be excluded
  const shouldExclude = excludePatterns.some(pattern => 
    fieldLower.includes(pattern)
  );
  
  if (shouldExclude) return false;
  
  // Check if field matches measurable patterns
  const isMeasurable = measurablePatterns.some(pattern => 
    fieldLower.includes(pattern)
  );
  
  return isMeasurable;
};

/**
 * Filters an array of field names to only include measurable fields
 * @param {string[]} fields - Array of field names
 * @returns {string[]} - Filtered array containing only measurable fields
 */
export const filterMeasurableFields = (fields) => {
  return fields.filter(field => isMeasurableField(field));
};

/**
 * Validates field name patterns and provides suggestions
 * @param {string} fieldName - The field name to validate
 * @returns {object} - Validation result with suggestions
 */
export const validateFieldName = (fieldName) => {
  const isMeasurable = isMeasurableField(fieldName);
  
  return {
    isValid: isMeasurable,
    fieldName,
    suggestion: isMeasurable 
      ? 'This field appears suitable for KPI measurement'
      : 'This field may not be suitable for numeric KPI calculations'
  };
};
