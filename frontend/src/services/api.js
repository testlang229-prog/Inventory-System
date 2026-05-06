// frontend/src/services/api.js
// API communication layer - all backend requests go through here

import axios from 'axios';

// Base URL for backend API
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Upload Excel file to backend
 * @param {File} file - The Excel file to upload
 * @returns {Promise<Object>} - Upload response with statistics
 */
export async function uploadExcelFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Upload failed' };
  }
}

/**
 * Fetch all assets from backend
 * @returns {Promise<Object>} - All assets and statistics
 */
export async function fetchAssets() {
  try {
    const response = await apiClient.get('/assets');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch assets' };
  }
}

/**
 * Remove all assets from the current inventory list
 * @returns {Promise<Object>} - Clear response
 */
export async function clearAssets() {
  try {
    const response = await apiClient.delete('/assets');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to clear assets' };
  }
}

/**
 * Send scanned QR code data to backend
 * @param {string} scannedValue - The value from scanned QR code
 * @returns {Promise<Object>} - Updated asset information
 */
export async function processScan(scannedValue) {
  try {
    const response = await apiClient.post('/scan', {
      scannedValue: scannedValue,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Scan processing failed' };
  }
}

/**
 * Download updated Excel file
 * Triggers automatic download in browser
 */
export async function downloadExcel() {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/download`,
      {
        responseType: 'blob', // Important: receive as binary file
      }
    );

    // Create a blob and trigger download
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Create temporary link and download
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `inventory-${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  } catch (error) {
    throw { message: 'Failed to download file' };
  }
}

export default apiClient;
