// backend/routes/download.js
// Handles downloading updated Excel file

const express = require('express');
const { getAllAssets, getHeaders } = require('../db/database');
const { generateExcelFile } = require('../utils/excelGenerator');

const router = express.Router();

/**
 * GET /api/download
 * Download all assets as an Excel file
 * 
 * Response: Excel file as binary attachment
 */
router.get('/', async (req, res) => {
  try {
    // Get all assets and header metadata from database
    const assets = getAllAssets();
    const headers = getHeaders();

    // Generate Excel file with original header order
    const excelBuffer = await generateExcelFile(assets, headers);

    // Set response headers to trigger download
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const filename = `inventory-${timestamp}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}"`
    );

    // Send the Excel file
    res.send(excelBuffer);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'File download failed',
    });
  }
});

module.exports = router;
