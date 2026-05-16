import { useState } from "react";

import UploadForm from "../components/UploadForm";
import ScannedAssetDetails from "../components/ScannedAssetDetails";
import UserManagement from "../components/UserManagement";
import AssetTable from "../components/AssetTable";
import QRScanner from "../components/QRScanner";
import ActivityHistory from "../components/ActivityHistory";

export default function AdminDashboard({
  assets,
  headers,
  scannedAssets,
  isLoading,
  onUploadSuccess,
  onUploadError,
  onScanSuccess,
  onScanError,
  onDownload,
  isDownloading,
  onClearAssets,
  isClearing,
}) {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div>

      {/* DASHBOARD MENU */}
      {activePage === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Upload */}
          <button
            onClick={() => setActivePage("upload")}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-6 md:p-8 shadow-lg transition-all duration-300"
          >
            <div className="text-4xl md:text-5xl mb-4">📤</div>

            <h2 className="text-xl md:text-2xl font-bold">
              Upload
            </h2>

            <p className="mt-2 text-sm text-blue-100">
              Upload Excel asset files
            </p>
          </button>

          {/* Scan */}
          <button
            onClick={() => setActivePage("scan")}
            className="bg-green-600 hover:bg-green-700 text-white rounded-2xl p-8 shadow-lg transition-all duration-300"
          >
            <div className="text-5xl mb-4">📱</div>

            <h2 className="text-2xl font-bold">
              Scan
            </h2>

            <p className="mt-2 text-sm text-green-100">
              Scan and manage assets
            </p>
          </button>

          {/* User Management */}
          <button
            onClick={() => setActivePage("users")}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl p-8 shadow-lg transition-all duration-300"
          >
            <div className="text-5xl mb-4">👥</div>

            <h2 className="text-2xl font-bold">
              User Management
            </h2>

            <p className="mt-2 text-sm text-purple-100">
              Manage system users
            </p>
          </button>

          {/* Activity History */}
<button
  onClick={() =>
    setActivePage("activityHistory")
  }
  className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl p-8 shadow-lg transition-all duration-300"
>
  <div className="text-5xl mb-4">
    📋
  </div>

  <h2 className="text-2xl font-bold">
    Activity History
  </h2>

  <p className="mt-2 text-sm text-orange-100">
    View user scan activity logs
  </p>
</button>

        </div>
      )}

      {/* UPLOAD PAGE */}
      {activePage === "upload" && (
        <div>

          <button
            onClick={() => setActivePage("dashboard")}
            className="mb-6 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
          >
            ← Back to Dashboard
          </button>

          <UploadForm
            onUploadSuccess={onUploadSuccess}
            onUploadError={onUploadError}
          />

        </div>
      )}

      {/* SCAN PAGE */}
      {activePage === "scan" && (
        <div>

          {/* Back Button */}
          <button
            onClick={() => setActivePage("dashboard")}
            className="mb-6 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
          >
            ← Back to Dashboard
          </button>

          {/* CUSTOM LAYOUT */}
<div className="flex flex-col xl:flex-row gap-4 items-start">

  {/* LEFT SIDEBAR */}
  <div className="w-full xl:w-[340px] flex-shrink-0 flex flex-col gap-6">

    <div className="order-2 xl:order-1">
  <ScannedAssetDetails
    scannedAssets={scannedAssets}
  />
</div>

<div className="order-1 xl:order-2">
  <QRScanner
    onScanSuccess={onScanSuccess}
    onScanError={onScanError}
  />
</div>

  </div>

  {/* RIGHT CONTENT */}
  <div className="flex-1 min-w-0 w-full">

              {isLoading ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center h-full flex flex-col justify-center">

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
                  onDownload={onDownload}
                  isDownloading={isDownloading}
                  onClearAssets={onClearAssets}
                  isClearing={isClearing}
                />
              )}

            </div>

          </div>

        </div>
      )}

      {/* USER MANAGEMENT PAGE */}
      {activePage === "users" && (
        <div>

          <button
            onClick={() => setActivePage("dashboard")}
            className="mb-6 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
          >
            ← Back to Dashboard
          </button>

          <UserManagement />

        </div>
      )}

      {/* ACTIVITY HISTORY PAGE */}
{activePage === "activityHistory" && (
  <div>

    <button
      onClick={() =>
        setActivePage("dashboard")
      }
      className="mb-6 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
    >
      ← Back to Dashboard
    </button>

    <ActivityHistory
  scannedAssets={scannedAssets}
  currentUser={JSON.parse(
    localStorage.getItem('currentUser')
  )}
/>

  </div>
)}

    </div>
  );
}