// backend/utils/excelParser.js
// Parses uploaded Excel files and validates data

const XLSX = require('xlsx');

/**
 * Parse Excel file and extract asset data
 * Detects common column names and maps them to the app's asset fields.
 */
function parseExcelFile(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '',
      blankrows: false,
    });

    if (rows.length === 0) {
      throw new Error('Excel file is empty');
    }

    const { headerRowIndex, columnMap } = detectColumnMap(rows);

    if (!columnMap.asset) {
      throw new Error('Could not detect an asset number column');
    }

    if (!columnMap.assetDescription) {
      throw new Error('Could not detect an asset description column');
    }

    const headers = buildHeaders(rows[headerRowIndex]);

    const assets = rows
      .slice(headerRowIndex + 1)
      .map(row => {
        const getColumnValue = (fieldName) => {
          const columnIndex = columnMap[fieldName];
          return columnIndex === undefined ? '' : row[columnIndex];
        };

        const rowObject = {};
        headers.forEach(({ name, index }) => {
          rowObject[name] = cleanValue(row[index]);
        });

        return {
          ...rowObject,
          asset: cleanValue(getColumnValue('asset')),
          subnumber: cleanValue(getColumnValue('subnumber')),
          assetDescription: cleanValue(getColumnValue('assetDescription')),
          costCenter: cleanValue(getColumnValue('costCenter')),
          serialNumber: cleanValue(getColumnValue('serialNumber')),
          respCostCenter: cleanValue(getColumnValue('respCostCenter')),
          correctRoom: cleanValue(getColumnValue('correctRoom')),
          status: cleanValue(getColumnValue('status')) || 'UNACCOUNTED',
          remarks: cleanValue(getColumnValue('remarks')),
        };
      })
      .filter(asset => asset.asset || asset.assetDescription || asset.serialNumber);

    return {
      assets,
      headers: headers.map(header => header.name),
    };
  } catch (error) {
    throw new Error(`Excel parsing failed: ${error.message}`);
  }
}

function buildHeaders(headerRow) {
  const usedHeaders = new Map();

  return headerRow
    .map((header, index) => {
      const baseName = cleanValue(header);
      if (!baseName) return null;

      const existingCount = usedHeaders.get(baseName) || 0;
      usedHeaders.set(baseName, existingCount + 1);

      return {
        name: existingCount === 0 ? baseName : `${baseName} (${existingCount + 1})`,
        index,
      };
    })
    .filter(Boolean);
}

const FIELD_ALIASES = {
  asset: [
    'asset',
    'asset no',
    'asset no.',
    'asset number',
    'asset #',
    'fixed asset',
    'fixed asset no',
    'fixed asset number',
    'property no',
    'property number',
    'item no',
    'item number',
  ],
  subnumber: [
    'subnumber',
    'sub number',
    'sub no',
    'sub no.',
    'sub asset',
    'asset subnumber',
  ],
  assetDescription: [
    'asset description',
    'description',
    'asset desc',
    'item description',
    'particulars',
    'equipment description',
    'name',
  ],
  costCenter: [
    'cost center',
    'cost centre',
    'cc',
    'department',
    'dept',
    'dept.',
  ],
  serialNumber: [
    'serial number',
    'serial no',
    'serial no.',
    'serial',
    'serial #',
    's/n',
    'sn',
  ],
  respCostCenter: [
    'resp. cost center',
    'resp cost center',
    'responsible cost center',
    'responsibility center',
    'responsible dept',
    'responsible department',
    'custodian',
  ],
  correctRoom: [
    'correct room',
    'room',
    'room no',
    'room no.',
    'location',
    'actual location',
    'office',
  ],
  status: [
    'status',
    'inventory status',
    'accountability status',
    'accounted',
  ],
  remarks: [
    'remarks',
    'remark',
    'notes',
    'note',
    'comments',
    'comment',
  ],
};

function detectColumnMap(rows) {
  let bestMatch = null;

  rows.slice(0, 15).forEach((row, index) => {
    const columnMap = mapHeaderRow(row);
    const score = Object.keys(columnMap).length;

    if (!bestMatch || score > bestMatch.score) {
      bestMatch = {
        headerRowIndex: index,
        columnMap,
        score,
      };
    }
  });

  if (!bestMatch || bestMatch.score === 0) {
    throw new Error('Could not detect column headers');
  }

  return bestMatch;
}

function mapHeaderRow(row) {
  const columnMap = {};

  row.forEach((header, columnIndex) => {
    const normalizedHeader = normalizeHeader(header);
    if (!normalizedHeader) return;

    Object.entries(FIELD_ALIASES).forEach(([fieldName, aliases]) => {
      if (columnMap[fieldName] !== undefined) return;

      if (aliases.some(alias => normalizeHeader(alias) === normalizedHeader)) {
        columnMap[fieldName] = columnIndex;
      }
    });
  });

  return columnMap;
}

function normalizeHeader(value) {
  return String(value)
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function cleanValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim();
}

/**
 * Validate parsed asset data
 * Ensures all required fields are not empty
 */
function validateAssets(assets) {
  const errors = [];

  assets.forEach((asset, index) => {
    if (!asset.asset) errors.push(`Row ${index + 1}: Asset number is required`);
    if (!asset.assetDescription) errors.push(`Row ${index + 1}: Asset description is required`);
  });

  if (errors.length > 0) {
    throw new Error(`Validation failed:\n${errors.join('\n')}`);
  }

  return true;
}

module.exports = {
  parseExcelFile,
  validateAssets,
};
