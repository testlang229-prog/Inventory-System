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

function getUploadMonth(date = new Date()) {
  return MONTH_NAMES[date.getMonth()];
}

function getMonthlyStatusHeader(date = new Date()) {
  return `${getUploadMonth(date)} STATUS`;
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

function isMonthlyStatusHeader(value) {
  const normalized = normalizeHeader(value);
  return MONTH_NAMES.some(month => normalized === `${month.toLowerCase()} status`);
}

module.exports = {
  MONTH_NAMES,
  getUploadMonth,
  getMonthlyStatusHeader,
  getReportFilename,
  normalizeHeader,
  isMonthlyStatusHeader,
};
