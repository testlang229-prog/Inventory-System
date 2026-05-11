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
const MONTH_DISPLAY_NAMES = MONTH_NAMES.map(name => name.charAt(0) + name.slice(1).toLowerCase());
const YEAR = new Date().getFullYear();

function getUploadMonth(date = new Date()) {
  return MONTH_DISPLAY_NAMES[date.getMonth()];
}

function getMonthlyStatusHeader(date = new Date()) {
  return `${getUploadMonth(date)} ${date.getFullYear()} STATUS`;
}

function getMonthlyRemarksHeader(date = new Date()) {
  return `${getUploadMonth(date)} ${date.getFullYear()} REMARKS`;
}

function getCurrentMonthRemarksHeader(date = new Date()) {
  return normalizeHeader(getMonthlyRemarksHeader(date));
}

function getReportFilename(date = new Date()) {
  return `${getUploadMonth(date)}_AssetInventoryReport.xlsx`;
}

function normalizeHeader(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function normalizeHeaderWithoutYear(value) {
  return normalizeHeader(value)
    .replace(/\b\d{4}\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isMonthlyStatusHeader(value) {
  const normalized = normalizeHeader(value);
  return MONTH_NAMES.some(month =>
    new RegExp(`^${month.toLowerCase()}(\\s*\\d{4})?\\s*status$`).test(normalized)
  );
}

function isMonthlyRemarksHeader(value) {
  const normalized = normalizeHeader(value);
  return MONTH_NAMES.some(month => {
    const monthLower = month.toLowerCase();
    return (
      normalized === `${monthLower} ${YEAR} remarks` ||
      normalized === `${monthLower}${YEAR} remarks` ||
      normalized === `${monthLower} remarks` ||
      new RegExp(`^${monthLower}\\s*\\d{4}\\s*remarks$`).test(normalized)
    );
  });
}

function isCurrentMonthRemarksHeader(value, date = new Date()) {
  return normalizeHeader(value) === getCurrentMonthRemarksHeader(date);
}

module.exports = {
  MONTH_NAMES,
  getUploadMonth,
  getMonthlyStatusHeader,
  getMonthlyRemarksHeader,
  getCurrentMonthRemarksHeader,
  getReportFilename,
  normalizeHeader,
  normalizeHeaderWithoutYear,
  isMonthlyStatusHeader,
  isMonthlyRemarksHeader,
  isCurrentMonthRemarksHeader,
};
