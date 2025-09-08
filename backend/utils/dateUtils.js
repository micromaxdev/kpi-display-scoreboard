const moment = require('moment');

// Check if a string looks like dd/mm/yyyy or dd/mm/yy
function isLikelyDate(str) {
  return /^\d{2}\/\d{2}\/\d{2,4}$/.test(str);
}

function getDaysDifference(dateString) {
  if (typeof dateString === 'string' && isLikelyDate(dateString)) {
    const normalizedDate = parseAndFormatDate(dateString);
    const targetDate = moment(normalizedDate, 'DD/MM/YY');
    const now = moment();

    const daysDiff = targetDate.diff(now, 'days');
    return daysDiff;
  }

  // Fallback for other formats
  const targetDate = moment(dateString);
  const now = moment();
  const daysDiff = targetDate.diff(now, 'days');
  console.log(`Fallback days difference: ${daysDiff}`);
  return daysDiff;
}

// Parse various date formats and return a Date object
function parseToDateObject(value) {
  let dateObj = null;

  if (typeof value === 'string') {
    const parsedDate = moment(value, [
      'DD/MM/YYYY',
      'DD/MM/YY',
      'YYYY-MM-DD',
      'DD-MM-YYYY',
      'MM/DD/YYYY'
    ], true);

    if (parsedDate.isValid()) {
      dateObj = parsedDate.toDate();
    }
  } else if (value instanceof Date) {
    dateObj = value;
  } else if (typeof value === 'number') {
    // Excel date number → JS Date
    const excelDate = new Date((value - 25569) * 86400 * 1000);
    if (!isNaN(excelDate.getTime())) {
      dateObj = excelDate;
    }
  }

  return dateObj;
}

// Format a Date object as dd/mm/yy
function formatDateToDDMMYY(dateObj) {
  if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return null;
  }

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = String(dateObj.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
}

// Parse and format into dd/mm/yy
function parseAndFormatDate(value) {
  const dateObj = parseToDateObject(value);
  return dateObj ? formatDateToDDMMYY(dateObj) : null;
}

// Export everything (CJS style)
module.exports = {
  isLikelyDate,
  getDaysDifference,
  parseToDateObject,
  formatDateToDDMMYY,
  parseAndFormatDate,
  normalizeDateFormat: parseAndFormatDate // alias for backward compatibility
};
