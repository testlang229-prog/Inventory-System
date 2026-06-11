// frontend/src/App.jsx
// Main application component

import { useState, useEffect } from 'react';
import UploadForm from './components/UploadForm';
import AssetTable from './components/AssetTable';
import QRScanner from './components/QRScanner';
import ScannedAssetDetails from './components/ScannedAssetDetails';
import { fetchAssets, downloadExcel, clearAssets, addAsset } from './services/api';

const fallbackAssetHeaders = [
  'Asset',
  'Subnumber',
  'Asset Description',
  'Cost Center',
  'Serial number',
  'Resp. cost center',
  'CORRECT ROOM',
  'STATUS (ACCOUNTED / UNACCOUNTED / RECONCILING)',
  'REMARKS',
];

const monthNames = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];

const normalizeHeader = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const isInternalField = (header) =>
  normalizeHeader(header).replace(/\s+/g, '') === 'scanningmonth';

const isMonthlyStatusHeader = (header) =>
  monthNames.some(month => normalizeHeader(header) === `${month.toLowerCase()} status`);

const getCurrentMonthStatusHeader = () => `${monthNames[new Date().getMonth()]} STATUS`;

const getNewAssetColumns = (headers) => {
  const currentMonthStatusHeader = getCurrentMonthStatusHeader();
  const columns = (headers && headers.length > 0 ? headers : fallbackAssetHeaders)
    .filter(header => header && !isInternalField(header));

  if (!columns.some(header => normalizeHeader(header) === normalizeHeader(currentMonthStatusHeader))) {
    const remarksIndex = columns.findIndex(header => normalizeHeader(header) === 'remarks');
    columns.splice(remarksIndex >= 0 ? remarksIndex : columns.length, 0, currentMonthStatusHeader);
  }

  return columns;
};

const createNewAssetForm = (headers, scannedValue) => {
  const currentMonthStatusHeader = getCurrentMonthStatusHeader();

  return getNewAssetColumns(headers).reduce((form, header) => {
    const normalizedHeader = normalizeHeader(header);
    let value = '';

    if (['asset', 'asset no', 'asset number'].includes(normalizedHeader)) {
      value = scannedValue;
    } else if (normalizedHeader === 'status') {
      value = 'ACCOUNTED';
    } else if (normalizedHeader === 'remarks') {
      value = '';
    } else if (normalizeHeader(header) === normalizeHeader(currentMonthStatusHeader)) {
      value = '';
    } else if (isMonthlyStatusHeader(header)) {
      value = '';
    }

    form[header] = value;
    return form;
  }, {});
};

