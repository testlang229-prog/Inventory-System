// backend/db/database.js
// This file provides JSON-based data storage (beginner-friendly, no build tools needed)
// Data is stored in inventory.json file which persists between server restarts

const fs = require('fs');
const path = require('path');

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
function getAllAssets() {
  const data = loadData();
  return data.assets.sort((a, b) => b.id - a.id);
}

function getHeaders() {
  const data = loadData();
  return Array.isArray(data.headers) ? data.headers : [];
}

function updateHeaders(newHeaders) {
  const data = loadData();
  const headers = Array.isArray(data.headers) ? [...data.headers] : [];

  newHeaders.forEach(header => {
    const normalized = String(header).trim();
    if (normalized && !headers.includes(normalized)) {
      headers.push(normalized);
    }
  });

  data.headers = headers;
  saveData(data);
}

function normalizeHeader(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
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

/**
 * Get asset by ID
 */
function getAssetById(id) {
  const data = loadData();
  return data.assets.find(asset => asset.id === id);
}

/**
 * Search for asset by Asset number or Serial number
 */
function getAssetByAssetOrSerial(asset, serialNumber) {
  const data = loadData();
  return data.assets.find(
    a => a.asset === asset || a.serialNumber === serialNumber
  );
}

/**
 * Upsert asset (Insert or Update)
 */
function upsertAsset(assetData) {
  const data = loadData();
  
  // Check if asset exists by asset number or serial number
  const existingIndex = data.assets.findIndex(
    a => a.asset === assetData.asset || a.serialNumber === assetData.serialNumber
  );

  const normalizedStatus = assetData.status || 'UNACCOUNTED';
  const baseAsset = {
    ...assetData,
    status: normalizedStatus,
    remarks: assetData.remarks || assetData.REMARKS || assetData.Remarks || assetData.remark || assetData.comments || assetData.note || assetData.notes || '',
  };
  syncFieldToOriginalColumns(baseAsset, 'status', normalizedStatus);
  syncFieldToOriginalColumns(baseAsset, 'remarks', baseAsset.remarks);

  if (existingIndex !== -1) {
    const existing = data.assets[existingIndex];

    if (existing.status === 'ACCOUNTED') {
      data.assets[existingIndex] = {
        ...existing,
        ...baseAsset,
        asset: existing.asset,
        updatedAt: new Date().toISOString(),
      };
    } else {
      data.assets[existingIndex] = {
        ...existing,
        ...baseAsset,
        asset: assetData.asset,
        status: normalizedStatus,
        updatedAt: new Date().toISOString(),
      };
    }

    saveData(data);
    return existing.id;
  } else {
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
    data.assets[assetIndex].updatedAt = new Date().toISOString();
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
  deleteAllAssets,
  getAssetStatistics,
};
