/**
 * Determines if a field is a date-type field (due, input, created, date)
 */
function isDueOrInputDate(field) {
    if (!field) return false;
    const f = field.toLowerCase();
    return (
        f.includes('due') ||
        f.includes('input') ||
        f.includes('created') ||
        f.includes('date')
    );
}

/**
 * RAG logic for date fields
 */
function getDateRAGCategory(value, thresholds, direction) {
    const { green, amber } = thresholds;
    if (direction === 'lower') {
        // For "lower" direction: Recent = Good, Old = Bad
        if (value >= 0) return 'green'; // Future dates = good
        else {
            const days = Math.abs(value);
            if (days <= green) return 'green';    // Recently past = good
            else if (days <= amber) return 'amber'; // Moderately past = warning
            else return 'red';                     // Far past = bad
        }
    } else {
        // For "higher" direction: Old = Good, Recent = Bad
        if (value >= 0) {
            // Future dates - shouldn't happen for creation dates, but treat as new
            return 'red';
        } else {
            const days = Math.abs(value); // Convert to positive days ago
            if (days >= green) return 'green';      // Very old = good
            else if (days >= amber) return 'amber'; // Moderately old = warning
            else return 'red';                      // Recent = bad
        }
    }
}

/**
 * RAG logic for amount fields
 */
function getAmountRAGCategory(value, thresholds, direction) {
    const { green, amber } = thresholds;
    if (direction === 'lower') {
        if (value <= green) return 'green';
        else if (value <= amber) return 'amber';
        else return 'red';
    } else {
        if (value >= green) return 'green';
        else if (value >= amber) return 'amber';
        else return 'red';
    }
}

module.exports = {
    isDueOrInputDate,
    getDateRAGCategory,
    getAmountRAGCategory,
};