export default function App() {
  const [assets, setAssets] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [newAssetForm, setNewAssetForm] = useState({});
  const [newAssetScannedValue, setNewAssetScannedValue] = useState('');
  const [showNewAssetConfirm, setShowNewAssetConfirm] = useState(false);
  const [showNewAssetModal, setShowNewAssetModal] = useState(false);
  const [scannedAssets, setScannedAssets] = useState([]);
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
      // Only show notification on initial load (when no assets exist before)
      // to avoid cluttering the UI
      if (assets.length === 0 && data.assets && data.assets.length > 0) {
        showNotification(`✅ Loaded ${data.assets.length} assets from inventory`, 'success');
      }
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
   * Add scanned asset details to the left-side scan history
   */
  const addScannedAssetDetail = (asset) => {
    if (!asset) return;

    setScannedAssets(currentAssets => {
      const assetKey = String(asset.id || asset.asset || asset.Asset || '');
      const withoutExisting = currentAssets.filter(currentAsset =>
        String(currentAsset.id || currentAsset.asset || currentAsset.Asset || '') !== assetKey
      );

      return [
        ...withoutExisting,
        {
          ...asset,
          scannedAt: new Date().toISOString(),
        },
      ];
    });
  };

  /**
   * Handle QR scan
   */
  const handleScanSuccess = (result) => {
    if (result.action === 'UPDATED') {
      addScannedAssetDetail(result.asset);
      showNotification(
        `✅ Asset "${result.asset.asset}" marked as ACCOUNTED!`,
        'success'
      );
    } else if (result.action === 'ALREADY_ACCOUNTED') {
      addScannedAssetDetail(result.asset);
      showNotification(
        `ℹ️ Asset "${result.asset.asset}" already accounted`,
        'info'
      );
    } else if (result.action === 'NEW_ASSET') {
      const scannedValue = result.scannedValue || '';
      setNewAssetScannedValue(scannedValue);
      setNewAssetForm(createNewAssetForm(headers, scannedValue));
      setShowNewAssetConfirm(true);
      return;
    }

    // Reload assets to show updated status
    loadAssets();
  };

  /**
   * Update the new asset form
   */
  const handleNewAssetFormChange = (event) => {
    const { name, value } = event.target;
    setNewAssetForm(currentForm => ({
      ...currentForm,
      [name]: value,
    }));
  };

  /**
   * Continue from the new asset confirmation to the details form
   */
  const handleConfirmAddNewAsset = () => {
    setShowNewAssetConfirm(false);
    // Clear any previous form data completely before creating new form
    setNewAssetForm({});
    // Use a small delay to ensure state is cleared before creating new form
    setTimeout(() => {
      setNewAssetForm(createNewAssetForm(headers, newAssetScannedValue));
      setShowNewAssetModal(true);
    }, 0);
  };

  /**
   * Dismiss the new asset confirmation
   */
  const handleCancelNewAssetConfirm = () => {
    setShowNewAssetConfirm(false);
    setNewAssetScannedValue('');
    setNewAssetForm({});
  };

  /**
   * Save a newly scanned asset
   */
  const handleAddNewAsset = async (event) => {
    event.preventDefault();
    setIsAddingAsset(true);

    try {
      const result = await addAsset({ fields: newAssetForm });
      addScannedAssetDetail(result.asset);
      // Show success notification
      showNotification(`✅ New asset "${result.asset.asset}" added successfully!`, 'success');
      setShowNewAssetModal(false);
      setNewAssetScannedValue('');
      setNewAssetForm({});
      // Reload assets from backend after a short delay to ensure DB is updated
      setTimeout(() => {
        loadAssets();
      }, 500);
    } catch (error) {
      console.error('Error adding asset:', error);
      showNotification(error.message || 'Failed to add new asset', 'error');
    } finally {
      setIsAddingAsset(false);
    }
  };

  /**
   * Close new asset modal
   */
  const handleCloseNewAssetModal = () => {
    if (isAddingAsset) return;
    setShowNewAssetModal(false);
    setNewAssetScannedValue('');
    setNewAssetForm({});
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
      setScannedAssets([]);
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

  const newAssetColumns = getNewAssetColumns(headers);
  const isGeneratedNewAssetField = (header) => {
    const normalizedHeader = normalizeHeader(header);
    return normalizedHeader === 'status' ||
      normalizedHeader === 'remarks' ||
      isMonthlyStatusHeader(header);
  };
  const isRequiredNewAssetField = (header) => {
    const normalizedHeader = normalizeHeader(header);
    return ['asset', 'asset no', 'asset number', 'asset description', 'description'].includes(normalizedHeader);
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

            <ScannedAssetDetails
              scannedAssets={scannedAssets}
              headers={headers}
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

      {showNewAssetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-800">
                New Asset Scanned
              </h2>
            </div>

            <div className="px-6 py-5">
              <p className="text-gray-700">
                New asset scanned but not in the Excel file.
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                Asset: {newAssetScannedValue}
              </p>
              <p className="mt-4 text-gray-700">
                Do you want to add this new asset in the file?
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancelNewAssetConfirm}
                  className="rounded-lg border border-gray-300 px-5 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAddNewAsset}
                  className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Yes, Add Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewAssetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-800">
                Add New Asset Details
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Fill the new asset details using the same columns from the uploaded Excel file.
              </p>
            </div>

            <form onSubmit={handleAddNewAsset} className="max-h-[calc(90vh-96px)] overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {newAssetColumns.map(header => (
                  <label
                    key={header}
                    className={`block ${normalizeHeader(header) === 'asset description' ? 'md:col-span-2' : ''}`}
                  >
                    <span className="mb-1 block text-sm font-semibold text-gray-700">
                      {header}
                    </span>
                    <input
                      name={header}
                      value={newAssetForm[header] || ''}
                      onChange={handleNewAssetFormChange}
                      required={isRequiredNewAssetField(header)}
                      readOnly={isGeneratedNewAssetField(header)}
                      className={`w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isGeneratedNewAssetField(header) ? 'bg-gray-100 text-gray-600' : ''
                      }`}
                    />
                  </label>
                ))}
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseNewAssetModal}
                  disabled={isAddingAsset}
                  className="rounded-lg border border-gray-300 px-5 py-2 font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingAsset}
                  className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {isAddingAsset ? 'Saving...' : 'Add New Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>
            Asset Inventory System
          </p>
          <p className="text-gray-400 mt-2">
            © 2026 GMADC OJT Project
          </p>
        </div>
      </footer>
    </div>
  );
}
