// frontend/src/App.jsx
// Main application component

import { useState, useEffect } from 'react';
import UploadForm from './components/UploadForm';
import AssetTable from './components/AssetTable';
import QRScanner from './components/QRScanner';
import { fetchAssets, downloadExcel, clearAssets } from './services/api';

export default function App() {
  const [assets, setAssets] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [notification, setNotification] = useState(null);

  /**
   * Fetch assets from backend when component mounts
   */
  useEffect(() => {
    loadAssets();
  }, []);

  /**
   * Auto-hide notifications after 4 seconds
   */
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  /**
   * Fetch assets from backend
   */
  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAssets();
      setAssets(data.assets || []);
      setHeaders(data.headers || []);
      showNotification(`✅ Loaded ${data.assets.length} assets`, 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to load assets', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Excel file upload
   */
  const handleUploadSuccess = (result) => {
    showNotification(
      `✅ Upload successful! Added: ${result.assetsAdded}, Updated: ${result.assetsUpdated}`,
      'success'
    );
    // Reload assets from backend
    loadAssets();
  };

  /**
   * Handle upload error
   */
  const handleUploadError = (message) => {
    showNotification(`❌ ${message}`, 'error');
  };

  /**
   * Handle QR scan
   */
  const handleScanSuccess = (result) => {
    if (result.action === 'UPDATED') {
      showNotification(
        `✅ Asset "${result.asset.asset}" marked as ACCOUNTED!`,
        'success'
      );
    } else if (result.action === 'ALREADY_ACCOUNTED') {
      showNotification(
        `ℹ️ Asset "${result.asset.asset}" already accounted`,
        'info'
      );
    }

    // Reload assets to show updated status
    loadAssets();
  };

  /**
   * Handle scan error
   */
  const handleScanError = (message) => {
    showNotification(`❌ Scan error: ${message}`, 'error');
  };

  /**
   * Handle download Excel
   */
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadExcel();
      showNotification('✅ File downloaded successfully!', 'success');
    } catch (error) {
      showNotification(error.message || 'Download failed', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  /**
   * Remove all assets from the current list
   */
  const handleClearAssets = async () => {
    if (assets.length === 0) return;

    const confirmed = window.confirm(
      'Remove all assets from the current list? This cannot be undone.'
    );

    if (!confirmed) return;

    setIsClearing(true);
    try {
      await clearAssets();
      setAssets([]);
      setHeaders([]);
      showNotification('✅ Inventory list cleared. Upload a new Excel file to start fresh.', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to clear inventory list', 'error');
    } finally {
      setIsClearing(false);
    }
  };

  /**
   * Show notification
   */
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                🏢 Asset Inventory System
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                GMADC - OJT Project
              </p>
            </div>
            <button
              onClick={loadAssets}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Notification Alert */}
        {notification && (
          <div
            className={`rounded-lg p-4 mb-6 text-white font-semibold ${
              notification.type === 'success'
                ? 'bg-green-500'
                : notification.type === 'error'
                ? 'bg-red-500'
                : 'bg-blue-500'
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Upload and Scanner */}
          <div className="lg:col-span-1">
            <UploadForm
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />

            <QRScanner
              onScanSuccess={handleScanSuccess}
              onScanError={handleScanError}
            />
          </div>

          {/* Right Column: Asset Table */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-gray-600 mt-4">Loading assets...</p>
              </div>
            ) : (
              <AssetTable
                assets={assets}
                headers={headers}
                onDownload={handleDownload}
                isDownloading={isDownloading}
                onClearAssets={handleClearAssets}
                isClearing={isClearing}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>
            Asset Inventory System v1.0 | Backend: http://localhost:5000
          </p>
          <p className="text-gray-400 mt-2">
            © 2026 GMADC OJT Project
          </p>
        </div>
      </footer>
    </div>
  );
}
