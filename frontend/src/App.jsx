// frontend/src/App.jsx
// Main application component

import {
  useState,
  useEffect,
  useRef,
} from 'react';

import UploadForm from './components/UploadForm';
import AssetTable from './components/AssetTable';
import QRScanner from './components/QRScanner';
import ScannedAssetDetails from './components/ScannedAssetDetails';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import UserManagement from './components/UserManagement';
import AdminDashboard from './pages/adminDashboard';

import {
  fetchAssets,
  downloadExcel,
  clearAssets,
  addAsset,
  loginUser,
  getLastUpdated
} from './services/api';

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

const getCurrentMonthStatusHeader = () => {
  const currentDate = new Date();

  const month =
    monthNames[currentDate.getMonth()]
      .charAt(0) +
    monthNames[currentDate.getMonth()]
      .slice(1)
      .toLowerCase();

  return `${month} ${currentDate.getFullYear()} STATUS`;
};

const getNewAssetColumns = (headers) => {
  const currentMonthStatusHeader = getCurrentMonthStatusHeader();

  const columns = (headers && headers.length > 0
    ? headers
    : fallbackAssetHeaders
  ).filter(header => header && !isInternalField(header));

  if (
    !columns.some(
      header =>
        normalizeHeader(header) ===
        normalizeHeader(currentMonthStatusHeader)
    )
  ) {
    const remarksIndex = columns.findIndex(
      header => normalizeHeader(header) === 'remarks'
    );

    columns.splice(
      remarksIndex >= 0 ? remarksIndex : columns.length,
      0,
      currentMonthStatusHeader
    );
  }

  return columns;
};

