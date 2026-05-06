// backend/utils/excelGenerator.js
// Generates Excel files for download with all current data

const ExcelJS = require('exceljs');

function normalizeHeader(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function getAssetValue(asset, header) {
  if (asset[header] !== undefined) {
    return asset[header];
  }

  const normalizedHeader = normalizeHeader(header);
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
      if (!excludedKeys.has(key)) {
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

    const normalizedToHeader = headers.reduce((map, header) => {
      map[normalizeHeader(header)] = header;
      return map;
    }, {});

    worksheet.columns = headers.map(header => ({
      header,
      key: header,
      width: Math.max(15, String(header).length + 5),
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
