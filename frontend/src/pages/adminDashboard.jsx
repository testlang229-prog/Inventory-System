import { useState } from "react";

import uploadIcon from "../assets/dashboard/upload-icon.png";
import scanIcon from "../assets/dashboard/scan-icon.png";
import usersIcon from "../assets/dashboard/users-icon.png";
import activityIcon from "../assets/dashboard/activity-icon.png";

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
  const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  }

  if (hour < 18) {
    return "Good Afternoon";
  }

  return "Good Evening";
};

  return (
    <div>

      {/* DASHBOARD MENU */}
      {activePage === "dashboard" && (

  <>

    <div className="mb-8 md:mb-10">

  <div className="flex items-center gap-4">

    <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center shadow-sm">

      <img
        src={activityIcon}
        alt="Dashboard"
        className="w-8 h-8 object-contain"
      />

    </div>

    <div>

      <p className="text-sm md:text-base text-slate-500 font-medium">
        {getGreeting()}, Administrator
      </p>

      <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 leading-tight">
  Operations Overview
</h1>

      <p className="text-sm md:text-base text-slate-500 mt-1">
        Monitor assets, users, and inventory operations
      </p>

    </div>

  </div>

</div>

    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-10">

          {/* Upload */}
<button
  onClick={() => setActivePage("upload")}
  className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-5 md:p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] min-h-[150px] md:min-h-[240px]"
>

  <div className="flex flex-col items-start h-full">

    <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">

      <img
        src={uploadIcon}
        alt="Upload"
        className="w-7 h-7 object-contain"
      />

    </div>

    <div className="mt-8 w-full text-left">

  <h2 className="text-white text-lg md:text-2xl font-bold leading-tight text-left">
        Upload
      </h2>

      <p className="hidden md:block min-h-[40px] text-left text-blue-100 text-sm mt-1">
        Upload inventory files
      </p>

    </div>

  </div>

</button>

          {/* Scan */}
<button
  onClick={() => setActivePage("scan")}
  className="dashboard-card-glow group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 p-5 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] min-h-[150px] md:min-h-[240px]"
>

  <div className="flex flex-col items-start h-full">

    <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">

      <img
        src={scanIcon}
        alt="Scan"
        className="w-7 h-7 object-contain"
      />

    </div>

    <div className="mt-8 w-full text-left">

  <h2 className="text-white text-lg md:text-2xl font-bold leading-tight text-left">
        Scan
      </h2>

      <p className="hidden md:block min-h-[40px] text-green-100 text-sm mt-1">
        Scan and manage assets
      </p>

    </div>

  </div>

</button>

          {/* User Management */}
<button
  onClick={() => setActivePage("users")}
  className="dashboard-card-glow group relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 p-5 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] min-h-[150px] md:min-h-[240px]"
>

  <div className="flex flex-col items-start h-full">

    <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">

      <img
        src={usersIcon}
        alt="Users"
        className="w-7 h-7 object-contain"
      />

    </div>

    <div className="mt-8 w-full text-left">

  <h2 className="text-white text-lg md:text-2xl font-bold leading-tight text-left">
        Users
      </h2>

      <p className="hidden md:block min-h-[40px] text-purple-100 text-sm mt-1">
        Manage system users
      </p>

    </div>

  </div>

</button>

          {/* Activity History */}
<button
  onClick={() =>
    setActivePage("activityHistory")
  }
  className="dashboard-card-glow group relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 p-5 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] min-h-[150px] md:min-h-[240px]"
>

  <div className="flex flex-col items-start h-full">

    <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">

      <img
        src={activityIcon}
        alt="Activity"
        className="w-7 h-7 object-contain"
      />

    </div>

    <div className="mt-8 w-full text-left">

  <h2 className="text-white text-lg md:text-2xl font-bold leading-tight text-left">
        Activity
      </h2>

      <p className="hidden md:block min-h-[40px] text-orange-100 text-sm mt-1">
        View activity logs
      </p>

    </div>

  </div>

</button>

                </div>

  </>

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