import moment from 'moment';

export function normalizeDateFormat(date) {
  const parsed = moment(date, ['DD/MM/YYYY', 'DD/MM/YY'], true);
  return parsed.isValid() ? parsed.format('DD/MM/YY') : date;
}

export function isLikelyDate(str) {
  return /^\d{2}\/\d{2}\/\d{2,4}$/.test(str);
}
