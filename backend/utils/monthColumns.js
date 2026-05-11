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
const YEAR = new Date().getFullYear();

function getUploadMonth(date = new Date()) {
  return MONTH_NAMES[date.getMonth()];
}

function getMonthlyStatusHeader(date = new Date()) {
  return `${getUploadMonth(date)} STATUS`;
}

function getMonthlyRemarksHeader(date = new Date()) {
  return `${getUploadMonth(date)} ${date.getFullYear()}`;
}

function getCurrentMonthRemarksHeader(date = new Date()) {
  return normalizeHeader(getMonthlyRemarksHeader(date));
}

function getReportFilename(date = new Date()) {
  return `${getUploadMonth(date)} ${date.getFullYear()}_AssetInventoryReport.xlsx`;
}

function normalizeHeader(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function isMonthlyStatusHeader(value) {
  const normalized = normalizeHeader(value);
  return MONTH_NAMES.some(month => normalized === `${month.toLowerCase()} status`);
}

function isMonthlyRemarksHeader(value) {
  const normalized = normalizeHeader(value);
  return MONTH_NAMES.some(month => {
    const monthLower = month.toLowerCase();
    return (
      normalized === `${monthLower} ${YEAR}` ||
      normalized === `${monthLower}${YEAR}` ||
      new RegExp(`^${monthLower}\\s*\\d{4}$`).test(normalized)
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
  isMonthlyStatusHeader,
  isMonthlyRemarksHeader,
  isCurrentMonthRemarksHeader,
};
