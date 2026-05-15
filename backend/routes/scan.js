// backend/routes/scan.js
// Handles QR code scans and updates asset status

const express = require('express');
const {
  getAssetByAssetOrSerial,
  updateAssetStatus,
  updateMonthlyStatus,
  getAssetById,
} = require('../db/database');

const router = express.Router();
const {
  authenticateToken,
} = require('../middleware/authMiddleware');

const {
  addActivityHistory,
} = require('../db/database');
const { updateLastUpdated } = require('../utils/updateTracker');

/**
 * POST /api/scan
 * Process a scanned QR code
 * 
 * Request body: { scannedValue }
 *   - scannedValue: The value from the scanned QR code (could be asset number or serial number)
 * 
 * Response: { success, message, asset, action }
 *   - asset: The matched asset details
 *   - action: 'UPDATED' or 'ALREADY_ACCOUNTED' (indicates what was done)
 */
router.post(
  '/',
  authenticateToken,
  async (req, res) => {
  try {
    const { scannedValue } = req.body;
    const normalizedScannedValue = String(scannedValue || '').trim();

    if (!normalizedScannedValue) {
      return res.status(400).json({
        success: false,
        message: 'No scanned value provided',
      });
    }

    // Search for the asset by Asset number or Serial number
    const asset = getAssetByAssetOrSerial(
      normalizedScannedValue,
      normalizedScannedValue
    );

    if (!asset) {
      return res.json({
        success: true,
        message: 'New asset scanned',
        scannedValue: normalizedScannedValue,
        action: 'NEW_ASSET',
      });
    }

    // Update the asset status to ACCOUNTED if needed
    if (asset.status !== 'ACCOUNTED') {
      updateAssetStatus(asset.id, 'ACCOUNTED', asset.remarks || '');
    }

    // Always set current month status to FOUND and preserve separate monthly remarks
    updateMonthlyStatus(asset.id, 'FOUND');

    // Fetch the updated asset
    // Fetch the updated asset
const updatedAsset = getAssetById(asset.id);

/**
 * CURRENT USER
 */
const currentUser = {
  employeeId:
    req.user.employeeId,

  name:
    req.user.name ||
    req.user.employeeId,
};

/**
 * SAVE ACTIVITY HISTORY
 */
addActivityHistory({
  employeeId:
    currentUser?.employeeId || 'Unknown',

  userName:
    currentUser?.name || 'Unknown User',

  asset:
    updatedAsset.asset ||
    updatedAsset.Asset ||
    '',

  assetDescription:
    updatedAsset.assetDescription ||
    updatedAsset['Asset Description'] ||
    '',

  serialNumber:
    updatedAsset.serialNumber ||
    updatedAsset['Serial number'] ||
    '',

  scannedAt: new Date(),
});

updateLastUpdated();

res.json({
  success: true,
  message: 'Asset marked as ACCOUNTED',
  asset: updatedAsset,
  action: 'UPDATED',
});
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Scan processing failed',
    });
  }
  }
);

module.exports = router;
