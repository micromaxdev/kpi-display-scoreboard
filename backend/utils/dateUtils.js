import moment from 'moment';

export function normalizeDateFormat(date) {
  const parsed = moment(date, ['DD/MM/YYYY', 'DD/MM/YY'], true);
  return parsed.isValid() ? parsed.format('DD/MM/YY') : date;
}

export function isLikelyDate(str) {
  return /^\d{2}\/\d{2}\/\d{2,4}$/.test(str);
}

export function getDaysDifference(dateString) {
  
  if (typeof dateString === 'string' && isLikelyDate(dateString)) {
    const normalizedDate = normalizeDateFormat(dateString);
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