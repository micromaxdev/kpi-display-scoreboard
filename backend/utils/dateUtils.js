import moment from 'moment';

export function isLikelyDate(str) {
  return /^\d{2}\/\d{2}\/\d{2,4}$/.test(str);
}

export function getDaysDifference(dateString) {
  
  if (typeof dateString === 'string' && isLikelyDate(dateString)) {
    const normalizedDate = parseAndFormatDate(dateString); // Using new function
    const targetDate = moment(normalizedDate, 'DD/MM/YY');
    const now = moment();
    
    const daysDiff = targetDate.diff(now, 'days');
    return daysDiff; //Make sure this returns a NUMBER
  }
  
  // Fallback for other formats
  const targetDate = moment(dateString);
  const now = moment();
  const daysDiff = targetDate.diff(now, 'days');
  console.log(`Fallback days difference: ${daysDiff}`);
  return daysDiff;
}

/**
 * Parse various date formats and return a Date object
 * @param {string|Date|number} value - The value to parse as date
 * @returns {Date|null} - Parsed Date object or null if invalid
 */
export function parseToDateObject(value) {
  let dateObj = null;
  
  if (typeof value === 'string') {
    // Try to parse using moment with multiple formats
    const parsedDate = moment(value, ['DD/MM/YYYY', 'DD/MM/YY', 'YYYY-MM-DD', 'DD-MM-YYYY', 'MM/DD/YYYY'], true);
    if (parsedDate.isValid()) {
      dateObj = parsedDate.toDate();
    }
  } else if (value instanceof Date) {
    dateObj = value;
  } else if (typeof value === 'number') {
    // Excel date conversion (Excel epoch starts from 1900-01-01)
    const excelDate = new Date((value - 25569) * 86400 * 1000);
    if (!isNaN(excelDate.getTime())) {
      dateObj = excelDate;
    }
  }
  
  return dateObj;
}

/**
 * Format a Date object as dd/mm/yy string
 * @param {Date} dateObj - The Date object to format
 * @returns {string} - Formatted date string as dd/mm/yy
 */
export function formatDateToDDMMYY(dateObj) {
  if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return null;
  }
  
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = String(dateObj.getFullYear()).slice(-2); // Get last 2 digits
  
  return `${day}/${month}/${year}`;
}

/**
 * Parse and format date value to dd/mm/yy string (replaces normalizeDateFormat)
 * @param {string|Date|number} value - The value to parse and format
 * @returns {string|null} - Formatted date string or null if invalid
 */
export function parseAndFormatDate(value) {
  const dateObj = parseToDateObject(value);
  return dateObj ? formatDateToDDMMYY(dateObj) : null;
}

// Keep this alias for backward compatibility if needed elsewhere
export const normalizeDateFormat = parseAndFormatDate;