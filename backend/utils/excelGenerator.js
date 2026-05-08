// backend/utils/excelGenerator.js
// Generates Excel files for download with all current data

const ExcelJS = require('exceljs');
const {
  getMonthlyStatusHeader,
  getMonthlyRemarksHeader,
  isCurrentMonthRemarksHeader,
  normalizeHeader,
} = require('./monthColumns');

function isInternalField(value) {
  return normalizeHeader(value).replace(/\s+/g, '') === 'scanningmonth';
}

function getDisplayHeader(header) {
  const normalizedHeader = normalizeHeader(header);

  if (
    normalizedHeader === 'remarks' ||
    normalizedHeader.endsWith(' remarks') ||
    isCurrentMonthRemarksHeader(header)
  ) {
    return getMonthlyRemarksHeader();
  }

  return normalizeHeader(header) === 'no change with change'
    ? String(header).replace(/\s*\(\d+\)\s*$/, '')
    : header;
}

function getAssetValue(asset, header) {
  const normalizedHeader = normalizeHeader(header);
  if (
    normalizedHeader === 'remarks' ||
    normalizedHeader.endsWith(' remarks') ||
    isCurrentMonthRemarksHeader(header)
  ) {
    if (asset[header] !== undefined) {
      return asset[header];
    }
    return asset.remarks || asset.REMARKS || asset.Remarks || asset.remark || asset.notes || asset.note || asset.comments || asset.comment || '';
  }

  if (asset[header] !== undefined) {
    return asset[header];
  }

  const matchingKey = Object.keys(asset).find(
    key => normalizeHeader(key) === normalizedHeader
  );

  if (matchingKey) {
    return asset[matchingKey];
  }

  return asset[normalizedHeader] !== undefined ? asset[normalizedHeader] : '';
}

function deriveHeadersFromAssets(assets) {
  const excludedKeys = new Set(['id', 'createdAt', 'updatedAt']);
  const headerSet = new Set();

  assets.forEach(asset => {
    Object.keys(asset).forEach(key => {
      if (!excludedKeys.has(key) && !isInternalField(key)) {
        headerSet.add(key);
      }
    });
  });

  return Array.from(headerSet);
}

async function generateExcelFile(assets, headers = []) {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Assets');

    if (!Array.isArray(headers) || headers.length === 0) {
      headers = deriveHeadersFromAssets(assets);
    }

    headers = headers.filter(header => !isInternalField(header));
    const monthlyStatusHeader = getMonthlyStatusHeader();
    const currentMonthRemarksNormalized = normalizeHeader(getMonthlyRemarksHeader());
    const hasCurrentMonthRemarks = headers.some(
      header => normalizeHeader(header) === currentMonthRemarksNormalized
    );

    if (!headers.some(header => normalizeHeader(header) === normalizeHeader(monthlyStatusHeader))) {
      const remarksIndex = headers.findIndex(header => normalizeHeader(header) === 'remarks');
      const insertIndex = remarksIndex >= 0 ? remarksIndex : headers.length;
      headers.splice(insertIndex, 0, monthlyStatusHeader);
    }

    if (hasCurrentMonthRemarks) {
      const seen = new Set();
      headers = headers.filter(header => {
        const normalized = normalizeHeader(header);
        if (normalized === 'remarks') {
          return false;
        }
        if (seen.has(normalized)) {
          return false;
        }
        seen.add(normalized);
        return true;
      });
    }

    const normalizedToHeader = headers.reduce((map, header) => {
      map[normalizeHeader(header)] = header;
      return map;
    }, {});

    worksheet.columns = headers.map(header => ({
      header: getDisplayHeader(header),
      key: header,
      width: Math.max(15, String(getDisplayHeader(header)).length + 5),
    }));

    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '366092' },
    };
    worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'center' };

    assets.forEach(asset => {
      const rowData = {};
      headers.forEach(header => {
        rowData[header] = getAssetValue(asset, header);
      });

      const row = worksheet.addRow(rowData);
      const statusHeader = normalizedToHeader.status;
      const statusValue = asset.status || (statusHeader ? rowData[statusHeader] : '');

      if (String(statusValue).toUpperCase() === 'ACCOUNTED') {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'C6EFCE' },
        };
      } else if (String(statusValue).toUpperCase() === 'RECONCILING') {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEB9C' },
        };
      } else {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFC7CE' },
        };
      }

      row.alignment = { horizontal: 'left', vertical: 'center' };
    });

    worksheet.columns.forEach(column => {
      column.width = Math.max(15, column.width || 15);
    });

    return await workbook.xlsx.writeBuffer();
  } catch (error) {
    throw new Error(`Excel generation failed: ${error.message}`);
  }
}

module.exports = {
  generateExcelFile,
};
