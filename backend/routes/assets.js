// backend/routes/assets.js
// Handles fetching asset data and statistics

const express = require('express');
const {
  getAllAssets,
  getAssetStatistics,
  getHeaders,
  getAssetById,
  getAssetByAssetOrSerial,
  updateHeaders,
  upsertAsset,
  deleteAllAssets,
} = require('../db/database');
const {
  getMonthlyStatusHeader,
  isMonthlyStatusHeader,
  normalizeHeader,
} = require('../utils/monthColumns');

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
 * POST /api/assets
 * Add a newly scanned asset manually
 *
 * Response: { success, message, asset }
 */
router.post('/', (req, res) => {
  try {
    const submittedFields = req.body.fields && typeof req.body.fields === 'object'
      ? req.body.fields
      : req.body;
    const monthlyStatusHeader = getMonthlyStatusHeader();
    const defaultHeaders = [
      'Asset',
      'Subnumber',
      'Asset Description',
      'Cost Center',
      'Serial number',
      'Resp. cost center',
      'CORRECT ROOM',
      'STATUS (ACCOUNTED / UNACCOUNTED / RECONCILING)',
      monthlyStatusHeader,
      'REMARKS',
    ];
    const headers = Object.keys(submittedFields).length > 0
      ? Object.keys(submittedFields)
      : defaultHeaders;
    const findFieldValue = (aliases) => {
      const matchingHeader = headers.find(header =>
        aliases.includes(normalizeHeader(header))
      );

      return matchingHeader ? String(submittedFields[matchingHeader] || '').trim() : '';
    };

    const assetNumber = findFieldValue(['asset', 'asset no', 'asset number']) ||
      String(req.body.asset || '').trim();
    const serialNumber = findFieldValue(['serial number', 'serial no', 'serial']) ||
      String(req.body.serialNumber || '').trim();
    const assetDescription = findFieldValue(['asset description', 'description']) ||
      String(req.body.assetDescription || '').trim();

    if (!assetNumber) {
      return res.status(400).json({
        success: false,
        message: 'Asset number is required',
      });
    }

    if (!assetDescription) {
      return res.status(400).json({
        success: false,
        message: 'Asset description is required',
      });
    }

    const existingAsset = getAssetByAssetOrSerial(assetNumber, serialNumber);

    if (existingAsset) {
      return res.status(409).json({
        success: false,
        message: `Asset with number "${assetNumber}" already exists in the system. Cannot add duplicate.`,
      });
    }

    // Validate that the asset number is not an empty string or whitespace only
    if (!assetNumber || assetNumber.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Asset number cannot be empty. Please provide a valid asset number.',
      });
    }

    updateHeaders(headers);
    const fields = { ...submittedFields };
    const statusHeader = headers.find(header => normalizeHeader(header) === 'status') ||
      'STATUS (ACCOUNTED / UNACCOUNTED / RECONCILING)';
    const remarksHeader = headers.find(header => normalizeHeader(header) === 'remarks') ||
      'REMARKS';

    fields[statusHeader] = 'ACCOUNTED';
    fields[monthlyStatusHeader] = '';
    fields[remarksHeader] = '';

    headers.forEach(header => {
      if (isMonthlyStatusHeader(header) && normalizeHeader(header) !== normalizeHeader(monthlyStatusHeader)) {
        fields[header] = fields[header] || '';
      }
    });

    const assetId = upsertAsset({
      ...fields,
      Asset: fields.Asset || assetNumber,
      'Asset Description': fields['Asset Description'] || assetDescription,
      'Serial number': fields['Serial number'] || serialNumber,
      [monthlyStatusHeader]: '',
      asset: assetNumber,
      subnumber: findFieldValue(['subnumber', 'sub number', 'sub no']),
      assetDescription,
      costCenter: findFieldValue(['cost center', 'cost centre']),
      serialNumber,
      respCostCenter: findFieldValue(['resp cost center', 'responsible cost center']),
      correctRoom: findFieldValue(['correct room', 'room', 'location']),
      status: 'ACCOUNTED',
      remarks: '',
    });

    res.status(201).json({
      success: true,
      message: 'New asset added successfully',
      asset: getAssetById(assetId),
    });
  } catch (error) {
    console.error('Asset create error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add asset',
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
