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
    'customers', 'visits', 'views', 'clicks', 'downloads', 'uploads',
    'margin', 'discount', 'tax', 'interest', 'commission',
    // Date fields (for time-based measurements)
    'date', 'time', 'created', 'updated', 'modified', 'timestamp',
    'start', 'end', 'deadline', 'expires'
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

/**
 * Determines the smart default direction for KPI analysis based on field name
 * @param {string} fieldName - The name of the field to analyze
 * @returns {string} - 'higher' if higher values are better, 'lower' if lower values are better
 */
export const getSmartDefaultDirection = (fieldName) => {
  const fieldLower = fieldName.toLowerCase();
  
  // Fields where LOWER values are generally better
  const lowerIsBetterPatterns = [
    // Cost/Expense related
    'cost', 'expense', 'fee', 'charge', 'price', 'spending',
    'overhead', 'budget', 'expenditure', 'outgoing', 'payment',
    
    // Time/Duration related (usually want to minimize)
    'time', 'duration', 'delay', 'wait', 'processing_time',
    'response_time', 'load_time', 'downtime', 'latency',
    'turnaround', 'cycle_time', 'lead_time',
    
    // Error/Problem related
    'error', 'failure', 'defect', 'bug', 'issue', 'problem',
    'complaint', 'return', 'refund', 'cancellation', 'churn',
    'dropout', 'bounce', 'exit', 'abandon', 'reject',
    
    // Risk/Loss related
    'risk', 'loss', 'debt', 'liability', 'waste', 'scrap',
    'rework', 'overtime', 'turnover', 'attrition',
    
    // Inventory/Stock (usually want to minimize excess)
    'inventory_days', 'stock_days', 'holding_cost',
    
    // Age/Days related (usually want fresh/recent)
    'age', 'days_outstanding', 'overdue', 'past_due',
    
    // Due date related (sooner is better)
    'due', 'due_date', 'deadline', 'expiry', 'expires',
    'days_until_due', 'time_to_deadline', 'overdue_days'
  ];
  
  // Fields where HIGHER values are generally better
  const higherIsBetterPatterns = [
    // Revenue/Income related
    'revenue', 'income', 'profit', 'margin', 'earnings',
    'sales', 'commission', 'bonus', 'tip', 'dividend',
    
    // Performance/Quality related
    'performance', 'efficiency', 'productivity', 'quality',
    'score', 'rating', 'grade', 'satisfaction', 'nps',
    'accuracy', 'precision', 'success', 'completion',
    'achievement', 'target', 'goal', 'kpi', 'metric',
    
    // Volume/Quantity related (usually want more)
    'volume', 'quantity', 'count', 'total', 'sum',
    'orders', 'transactions', 'sales', 'customers',
    'visits', 'views', 'clicks', 'downloads', 'signups',
    'subscribers', 'followers', 'likes', 'shares',
    'engagement', 'conversion', 'retention', 'loyalty',
    
    // Growth/Increase related
    'growth', 'increase', 'gain', 'improvement', 'progress',
    'advancement', 'development', 'expansion', 'upturn',
    
    // Capacity/Availability related
    'capacity', 'availability', 'uptime', 'utilization',
    'throughput', 'bandwidth', 'coverage', 'reach',
    
    // Experience/Skill related
    'experience', 'skill', 'expertise', 'knowledge',
    'training', 'certification', 'education', 'tenure'
  ];
  
  // Check for lower is better patterns
  const isLowerBetter = lowerIsBetterPatterns.some(pattern => 
    fieldLower.includes(pattern)
  );
  
  if (isLowerBetter) {
    return 'lower';
  }
  
  // Check for higher is better patterns
  const isHigherBetter = higherIsBetterPatterns.some(pattern => 
    fieldLower.includes(pattern)
  );
  
  if (isHigherBetter) {
    return 'higher';
  }
  
  // Default fallback: for most business metrics, higher is generally better
  return 'higher';
};

/**
 * Gets direction suggestion with explanation for a given field
 * @param {string} fieldName - The name of the field to analyze
 * @returns {object} - Object containing suggested direction and explanation
 */
export const getDirectionSuggestion = (fieldName) => {
  if (!fieldName) {
    return {
      suggestion: null,
      explanation: '',
      confidence: 'none'
    };
  }

  const suggestedDirection = getSmartDefaultDirection(fieldName);
  const fieldLower = fieldName.toLowerCase();
  
  // Determine confidence level and explanation
  let explanation = '';
  let confidence = 'medium';
  
  // High confidence patterns
  const highConfidencePatterns = {
    lower: ['cost', 'expense', 'error', 'failure', 'time', 'delay', 'complaint', 'due', 'deadline', 'overdue'],
    higher: ['revenue', 'profit', 'sales', 'satisfaction', 'efficiency', 'quality']
  };
  
  // Check for high confidence patterns
  const isHighConfidence = highConfidencePatterns[suggestedDirection]?.some(pattern => 
    fieldLower.includes(pattern)
  );
  
  if (isHighConfidence) {
    confidence = 'high';
  }
  
  // Generate explanation based on suggested direction
  if (suggestedDirection === 'lower') {
    if (fieldLower.includes('cost') || fieldLower.includes('expense')) {
      explanation = 'Lower costs are typically better for business performance';
    } else if (fieldLower.includes('time') || fieldLower.includes('delay')) {
      explanation = 'Shorter processing times usually indicate better efficiency';
    } else if (fieldLower.includes('error') || fieldLower.includes('failure')) {
      explanation = 'Fewer errors/failures indicate better quality';
    } else if (fieldLower.includes('due') || fieldLower.includes('deadline') || fieldLower.includes('overdue')) {
      explanation = 'Sooner due dates or fewer overdue days indicate better timeline management';
    } else {
      explanation = 'Lower values are generally preferred for this type of metric';
    }
  } else {
    if (fieldLower.includes('revenue') || fieldLower.includes('sales')) {
      explanation = 'Higher revenue/sales indicate better business performance';
    } else if (fieldLower.includes('satisfaction') || fieldLower.includes('quality')) {
      explanation = 'Higher satisfaction/quality scores are better';
    } else if (fieldLower.includes('efficiency') || fieldLower.includes('productivity')) {
      explanation = 'Higher efficiency indicates better performance';
    } else {
      explanation = 'Higher values are generally preferred for this type of metric';
    }
  }
  
  return {
    suggestion: suggestedDirection,
    explanation,
    confidence
  };
};
