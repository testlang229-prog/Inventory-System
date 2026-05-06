// frontend/src/components/UploadForm.jsx
// Component for uploading Excel files

import { useState } from 'react';
import { uploadExcelFile } from '../services/api';

export default function UploadForm({ onUploadSuccess, onUploadError }) {
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  /**
   * Handle file upload (from input or drag-drop)
   */
  const handleFileUpload = async (file) => {
    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      onUploadError('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    setIsLoading(true);
    try {
      // Send file to backend
      const result = await uploadExcelFile(file);

      // Call success callback with statistics
      onUploadSuccess(result);
    } catch (error) {
      onUploadError(error.message || 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle drag and drop
   */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  /**
   * Handle drop event
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  /**
   * Handle file input change
   */
  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        📤 Upload Excel File
      </h2>

      {/* Drag and Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <div className="mb-4">
          <svg
            className="w-12 h-12 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        <label className="block cursor-pointer">
          <span className="text-lg font-semibold text-gray-700">
            {isLoading ? 'Uploading...' : 'Drag and drop your Excel file here'}
          </span>
          <span className="text-sm text-gray-500 mt-2 block">
            or click to select a file
          </span>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleInputChange}
            disabled={isLoading}
            className="hidden"
          />
        </label>
      </div>

      {/* File Format Hint */}
      <p className="text-sm text-gray-600 mt-4">
        💡 <strong>Supported Columns:</strong> The importer can detect common
        names like Asset No, Asset Number, Description, Serial No, Room,
        Location, Status, and Remarks.
      </p>
    </div>
  );
}
