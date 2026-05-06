// backend/routes/assets.js
// Handles fetching asset data and statistics

const express = require('express');
const {
  getAllAssets,
  getAssetStatistics,
  getHeaders,
  deleteAllAssets,
} = require('../db/database');

const router = express.Router();

/**
 * GET /api/assets
 * Fetch all assets
 * 
 * Response: { success, assets, statistics }
 */
router.get('/', (req, res) => {
  try {
    const assets = getAllAssets();
    const statistics = getAssetStatistics();

    res.json({
      success: true,
      assets: assets,
      headers: getHeaders(),
      statistics: statistics,
    });
  } catch (error) {
    console.error('Asset fetch error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch assets',
    });
  }
});

/**
 * DELETE /api/assets
 * Remove all assets from the current inventory list
 *
 * Response: { success, message }
 */
router.delete('/', (req, res) => {
  try {
    deleteAllAssets();

    res.json({
      success: true,
      message: 'Inventory list cleared successfully',
    });
  } catch (error) {
    console.error('Asset clear error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to clear assets',
    });
  }
});

module.exports = router;
