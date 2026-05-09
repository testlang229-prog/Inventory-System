// frontend/src/components/AssetTable.jsx
// Component to display assets in a table with sorting and filtering

import { useState, useMemo } from 'react';
import StatusBadge from './StatusBadge';

export default function AssetTable({
  assets,
  headers = [],
  onDownload,
  isDownloading,
  onClearAssets,
  isClearing,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('asset');
  const [sortOrder, setSortOrder] = useState('asc');

  const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const currentMonth = monthNames[new Date().getMonth()];
  const displayMonth = `${currentMonth[0]}${currentMonth.slice(1).toLowerCase()}`;

  const defaultColumns = [
    { key: 'asset', label: 'Asset #' },
    { key: 'assetDescription', label: 'Description' },
    { key: 'serialNumber', label: 'Serial #' },
    { key: 'costCenter', label: 'Cost Center' },
    { key: 'correctRoom', label: 'Room' },
    { key: 'status', label: 'Status' },
    { key: `${currentMonth} STATUS`, label: `${currentMonth} STATUS` },
    { key: 'remarks', label: `${displayMonth} Remarks` },
  ];

  const normalizeLabel = (label) =>
    String(label || '')
      .toLowerCase()
      .replace(/\([^)]*\)/g, '')
      .replace(/[^a-z0-9 ]+/g, ' ')
      .trim();

  const isInternalField = (label) =>
    normalizeLabel(label).replace(/\s+/g, '') === 'scanningmonth';

  const isCurrentMonthYearHeader = (label) => {
    const normalized = normalizeLabel(label);
    const currentMonthHeader = `${currentMonth.toLowerCase()} ${new Date().getFullYear()}`;
    return normalized === currentMonthHeader || normalized === currentMonthHeader.replace(/ /g, '');
  };

  const isRemarksHeader = (label) => {
    const normalized = normalizeLabel(label);
    return (
      normalized === 'remarks' ||
      normalized.endsWith(' remarks') ||
      isCurrentMonthYearHeader(label)
    );
  };

  const getDisplayLabel = (header) => {
    if (isRemarksHeader(header)) {
      return `${displayMonth} Remarks`;
    }

    return normalizeLabel(header) === 'no change with change'
      ? String(header).replace(/\s*\(\d+\)\s*$/, '')
      : header;
  };

  const currentMonthHeaderNormalized = `${currentMonth.toLowerCase()} ${new Date().getFullYear()}`;
  const hasCurrentMonthRemarks = headers.some(header => {
    const normalized = normalizeLabel(header);
    return normalized === currentMonthHeaderNormalized || normalized === currentMonthHeaderNormalized.replace(/ /g, '');
  });

  const currentMonthDisplayRemarks = `${displayMonth} Remarks`;
  const isCurrentMonthDisplayRemarksHeader = (label) =>
    normalizeLabel(label) === normalizeLabel(currentMonthDisplayRemarks);

  const tableColumns = headers && headers.length > 0
    ? headers
        .filter(header => !isInternalField(header))
        .filter(header => {
          if (!hasCurrentMonthRemarks) return true;
          const normalized = normalizeLabel(header);
          return (
            normalized !== 'remarks' &&
            !isCurrentMonthDisplayRemarksHeader(header)
          );
        })
        .map(header => ({ key: header, label: getDisplayLabel(header) }))
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

  const getAssetValue = (asset, fieldName) => {
    if (!asset || typeof asset !== 'object') return '';
    
    // Try direct key match first
    if (asset.hasOwnProperty(fieldName)) {
      return asset[fieldName];
    }

    // Try normalized match
    const normalizedField = normalizeHeader(fieldName);
    const matchingKey = Object.keys(asset).find(
      key => normalizeHeader(key) === normalizedField
    );

    if (matchingKey) {
      return asset[matchingKey];
    }

    return '';
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
          const remark = String(asset.remarks || asset.REMARKS || asset.Remarks || asset.comments || asset.note || '').toLowerCase().trim();
          return filterStatus === 'FOUND'
            ? remark === 'found'
            : remark === 'not found' || remark === 'notfound';
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
  const reconcilingCount = assets.filter(
    a => a.status === 'RECONCILING'
  ).length;

  return (
    <div className="bg-white rounded-lg max-h-screen overflow-y-auto shadow-lg border border-gray-50 shadow-md p-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search Input */}
        <input
          type="text"
          placeholder="🔍 Search by Asset, Description, or Serial..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <button
          onClick={onClearAssets}
          disabled={isClearing || assets.length === 0}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {isClearing ? 'Clearing...' : 'Clear List'}
        </button>
      </div>

      {/* Assets Table */}
      {filteredAssets.length > 0 ? (
        <div className="overflow-x-auto ">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                {tableColumns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
                  >
                    {col.label}
                    {sortBy === col.key && (
                      <span className="ml-2">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredAssets.map((asset) => {
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
                    {tableColumns.map(column => {
                      const cellValue = getAssetValue(asset, column.key);
                      const isStatusColumn = normalizeHeader(column.key) === 'status';

                      return (
                        <td
                          key={`${asset.id || asset.asset}-${column.key}`}
                          className="px-4 py-3 text-gray-600"
                        >
                          {isStatusColumn ? (
                            <StatusBadge status={cellValue} />
                          ) : (
                            String(cellValue || '')
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
          <p className="text-lg">📭 No assets found</p>
          <p className="text-sm">Upload an Excel file to get started</p>
        </div>
      )}
    </div>
  );
}
