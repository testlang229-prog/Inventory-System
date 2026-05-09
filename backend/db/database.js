// backend/db/database.js
// This file provides JSON-based data storage (beginner-friendly, no build tools needed)
// Data is stored in inventory.json file which persists between server restarts

const fs = require('fs');
const path = require('path');
const {
  getMonthlyStatusHeader,
  getCurrentMonthRemarksHeader,
  MONTH_NAMES,
  normalizeHeader,
} = require('../utils/monthColumns');

// Path to JSON database file
const dbPath = path.join(__dirname, 'inventory.json');

/**
 * Load data from JSON file
 * Returns the assets array from the JSON file
 */
function loadData() {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading database:', error.message);
  }
  return { assets: [], headers: [], nextId: 1 };
}

/**
 * Save data to JSON file
 * Writes the complete assets array to inventory.json
 */
function saveData(data) {
  try {
    if (Array.isArray(data.assets)) {
      data.assets = data.assets.map(sanitizeAsset);
    }
    if (Array.isArray(data.headers)) {
      const normalizedHeaders = new Set();
      data.headers = data.headers
        .filter(header => !isInternalField(header))
        .filter(header => {
          const normalized = normalizeHeader(header);
          if (normalizedHeaders.has(normalized)) {
            return false;
          }
          normalizedHeaders.add(normalized);
          return true;
        });
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving database:', error.message);
    throw error;
  }
}

/**
 * Initialize the database (create JSON file if it doesn't exist)
 */
function initializeDatabase() {
  const data = loadData();
  if (!fs.existsSync(dbPath)) {
    saveData(data);
    console.log('✅ Database initialized successfully');
  } else {
    console.log('✅ Database loaded successfully');
  }
}

/**
 * Get all assets from database
 */
function sanitizeAsset(asset) {
  if (!asset || typeof asset !== 'object') return asset;
  return Object.fromEntries(
    Object.entries(asset).filter(([key]) => !isInternalField(key))
  );
}

function normalizeFieldName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function isInternalField(value) {
  return normalizeFieldName(value) === 'scanningmonth';
}

function getAllAssets() {
  const data = loadData();
  return data.assets
    .sort((a, b) => b.id - a.id)
    .map(sanitizeAsset);
}

function getHeaders() {
  const data = loadData();
  const headers = Array.isArray(data.headers) ? data.headers : [];
  let visibleHeaders = headers.filter(header => !isInternalField(header));
  const monthlyStatusHeader = getMonthlyStatusHeader();
  const currentMonthRemarksNormalized = getCurrentMonthRemarksHeader();
  const hasCurrentMonthRemarks = visibleHeaders.some(
    header => normalizeHeader(header) === currentMonthRemarksNormalized
  );

  if (!visibleHeaders.some(header => normalizeHeader(header) === normalizeHeader(monthlyStatusHeader))) {
    const remarksIndex = visibleHeaders.findIndex(header => normalizeHeader(header) === 'remarks');
    const insertIndex = remarksIndex >= 0 ? remarksIndex : visibleHeaders.length;
    visibleHeaders.splice(insertIndex, 0, monthlyStatusHeader);
  }

  if (hasCurrentMonthRemarks) {
    const seen = new Set();
    visibleHeaders = visibleHeaders.filter(header => {
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

  return visibleHeaders;
}

function updateHeaders(newHeaders) {
  const data = loadData();
  const headers = Array.isArray(data.headers) ? [...data.headers] : [];
  const normalizedHeaders = new Set(headers.map(header => normalizeHeader(header)));

  newHeaders.forEach(header => {
    const trimmed = String(header).trim();
    const normalized = normalizeHeader(trimmed);
    if (trimmed && !isInternalField(trimmed) && !normalizedHeaders.has(normalized)) {
      headers.push(trimmed);
      normalizedHeaders.add(normalized);
    }
  });

  data.headers = headers;
  saveData(data);
}

function syncFieldToOriginalColumns(asset, fieldName, value) {
  const targetHeader = normalizeHeader(fieldName);

  Object.keys(asset).forEach(key => {
    if (normalizeHeader(key) === targetHeader) {
      asset[key] = value;
    }
  });

  asset[fieldName] = value;
}

function getMonthStatusIndex(header) {
  const normalizedHeader = normalizeHeader(header);
  return MONTH_NAMES.findIndex(
    month => normalizedHeader === `${month.toLowerCase()} status`
  );
}

function clearEarlierNotFoundStatuses(asset, date = new Date()) {
  const currentMonthIndex = date.getMonth();

  Object.keys(asset).forEach(key => {
    const monthIndex = getMonthStatusIndex(key);
    const value = String(asset[key] || '').trim().toUpperCase();

    if (monthIndex >= 0 && monthIndex < currentMonthIndex && value === 'NOT FOUND') {
      asset[key] = '';
    }
  });
}

/**
 * Get asset by ID
 */
function getAssetById(id) {
  const data = loadData();
  const asset = data.assets.find(asset => asset.id === id);
  return sanitizeAsset(asset);
}

/**
 * Search for asset by Asset number or Serial number
 */
function getAssetByAssetOrSerial(asset, serialNumber) {
  const data = loadData();
  const normalizedAsset = String(asset || '').trim().toLowerCase();
  const normalizedSerialNumber = String(serialNumber || '').trim().toLowerCase();
  
  const found = data.assets.find(a => {
    const existingAssetNum = String(a.asset || '').trim().toLowerCase();
    const existingSerialNum = String(a.serialNumber || '').trim().toLowerCase();

    // Match if asset numbers are the same
    if (normalizedAsset && existingAssetNum === normalizedAsset) {
      return true;
    }

    // Match if serial numbers are the same
    if (normalizedSerialNumber && existingSerialNum === normalizedSerialNumber) {
      return true;
    }

    return false;
  });
  return sanitizeAsset(found);
}

/**
 * Upsert asset (Insert or Update)
 */
function upsertAsset(assetData) {
  const data = loadData();
  
  // Normalize asset identifiers for matching
  const normalizedAssetNumber = String(assetData.asset || '').trim();
  const normalizedSerialNumber = String(assetData.serialNumber || '').trim();

  // Validate that we have at least an asset number
  if (!normalizedAssetNumber) {
    throw new Error('Asset number is required for upsert operation');
  }

  // Check if asset exists by asset number or serial number (both must match exactly)
  const existingIndex = data.assets.findIndex(a => {
    const existingAssetNum = String(a.asset || '').trim();
    const existingSerialNum = String(a.serialNumber || '').trim();

    // Match if asset numbers are the same (case-insensitive comparison for robustness)
    if (existingAssetNum.toLowerCase() === normalizedAssetNumber.toLowerCase()) {
      return true;
    }

    // Match if both have serial numbers and they're the same
    if (normalizedSerialNumber && existingSerialNum && 
        existingSerialNum.toLowerCase() === normalizedSerialNumber.toLowerCase()) {
      return true;
    }

    return false;
  });

  const normalizedStatus = assetData.status || 'UNACCOUNTED';
  const monthlyStatusHeader = getMonthlyStatusHeader();
  const baseAsset = {
    ...assetData,
    status: normalizedStatus,
    remarks: assetData.remarks || assetData.REMARKS || assetData.Remarks || assetData.remark || assetData.comments || assetData.note || assetData.notes || '',
  };
  baseAsset[monthlyStatusHeader] = assetData[monthlyStatusHeader] || '';
  syncFieldToOriginalColumns(baseAsset, 'status', normalizedStatus);
  syncFieldToOriginalColumns(baseAsset, 'remarks', baseAsset.remarks);

  if (existingIndex !== -1) {
    // Asset exists - update it
    const existing = data.assets[existingIndex];

    if (existing.status === 'ACCOUNTED') {
      data.assets[existingIndex] = {
        ...existing,
        ...baseAsset,
        asset: existing.asset, // Preserve original asset number
        updatedAt: new Date().toISOString(),
      };
    } else {
      data.assets[existingIndex] = {
        ...existing,
        ...baseAsset,
        asset: normalizedAssetNumber, // Update to new asset number if provided
        status: normalizedStatus,
        updatedAt: new Date().toISOString(),
      };
    }

    saveData(data);
    return existing.id;
  } else {
    // Asset doesn't exist - create new one
    clearEarlierNotFoundStatuses(baseAsset);

    const newAsset = {
      id: data.nextId,
      ...baseAsset,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.assets.push(newAsset);
    data.nextId++;
    saveData(data);
    return newAsset.id;
  }
}

/**
 * Update asset status after scan
 */
function updateAssetStatus(assetId, status, remarks) {
  const data = loadData();
  const assetIndex = data.assets.findIndex(a => a.id === assetId);

  if (assetIndex !== -1) {
    syncFieldToOriginalColumns(data.assets[assetIndex], 'status', status);
    syncFieldToOriginalColumns(data.assets[assetIndex], 'remarks', remarks);
    if (String(status || '').toUpperCase() === 'ACCOUNTED') {
      data.assets[assetIndex][getMonthlyStatusHeader()] = 'FOUND';
    }
    data.assets[assetIndex].updatedAt = new Date().toISOString();
    saveData(data);
  }
}

/**
 * Update monthly status for an asset
 */
function updateMonthlyStatus(assetId, monthlyStatus) {
  const data = loadData();
  const assetIndex = data.assets.findIndex(a => a.id === assetId);

  if (assetIndex !== -1) {
    data.assets[assetIndex][getMonthlyStatusHeader()] = monthlyStatus;
    saveData(data);
  }
}

/**
 * Delete all assets (useful for testing or resetting)
 */
function deleteAllAssets() {
  const data = { assets: [], headers: [], nextId: 1 };
  saveData(data);
}

/**
 * Get statistics about assets
 */
function getAssetStatistics() {
  const data = loadData();
  const stats = {};

  data.assets.forEach(asset => {
    if (!stats[asset.status]) {
      stats[asset.status] = 0;
    }
    stats[asset.status]++;
  });

  return Object.entries(stats).map(([status, count]) => ({
    status,
    count,
  }));
}

/**
 * Export all functions for use in routes
 */
module.exports = {
  initializeDatabase,
  getAllAssets,
  getHeaders,
  updateHeaders,
  getAssetById,
  getAssetByAssetOrSerial,
  upsertAsset,
  updateAssetStatus,
  updateMonthlyStatus,
  deleteAllAssets,
  getAssetStatistics,
};
