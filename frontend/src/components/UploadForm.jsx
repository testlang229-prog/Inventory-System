// frontend/src/components/UploadForm.jsx
// Component for uploading Excel files

import { useState } from 'react';
import { uploadExcelFile } from '../services/api';

export default function UploadForm({ onUploadSuccess, onUploadError }) {
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [recentUploads, setRecentUploads] = useState(() => {
  return JSON.parse(
    localStorage.getItem('recentUploads') || '[]'
  );
});

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
      const updatedUploads = [
  {
    name: file.name,
    time: new Date().toLocaleString(),
  },
  ...recentUploads,
].slice(0, 3);

setRecentUploads(updatedUploads);

localStorage.setItem(
  'recentUploads',
  JSON.stringify(updatedUploads)
);
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
    <div className="bg-gradient-to-br from-white/80 via-white/65 to-slate-100/40 backdrop-blur-2xl border border-white/50 rounded-[32px] shadow-[0_10px_40px_rgba(15,23,42,0.05)] p-5 sm:p-6 mb-6">
      <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-5">
  Upload Excel File
</h2>

      {/* Drag and Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-[28px] p-6 sm:p-10 text-center cursor-pointer transition-all duration-300 backdrop-blur-xl ${
          dragActive
            ? 'border-slate-400 bg-white/70 scale-[1.01]'
: 'border-slate-200 bg-white/40 hover:bg-white/55 hover:border-slate-300'
        }`}
      >
        <div className="mb-4">
          <svg
            className="w-16 h-16 mx-auto text-slate-400 opacity-70"
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
          <span className="text-lg font-semibold text-slate-700">
            {isLoading ? 'Uploading...' : 'Drag and drop your Excel file here'}
          </span>
          <span className="text-sm text-slate-400 mt-2 block">
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

      <div className="grid grid-cols-1 gap-4 mt-5">

  <div className="rounded-[28px] bg-white/45 border border-white/50 backdrop-blur-xl p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">

    <h3 className="text-sm font-semibold text-slate-700 mb-3">
      Recent Uploads
    </h3>

    {recentUploads.length === 0 ? (

      <p className="text-sm text-slate-400">
        No uploads yet
      </p>

    ) : (

      <div className="space-y-3">

        {recentUploads.map((upload, index) => (

          <div
            key={index}
            className="flex items-center justify-between rounded-2xl bg-white/50 border border-white/50 px-4 py-3"
          >

            <div>

              <p className="text-sm font-medium text-slate-700">
                {upload.name}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                {upload.time}
              </p>

            </div>

          </div>

        ))}

      </div>

    )}

  </div>

</div>

      {/* File Format Hint */}
      <p className="text-sm leading-relaxed text-slate-500 mt-5">
         <strong>Supported Columns:</strong> The importer can detect common
        names like Asset No, Asset Number, Description, Serial No, Room,
        Location, Status, and Remarks.
      </p>
    </div>
  );
}
