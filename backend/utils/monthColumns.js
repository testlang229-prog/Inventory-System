// backend/utils/monthColumns.js
// Shared helpers for month-based inventory status columns.

const MONTH_NAMES = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];

function normalizeHeader(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function getMonthlyStatusHeader(date = new Date()) {
  return `${MONTH_NAMES[date.getMonth()]} STATUS`;
}

function getCurrentMonthRemarksHeader(date = new Date()) {
  return normalizeHeader(`${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`);
}

function isMonthlyStatusHeader(header) {
  const normalizedHeader = normalizeHeader(header);
  return MONTH_NAMES.some(
    month => normalizedHeader === `${month.toLowerCase()} status`
  );
}

module.exports = {
  MONTH_NAMES,
  normalizeHeader,
  getMonthlyStatusHeader,
  getCurrentMonthRemarksHeader,
  isMonthlyStatusHeader,
};