const createNewAssetForm = (headers, scannedValue) => {
  const currentMonthStatusHeader = getCurrentMonthStatusHeader();

  return getNewAssetColumns(headers).reduce((form, header) => {
    const normalizedHeader = normalizeHeader(header);

    let value = '';

    if (
      ['asset', 'asset no', 'asset number'].includes(normalizedHeader)
    ) {
      value = scannedValue;
    } else if (normalizedHeader === 'status') {
      value = 'ACCOUNTED';
    } else if (normalizedHeader === 'remarks') {
      value = '';
    } else if (
      normalizeHeader(header) ===
      normalizeHeader(currentMonthStatusHeader)
    ) {
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

const [lastKnownUpdate, setLastKnownUpdate] = useState(null);

const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [loginView, setLoginView] = useState('user');

  const [isSwitchingLogin, setIsSwitchingLogin] =
  useState(false);

  const [showProfileMenu, setShowProfileMenu] =
  useState(false);

const profileMenuRef = useRef(null);

const switchLoginView = view => {
  setIsSwitchingLogin(true);

  setTimeout(() => {

    setLoginView(view);

    setTimeout(() => {
      setIsSwitchingLogin(false);
    }, 50);

  }, 250);
};

  const [currentUser, setCurrentUser] = useState({
    employeeId: '',
    department: '',
    role: 'user',
  });


  useEffect(() => {
  loadAssets();

  const checkUpdates = async () => {
    const latestUpdate = await getLastUpdated();

    if (
      latestUpdate &&
      lastKnownUpdate &&
      latestUpdate !== lastKnownUpdate
    ) {
      await loadAssets();
    }

    if (latestUpdate) {
      setLastKnownUpdate(latestUpdate);
    }
  };

  const interval = setInterval(checkUpdates, 2000);

  return () => clearInterval(interval);
}, [lastKnownUpdate]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
  const handleClickOutside = event => {
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(
        event.target
      )
    ) {
      setShowProfileMenu(false);
    }
  };

  document.addEventListener(
    'mousedown',
    handleClickOutside
  );

  return () => {
    document.removeEventListener(
      'mousedown',
      handleClickOutside
    );
  };
}, []);

  useEffect(() => {
    const loggedIn =
      localStorage.getItem('isLoggedIn') === 'true';

    const userData = localStorage.getItem('currentUser');

    const user = userData
      ? JSON.parse(userData)
      : {
          employeeId: '',
          department: '',
          role: 'user',
        };

    setIsLoggedIn(loggedIn);
    setCurrentUser(user);
  }, []);

  const loadAssets = async () => {
    setIsLoading(true);

    try {
      const data = await fetchAssets();

      setAssets(data.assets || []);
      setHeaders(data.headers || []);

      if (
        assets.length === 0 &&
        data.assets &&
        data.assets.length > 0
      ) {
        showNotification(
          `✅ Loaded ${data.assets.length} assets from inventory`,
          'success'
        );
      }
    } catch (error) {
      showNotification(
        error.message || 'Failed to load assets',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = (result) => {
    showNotification(
      `✅ Upload successful! Added: ${result.assetsAdded}, Updated: ${result.assetsUpdated}`,
      'success'
    );

    loadAssets();
  };

  const handleUploadError = (message) => {
    showNotification(`❌ ${message}`, 'error');
  };

  const addScannedAssetDetail = (asset) => {
  if (!asset) return;

  setScannedAssets([
    {
      ...asset,
      scannedAt: new Date().toISOString(),
    },
  ]);
};

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

  if (assets.length === 0) {
    showNotification(
      '⚠️ Upload an asset list first before scanning.',
      'info'
    );

    return;
  }

  const scannedValue = result.scannedValue || '';

  setNewAssetScannedValue(scannedValue);

  setNewAssetForm(
    createNewAssetForm(headers, scannedValue)
  );

  setShowNewAssetConfirm(true);

  return;
}

    loadAssets();
  };

  const handleNewAssetFormChange = (event) => {
    const { name, value } = event.target;

    setNewAssetForm(currentForm => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleConfirmAddNewAsset = () => {
    setShowNewAssetConfirm(false);

    setNewAssetForm({});

    setTimeout(() => {
      setNewAssetForm(
        createNewAssetForm(headers, newAssetScannedValue)
      );

      setShowNewAssetModal(true);
    }, 0);
  };

  const handleCancelNewAssetConfirm = () => {
    setShowNewAssetConfirm(false);

    setNewAssetScannedValue('');
    setNewAssetForm({});
  };

  const handleAddNewAsset = async (event) => {
    event.preventDefault();

    setIsAddingAsset(true);

    try {
      const result = await addAsset({
        fields: newAssetForm,
      });

      addScannedAssetDetail(result.asset);

      showNotification(
        `✅ New asset "${result.asset.asset}" added successfully!`,
        'success'
      );

      setShowNewAssetModal(false);

      setNewAssetScannedValue('');
      setNewAssetForm({});

      setTimeout(() => {
        loadAssets();
      }, 500);
    } catch (error) {
  if (error.message?.includes('already exists')) {

  alert(
  error.message ||
  '⚠️ Same asset already exists in the inventory.'
);

  showNotification(
    '⚠️ Same asset already exists in the inventory.',
    'info'
  );
} else {
    console.error('Error adding asset:', error);

    showNotification(
      error.message || 'Failed to add new asset',
      'error'
    );
  }
} finally {
      setIsAddingAsset(false);
    }
  };

  const handleCloseNewAssetModal = () => {
    if (isAddingAsset) return;

    setShowNewAssetModal(false);

    setNewAssetScannedValue('');
    setNewAssetForm({});
  };

  const handleScanError = (message) => {
    showNotification(`❌ Scan error: ${message}`, 'error');
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      await downloadExcel();

      showNotification(
        '✅ File downloaded successfully!',
        'success'
      );
    } catch (error) {
      showNotification(
        error.message || 'Download failed',
        'error'
      );
    } finally {
      setIsDownloading(false);
    }
  };

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

      showNotification(
        '✅ Inventory list cleared. Upload a new Excel file to start fresh.',
        'success'
      );
    } catch (error) {
      showNotification(
        error.message || 'Failed to clear inventory list',
        'error'
      );
    } finally {
      setIsClearing(false);
    }
  };

  const showNotification = (
    message,
    type = 'info'
  ) => {
    setNotification({ message, type });
  };

  const handleLogin = async (user) => {
    try {
      const result = await loginUser(user);

      if (!result.success) {
        showNotification(
          '❌ Unauthorized user',
          'error'
        );

        return;
      }

      const userData = result.user;

      if (userData.role === 'admin') {
  alert(
    '⚠️ Please use the Admin Login page for administrator accounts.'
  );

  return;
}

      setIsLoggedIn(true);
      setCurrentUser(userData);

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', result.token);
      localStorage.setItem(
        'currentUser',
        JSON.stringify(userData)
      );

      await loadAssets();

      showNotification(
        '✅ Login successful',
        'success'
      );
    } catch (error) {
      alert(
        '❌ Access denied.\n\nYour Employee ID and Department are not registered by the administrator.'
      );
    }
  };

  const handleAdminLogin = async (adminUser) => {
  try {
    const result = await loginUser(adminUser);

    if (!result.success) {
      showNotification(
        '❌ Unauthorized admin',
        'error'
      );

      return;
    }

    const userData = result.user;

    if (userData.role !== 'admin') {
      alert(
        '❌ Access denied.\n\nThis account is not an administrator.'
      );

      return;
    }

    setIsLoggedIn(true);
    setCurrentUser(userData);

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('token', result.token);

    localStorage.setItem(
      'currentUser',
      JSON.stringify(userData)
    );

    await loadAssets();

    showNotification(
      '✅ Admin login successful',
      'success'
    );

  } catch (error) {
    alert(
      '❌ Admin login failed.'
    );
  }
};

  const handleLogout = () => {
    setShowProfileMenu(false);
    setIsLoggedIn(false);

    setLoginView('user');

    setCurrentUser({
      employeeId: '',
      department: '',
      role: 'user',
    });

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');

    setAssets([]);
    setHeaders([]);
    setScannedAssets([]);
  };

  const hiddenFields = [
  'REMARKS',
  'NO CHANGE / WITH CHANGE',
  'CORRECT COST CENTER',
  'CORRECT SERIAL NUMBER',
  'CORRECT RESP. COST CENTER',
  'CORRECT ASSIGNEE',
  'CORRECT PLANT CODE',
];

const newAssetColumns = getNewAssetColumns(headers).filter(header => {
  const normalized = normalizeHeader(header);

  if (
    normalized.includes('remarks') ||
    normalized.includes('may') ||
    normalized.includes('no change')
  ) {
    return false;
  }

  return !hiddenFields.some(
    hidden =>
      normalizeHeader(hidden) === normalized
  );
});

  const isGeneratedNewAssetField = (header) => {
    const normalizedHeader = normalizeHeader(header);

    return (
      normalizedHeader === 'status' ||
      normalizedHeader === 'remarks' ||
      isMonthlyStatusHeader(header)
    );
  };

  const dropdownFields = [
  'STATUS (ACCOUNTED / UNACCOUNTED / RECONCILING)',
];

const getDropdownOptions = (header) => {
  const values = assets
    .map(asset => asset[header])
    .filter(value => value && String(value).trim() !== '');

  return [...new Set(values)];
};

  const isRequiredNewAssetField = (header) => {
    const normalizedHeader = normalizeHeader(header);

    return [
      'asset',
      'asset no',
      'asset number',
      'asset description',
      'description',
    ].includes(normalizedHeader);
  };

  if (!isLoggedIn) {
  return (
    <div
      className={`transition-opacity duration-300 ${
  isSwitchingLogin
    ? 'opacity-0'
    : 'opacity-100'
}`}
    >

      {loginView === 'admin' ? (
        <AdminLogin
          onLogin={handleAdminLogin}
          onBack={() =>
            switchLoginView('user')
          }
        />
      ) : (
        <Login
          onLogin={handleLogin}
          onShowAdmin={() =>
            switchLoginView('admin')
          }
        />
      )}

    </div>
  );
}

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          
          <div className="flex items-start justify-between gap-4 lg:items-center">
            <div className="flex flex-col gap-3">
              <h1 className="text-xl md:text-3xl font-bold text-gray-800">
                {isAdmin
                  ? '🔒 Admin Dashboard'
                  : '🏢 Asset Inventory System'}
              </h1>

              <p className="text-gray-600 text-sm mt-1">
                GMADC - OJT Project
              </p>

              
            </div>

<div
  ref={profileMenuRef}
  className="relative self-start lg:self-center"
>

  <button
  onClick={() =>
    setShowProfileMenu(
      !showProfileMenu
    )
  }
  className="inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-2 py-2 shadow-sm hover:bg-gray-100 transition"
>

    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white text-base font-bold">
      {isAdmin
        ? 'A'
        : currentUser.name
            ?.charAt(0)
            ?.toUpperCase() || 'U'}
    </div>

    <div className="hidden md:block leading-tight text-left">
      <p className="font-semibold text-gray-800">
        {isAdmin
          ? 'Administrator'
          : currentUser.name}
      </p>

      <p className="text-sm text-gray-500">
        ID: {currentUser.employeeId}
      </p>

      {!isAdmin && (
        <p className="text-xs text-gray-400">
          {currentUser.department}
        </p>
      )}
    </div>

    <span className="hidden md:block text-gray-400 text-sm">
      ▼
    </span>

  </button>

  {showProfileMenu && (
  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden z-50">

<div className="block md:hidden px-4 py-3 border-b border-gray-100">

  <p className="font-semibold text-gray-800">
    {isAdmin
      ? 'Administrator'
      : currentUser.name}
  </p>

  <p className="text-sm text-gray-500">
    ID: {currentUser.employeeId}
  </p>

  {!isAdmin && (
    <p className="text-xs text-gray-400 mt-1">
      {currentUser.department}
    </p>
  )}

</div>

      <button
        onClick={() => {
          loadAssets();
          setShowProfileMenu(false);
        }}
        className="w-full px-4 py-3 text-left hover:bg-gray-100 transition"
      >
        🔄 Refresh
      </button>

      <button
        onClick={handleLogout}
        className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition"
      >
        🚪 Logout
      </button>

    </div>
  )}

</div>

          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-8">

        {/* Notifications */}
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

        {/* ADMIN */}
        {isAdmin ? (
          <AdminDashboard
            assets={assets}
            headers={headers}
            scannedAssets={scannedAssets}
            isLoading={isLoading}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            onScanSuccess={handleScanSuccess}
            onScanError={handleScanError}
            onDownload={handleDownload}
            isDownloading={isDownloading}
            onClearAssets={handleClearAssets}
            isClearing={isClearing}
          />
        ) : (

          /* USER VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-1 flex flex-col gap-6">

              <div className="order-2 lg:order-1">
  <ScannedAssetDetails
    scannedAssets={scannedAssets}
    headers={headers}
  />
</div>

<div className="order-1 lg:order-2">
  <QRScanner
    onScanSuccess={handleScanSuccess}
    onScanError={handleScanError}
  />
</div>

            </div>

            <div className="lg:col-span-2">

              {isLoading ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">

                  <div className="inline-block">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>

                  <p className="text-gray-600 mt-4">
                    Loading assets...
                  </p>

                </div>
              ) : (
                <AssetTable
                  assets={assets}
                  headers={headers}
                  onDownload={handleDownload}
                  isDownloading={isDownloading}
                />
              )}

            </div>

          </div>
        )}
      </main>

      {/* NEW ASSET CONFIRM MODAL */}
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

      {/* NEW ASSET MODAL */}
      {showNewAssetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 px-4">

          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">

            <div className="border-b border-gray-200 px-6 py-4">

              <h2 className="text-xl font-bold text-gray-800">
                Add New Asset Details
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Fill the new asset details using the same columns
                from the uploaded Excel file.
              </p>

            </div>

            <form
              onSubmit={handleAddNewAsset}
              className="max-h-[calc(90vh-96px)] overflow-y-auto px-6 py-5"
            >

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                {newAssetColumns.map(header => (
                  <label
                    key={header}
                    className={`block ${
                      normalizeHeader(header) ===
                      'asset description'
                        ? 'md:col-span-2'
                        : ''
                    }`}
                  >

                    <span className="mb-1 block text-sm font-semibold text-gray-700">
                      {header}
                    </span>

                    {dropdownFields.includes(header) ? (
  <select
    name={header}
    value={newAssetForm[header] || ''}
    onChange={handleNewAssetFormChange}
    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">Select {header}</option>

    <option value="ACCOUNTED">
  ACCOUNTED
</option>

<option value="UNACCOUNTED">
  UNACCOUNTED
</option>

<option value="RECONCILING">
  RECONCILING
</option>
  </select>
) : (
  <input
    name={header}
    value={newAssetForm[header] || ''}
    onChange={handleNewAssetFormChange}
    required={isRequiredNewAssetField(header)}
    readOnly={isGeneratedNewAssetField(header)}
    className={`w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      isGeneratedNewAssetField(header)
        ? 'bg-gray-100 text-gray-600'
        : ''
    }`}
  />
)}

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
                  {isAddingAsset
                    ? 'Saving...'
                    : 'Add New Asset'}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-6">

        <div className="max-w-7xl mx-auto px-4 text-center text-sm">

          <p>Asset Inventory System</p>

          <p className="text-gray-400 mt-2">
            © 2026 GMADC OJT Project
          </p>

        </div>

      </footer>

    </div>
  );
}
