// backend/routes/upload.js
// Handles Excel file uploads and upserts data into database

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const {
  upsertAsset,
  getAllAssets,
  updateHeaders,
} = require('../db/database');
const {
  parseExcelFile,
  validateAssets,
} = require('../utils/excelParser');
const {
  getMonthlyStatusHeader,
  normalizeHeader,
} = require('../utils/monthColumns');

// Import multer configuration
const upload = require('../middleware/uploadConfig');

const router = express.Router();
const { updateLastUpdated } = require('../utils/updateTracker');

function cleanupUploadedFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return;

  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    console.warn('Could not remove uploaded temp file:', error.message);
  }
}

/**
 * POST /api/upload
 * Upload and process an Excel file
 * 
 * Request: multipart/form-data with 'file' field
 * Response: { success, message, assetsAdded, assetsUpdated, totalAssets }
 */
router.post('/', (req, res) => {
  upload.single('file')(req, res, (uploadError) => {
    if (uploadError) {
      const statusCode = uploadError instanceof multer.MulterError ? 400 : 415;

      return res.status(statusCode).json({
        success: false,
        message: uploadError.message || 'File upload failed',
      });
    }

  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const filePath = req.file.path;

    // Parse the Excel file and preserve all headers
    const { assets: parsedAssets, headers: parsedHeaders } = parseExcelFile(filePath);

    // Validate the parsed data
    validateAssets(parsedAssets);

    const isInternalField = (header) =>
      normalizeHeader(header).replace(/\s+/g, '') === 'scanningmonth';

    const monthlyStatusHeader = getMonthlyStatusHeader();
    const headers = [...parsedHeaders];

    if (!headers.some(header => normalizeHeader(header) === normalizeHeader(monthlyStatusHeader))) {
      const remarksIndex = headers.findIndex(header => normalizeHeader(header) === 'remarks');
      const insertIndex = remarksIndex >= 0 ? remarksIndex : headers.length;
      headers.splice(insertIndex, 0, monthlyStatusHeader);
    }

    // Filter out internal fields like scanningMonth
    const filteredHeaders = headers.filter(header => !isInternalField(header));

    // Store all parsed header columns in the database metadata
    if (Array.isArray(filteredHeaders) && filteredHeaders.length > 0) {
      updateHeaders(filteredHeaders);
    }

    // Track statistics
    let assetsAdded = 0;
    let assetsUpdated = 0;

    // Get existing assets to detect if it's an add or update
    const existingAssets = getAllAssets();
    const existingAssetNumbers = existingAssets.map(a => a.asset);

    // Upsert each asset into the database
    parsedAssets.forEach(asset => {
      const isNew = !existingAssetNumbers.includes(asset.asset);
      upsertAsset({
        ...asset,
        [monthlyStatusHeader]: asset[monthlyStatusHeader] || '',
      });
      
      if (isNew) {
        assetsAdded++;
      } else {
        assetsUpdated++;
      }
    });

    // Clean up the uploaded file. Cleanup should not turn a successful import into a failed request.
    cleanupUploadedFile(filePath);

    updateLastUpdated();
    // Return success response
    res.json({
      success: true,
      message: 'File uploaded and processed successfully',
      assetsAdded,
      assetsUpdated,
      totalAssets: getAllAssets().length,
    });
  } catch (error) {
    cleanupUploadedFile(req.file?.path);

    console.error('Upload error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'File upload failed',
    });
  }
  });
});

module.exports = router;
