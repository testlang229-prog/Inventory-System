// backend/routes/scan.js
// Handles QR code scans and updates asset status

const express = require('express');
const {
  getAssetByAssetOrSerial,
  updateAssetStatus,
  getAssetById,
} = require('../db/database');

const router = express.Router();

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
router.post('/', (req, res) => {
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

    // Check if asset is already ACCOUNTED
    if (asset.status === 'ACCOUNTED') {
      // Still mark remarks as FOUND so every successful scan records the match.
      updateAssetStatus(asset.id, 'ACCOUNTED', 'FOUND');
      const updatedAsset = getAssetById(asset.id);

      return res.json({
        success: true,
        message: 'Asset already accounted',
        asset: updatedAsset,
        action: 'ALREADY_ACCOUNTED',
      });
    }

    // Update the asset status to ACCOUNTED and remarks to FOUND
    updateAssetStatus(asset.id, 'ACCOUNTED', 'FOUND');

    // Fetch the updated asset
    const updatedAsset = getAssetById(asset.id);

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
});

module.exports = router;
