// frontend/src/components/AssetTable.jsx
// Component to display assets in a table with sorting and filtering

import {
  useState,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import StatusBadge from './StatusBadge';
import { QRCodeCanvas } from 'qrcode.react';

export default function AssetTable({
  assets,
  headers = [],
  onDownload,
  isDownloading,
  isLoading,
  onClearAssets,
  isClearing,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('asset');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedQRAsset, setSelectedQRAsset] =
  useState(null);

const qrRef = useRef(null);
const searchPlaceholders = [
  '🔍 Search Asset #: 10001234',
  '🔍 Search Serial #: DELL-9282',
  '🔍 Search Description: Monitor',
  '🔍 Search Cost Center',
  '🔍 Search Room',
];

const [placeholderIndex, setPlaceholderIndex] =
  useState(0);

  useEffect(() => {

  if (searchTerm) return;

  const interval = setInterval(() => {

    setPlaceholderIndex(prev =>
      (prev + 1) %
      searchPlaceholders.length
    );

  }, 3500);

  return () => clearInterval(interval);

}, [searchTerm]);

  const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const currentMonth = monthNames[new Date().getMonth()];
  const currentYear = new Date().getFullYear();
  const currentRemarksLabel = `${currentMonth} ${currentYear} REMARKS`;

  const defaultColumns = [
    { key: 'asset', label: 'Asset #' },
    { key: 'assetDescription', label: 'Description' },
    { key: 'serialNumber', label: 'Serial #' },
    { key: 'costCenter', label: 'Cost Center' },
    { key: 'correctRoom', label: 'Room' },
    { key: 'status', label: 'Status' },
    { key: `${currentMonth} STATUS`, label: `${currentMonth} STATUS` },
    { key: 'remarks', label: currentRemarksLabel },
  ];

  const normalizeLabel = (label) =>
    String(label || '')
      .toLowerCase()
      .replace(/\([^)]*\)/g, '')
      .replace(/[^a-z0-9 ]+/g, ' ')
      .trim();

  const isInternalField = (label) =>
    normalizeLabel(label).replace(/\s+/g, '') === 'scanningmonth';

  const isMonthlyRemarksHeader = (label) => {
    const normalized = normalizeLabel(label);
    return /^(january|february|march|april|may|june|july|august|september|october|november|december)\s*\d{4}\s*remarks$/.test(normalized);
  };

  const isRemarksHeader = (label) => {
    const normalized = normalizeLabel(label);
    return normalized === 'remarks' || (normalized.endsWith(' remarks') && !isMonthlyRemarksHeader(label));
  };

  const getAssetValue = (asset, header) => {
    if (isMonthlyRemarksHeader(header)) {
      if (asset[header] !== undefined) {
        return asset[header];
      }
      const normalizedHeader = normalizeLabel(header);
      const matchingKey = Object.keys(asset).find(key => normalizeLabel(key) === normalizedHeader);
      return matchingKey ? asset[matchingKey] : '';
    }

    if (isRemarksHeader(header)) {
      return asset.remarks || asset.REMARKS || asset.Remarks || asset.remark || asset.notes || asset.note || asset.comments || asset.comment || '';
    }

    if (asset[header] !== undefined) {
      return asset[header];
    }

    const normalizedHeader = normalizeLabel(header);
    const matchingKey = Object.keys(asset).find(key => {
      const normalizedKey = normalizeLabel(key);
      return normalizedKey === normalizedHeader;
    });

    return matchingKey ? asset[matchingKey] : '';
  };
const tableColumns = headers && headers.length > 0
  ? (() => {
      let processedHeaders = [...headers].filter(
        header => !isInternalField(header)
      );

      const monthRegex =
        /^(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}/i;

      // AUTO ADD missing STATUS/REMARKS pair
      processedHeaders.forEach(header => {
        const normalized = normalizeLabel(header);

        const match = normalized.match(monthRegex);

        if (match) {
          const monthYear = match[0];

          const statusHeader =
            `${monthYear.toUpperCase()} STATUS`;

          const remarksHeader =
            `${monthYear.toUpperCase()} REMARKS`;

          const hasStatus = processedHeaders.some(
            h => normalizeLabel(h) === normalizeLabel(statusHeader)
          );

          const hasRemarks = processedHeaders.some(
            h => normalizeLabel(h) === normalizeLabel(remarksHeader)
          );

          if (!hasStatus) {
            processedHeaders.push(statusHeader);
          }

          if (!hasRemarks) {
            processedHeaders.push(remarksHeader);
          }
        }
      });

      // REMOVE DUPLICATES
      processedHeaders = [...new Set(processedHeaders)];

      // SORT MONTH COLUMNS
      processedHeaders.sort((a, b) => {
        const aNorm = normalizeLabel(a);
        const bNorm = normalizeLabel(b);

        const aMatch = aNorm.match(monthRegex);
        const bMatch = bNorm.match(monthRegex);

        if (aMatch && bMatch) {
          const monthOrder = [
            'january', 'february', 'march', 'april',
            'may', 'june', 'july', 'august',
            'september', 'october', 'november', 'december'
          ];

          const [aMonth, aYear] = aMatch[0].split(' ');
          const [bMonth, bYear] = bMatch[0].split(' ');

          if (aYear !== bYear) {
            return parseInt(aYear) - parseInt(bYear);
          }

          const monthCompare =
            monthOrder.indexOf(aMonth) -
            monthOrder.indexOf(bMonth);

          if (monthCompare !== 0) {
            return monthCompare;
          }

          const aIsStatus = aNorm.endsWith(' status');
          const aIsRemarks = aNorm.endsWith(' remarks');

          const bIsStatus = bNorm.endsWith(' status');
          const bIsRemarks = bNorm.endsWith(' remarks');

          if (aIsStatus && bIsRemarks) return -1;
          if (aIsRemarks && bIsStatus) return 1;
        }

        return 0;
      });

            return processedHeaders.map(header => ({
        key: header,
        label: header,
      }));
    })()
  : defaultColumns;
  

  const normalizeHeader = (header) =>
    String(header || '')
      .toLowerCase()
      .replace(/\([^)]*\)/g, '')
      .replace(/[^a-z0-9]+/g, '');

  const getRemarksRank = (value) => {
    const normalized = String(value || '').toLowerCase().trim();
    if (normalized === 'found') return 0;
    if (normalized === 'not found' || normalized === 'notfound') return 1;
    if (normalized === '') return 3;
    return 2;
  };

  

  /**
   * Filter and sort assets based on search, status filter, and sort options
   */
  const filteredAssets = useMemo(() => {
    let filtered = [...assets];

    if (searchTerm) {
      const searchValue = searchTerm.toLowerCase();
      filtered = filtered.filter(asset =>
        Object.entries(asset).some(([key, value]) =>
          !isInternalField(key) &&
          String(value || '').toLowerCase().includes(searchValue)
        )
      );
    }

    if (filterStatus !== 'ALL') {
      if (filterStatus === 'FOUND' || filterStatus === 'NOT_FOUND') {
  filtered = filtered.filter(asset => {

    // check ALL monthly STATUS columns
    const monthlyStatuses = Object.keys(asset)
      .filter(key => {
  const normalized = normalizeLabel(key);

  return (
    normalized.endsWith(' status') &&
    normalized !== 'status' &&
    normalized !== 'status accounted unaccounted reconciling'
  );
})
      .map(key =>
        String(asset[key] || '')
          .toLowerCase()
          .trim()
      );

    const hasFound = monthlyStatuses.some(
      value => value === 'found'
    );

    const hasNotFound = monthlyStatuses.some(
      value =>
        value === 'not found' ||
        value === 'notfound'
    );

    return filterStatus === 'FOUND'
      ? hasFound
      : hasNotFound;
  });
} else {
        filtered = filtered.filter(asset => String(asset.status || '').toUpperCase() === filterStatus);
      }
    }

    filtered.sort((a, b) => {
      let aValue = getAssetValue(a, sortBy);
      let bValue = getAssetValue(b, sortBy);
      const isRemarksColumn = isRemarksHeader(sortBy);

      if (isRemarksColumn) {
        const aRank = getRemarksRank(aValue);
        const bRank = getRemarksRank(bValue);
        if (aRank !== bRank) {
          return sortOrder === 'asc' ? aRank - bRank : bRank - aRank;
        }
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (!isNaN(aValue) && !isNaN(bValue) && aValue !== '' && bValue !== '') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [assets, searchTerm, filterStatus, sortBy, sortOrder]);

  /**
   * Handle column header click to change sort
   */
  const handleSort = (column) => {
    if (sortBy === column) {
      // Toggle sort order if clicking same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Change sort column
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Count statistics
  const accountedCount = assets.filter(
    a => a.status === 'ACCOUNTED'
  ).length;
  const unaccountedCount = assets.filter(
    a => a.status === 'UNACCOUNTED'
  ).length;

const highlightText = (text) => {

  if (!searchTerm) {
    return String(text || '');
  }

  const value = String(text || '');

  const regex = new RegExp(
    `(${searchTerm})`,
    'gi'
  );

  const parts = value.split(regex);

  return parts.map((part, index) => (

    regex.test(part) ? (
      <mark
        key={index}
        className="bg-yellow-200 text-gray-900 px-0.5 rounded"
      >
        {part}
      </mark>
    ) : (
      part
    )

  ));
};

  const handleDownloadQR = () => {

  if (!selectedQRAsset) return;

  const canvas =
    qrRef.current?.querySelector('canvas');

  if (!canvas) return;

  const url = canvas.toDataURL('image/png');

  const link =
    document.createElement('a');

  link.href = url;

  link.download =
    `${selectedQRAsset.asset}.png`;

  link.click();
};
  const reconcilingCount = assets.filter(
    a => a.status === 'RECONCILING'
  ).length;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-50 shadow-md p-3 sm:p-6 h-full">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-3xl font-bold text-blue-600">{assets.length}</div>
          <div className="text-sm text-gray-600">Total Assets</div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-3xl font-bold text-green-600">
            {accountedCount}
          </div>
          <div className="text-sm text-gray-600">Accounted</div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-3xl font-bold text-yellow-600">
            {reconcilingCount}
          </div>
          <div className="text-sm text-gray-600">Reconciling</div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-3xl font-bold text-red-600">
            {unaccountedCount}
          </div>
          <div className="text-sm text-gray-600">Unaccounted</div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="sticky top-[72px] z-30 bg-white flex flex-col md:flex-row gap-4 mb-6 pb-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder={
  searchPlaceholders[
    placeholderIndex
  ]
}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="ALL">All Status / Remarks</option>
          <option value="ACCOUNTED">✅ Accounted</option>
          <option value="UNACCOUNTED">❌ Unaccounted</option>
          <option value="RECONCILING">⏳ Reconciling</option>
          <option value="FOUND">🔎 Found</option>
          <option value="NOT_FOUND">❌ Not Found</option>
        </select>

        {/* Download Button */}
        <button
          onClick={onDownload}
          disabled={isDownloading || assets.length === 0}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {isDownloading ? '⏳ Downloading...' : '📥 Download Excel'}
        </button>

        {/* Clear List Button */}
        {onClearAssets && (
          <button
            onClick={onClearAssets}
            disabled={isClearing || assets.length === 0}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {isClearing ? 'Clearing...' : 'Clear List'}
          </button>
        )}
      </div>

      {/* Assets Table */}
{isLoading ? (

  <div className="overflow-auto w-full max-h-[70vh] rounded-lg border border-gray-200 animate-pulse">

    <table className="min-w-[1000px] w-full text-sm">

      <thead className="bg-gray-100 border-b border-gray-300">
        <tr>

          {[...Array(8)].map((_, index) => (
            <th
              key={index}
              className="px-4 py-4"
            >
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </th>
          ))}

        </tr>
      </thead>

      <tbody>

        {[...Array(8)].map((_, rowIndex) => (
          <tr
            key={rowIndex}
            className="border-b border-gray-200"
          >

            {[...Array(8)].map((_, colIndex) => (
              <td
                key={colIndex}
                className="px-4 py-4"
              >
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </td>
            ))}

          </tr>
        ))}

      </tbody>

    </table>

  </div>

) : filteredAssets.length > 0 ? (
        <div className="overflow-auto w-full max-h-[70vh] rounded-lg border border-gray-200 asset-table-scroll">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="sticky top-0 z-40 bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 w-12 bg-gray-100 sticky top-0 z-40">
                  
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 bg-gray-100 sticky top-0 z-40">
  QR
</th>
                {tableColumns.map((col) => {

  const normalizedKey =
    normalizeHeader(col.key);

  const isCurrentMonthStatus =
    normalizedKey ===
    normalizeHeader(
      `${currentMonth} ${currentYear} STATUS`
    );

  const isCurrentMonthRemarks =
    normalizedKey ===
    normalizeHeader(
      `${currentMonth} ${currentYear} REMARKS`
    );

  return (
    <th
      key={col.key}
      onClick={() => handleSort(col.key)}
      className={`px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 bg-gray-100 sticky top-0 z-40
        ${
          isCurrentMonthRemarks
  ? 'md:sticky md:right-0 z-30 w-[140px] min-w-[140px] max-w-[140px] shadow-[-2px_0_5px_rgba(0,0,0,0.1)]'
            : ''
        }
        ${
          isCurrentMonthStatus
  ? 'sticky right-0 md:right-[140px] bg-gray-100 z-30 shadow-[-2px_0_5px_rgba(0,0,0,0.1)]'
            : ''
        }
      `}
    >
      {col.label}

      {sortBy === col.key && (
        <span className="ml-2">
          {sortOrder === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </th>
  );
})}
              </tr>
            </thead>

            <tbody>
              {filteredAssets.map((asset, index) => {
                const statusValue = asset.status || asset['STATUS'] || asset['Status'] || '';
                return (
                  <tr
                    key={asset.id || asset.asset}
                    className={`border-b border-gray-200 hover:bg-gray-50 ${
                      String(statusValue).toUpperCase() === 'ACCOUNTED'
                        ? 'bg-green-50'
                        : String(statusValue).toUpperCase() === 'RECONCILING'
                        ? 'bg-yellow-50'
                        : 'bg-red-50'
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-600 font-semibold w-12">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-center">

  <button
    onClick={() =>
      setSelectedQRAsset(asset)
    }
    className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-xs font-semibold"
  >
    Generate QR
  </button>

</td>
                    {tableColumns.map(column => {

  const normalizedKey =
    normalizeHeader(column.key);

  const isCurrentMonthStatus =
    normalizedKey ===
    normalizeHeader(
      `${currentMonth} ${currentYear} STATUS`
    );

  const isCurrentMonthRemarks =
    normalizedKey ===
    normalizeHeader(
      `${currentMonth} ${currentYear} REMARKS`
    );

  const cellValue =
    getAssetValue(asset, column.key);

  const isStatusColumn =
    normalizeHeader(column.key) === 'status';

  return (
    <td
      key={`${asset.id || asset.asset}-${column.key}`}
      className={`px-4 py-3 text-gray-600
        ${
          isCurrentMonthRemarks
  ? 'md:sticky md:right-0 bg-inherit z-20 backdrop-blur-0 w-[140px] min-w-[140px] max-w-[140px] shadow-[-2px_0_5px_rgba(0,0,0,0.05)]'
            : ''
        }
        ${
          isCurrentMonthStatus
  ? 'sticky right-0 md:right-[140px] bg-inherit z-20 backdrop-blur-0 shadow-[-2px_0_5px_rgba(0,0,0,0.05)]'
            : ''
        }
      `}
    >
      {isStatusColumn ? (
        <StatusBadge status={cellValue} />
      ) : (
        highlightText(cellValue)
      )}
    </td>
  );
})}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Showing results info */}
          <div className="text-sm text-gray-600 mt-4">
            Showing {filteredAssets.length} of {assets.length} assets
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">
  📭 No matching assets found
</p>

<p className="text-sm">

  {searchTerm
    ? `No assets matched "${searchTerm}"`
    : 'Upload an Excel file to get started'}

</p>
        </div>
      )}
    {selectedQRAsset && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">

    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-fadeIn">

      <button
        onClick={() =>
          setSelectedQRAsset(null)
        }
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
      >
        ×
      </button>

      <div className="text-center">

        <h2 className="text-2xl font-bold text-gray-800">
          Asset QR Code
        </h2>

        <p className="text-gray-500 mt-2">
          Generate and download QR label
        </p>

      </div>

      <div
        ref={qrRef}
        className="mt-8 flex justify-center"
      >
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">

          <QRCodeCanvas
            value={String(
              selectedQRAsset.asset
            )}
            size={220}
            level="H"
            includeMargin
          />

        </div>
      </div>

      <div className="mt-6 text-center">

        <h3 className="text-lg font-bold text-gray-800">
          {selectedQRAsset.asset}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {selectedQRAsset.assetDescription ||
            'No description'}
        </p>

        <p className="text-xs text-gray-400 mt-2">
          Serial #: {
            selectedQRAsset.serialNumber ||
            'N/A'
          }
        </p>

      </div>

      <div className="mt-8 flex gap-3">

        <button
          onClick={handleDownloadQR}
          className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold"
        >
          📥 Download PNG
        </button>

        <button
          onClick={() =>
            window.print()
          }
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 transition font-semibold"
        >
          🖨️ Print
        </button>

      </div>

    </div>

  </div>
)}

</div>
  );
}
