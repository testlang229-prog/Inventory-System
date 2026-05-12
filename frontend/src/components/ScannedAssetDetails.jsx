// frontend/src/components/ScannedAssetDetails.jsx
// Shows recently scanned asset details as compact label/value lists

const detailFields = [
  {
    label: 'Asset',
    candidates: ['Asset', 'asset'],
  },
  {
    label: 'Subnumber',
    candidates: ['Subnumber', 'subnumber'],
  },
  {
    label: 'Asset Description',
    candidates: ['Asset Description', 'assetDescription', 'Description'],
  },
  {
    label: 'Cost Center',
    candidates: ['Cost Center', 'costCenter'],
  },
  {
    label: 'Serial Number',
    candidates: ['Serial number', 'Serial Number', 'serialNumber'],
  },
  {
    label: 'Resp. Cost Center',
    candidates: ['Resp. cost center', 'Resp. Cost Center', 'respCostCenter'],
  },
  {
    label: 'Personnel Number',
    candidates: ['Personnel Number', 'personalNumber'],
  },
  {
    label: 'Assignee',
    candidates: ['Assignee', 'assignee'],
  },
  {
    label: 'Plant',
    candidates: ['Plant', 'plant'],
  },
  {
    label: 'Room',
    candidates: ['Room', 'room'],
  },
  {
    label: 'Correct Room',
    candidates: ['CORRECT ROOM', 'Correct Room', 'correctRoom'],
  },
  {
    label: 'STATUS (ACCOUNTED / UNACCOUNTED / RECONCILING)',
    candidates: [
      'STATUS (ACCOUNTED / UNACCOUNTED / RECONCILING)',
      'STATUS',
      'Status',
      'status',
    ],
  },
];

function normalizeHeader(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function normalizeCompact(value) {
  return normalizeHeader(value).replace(/\s+/g, '');
}

function getAssetValue(asset, candidates) {
  for (const candidate of candidates) {
    if (asset[candidate] !== undefined) {
      return asset[candidate];
    }
  }

  const matchingKey = Object.keys(asset).find(key =>
    candidates.some(candidate =>
      normalizeHeader(key) === normalizeHeader(candidate) ||
      normalizeCompact(key) === normalizeCompact(candidate)
    )
  );

  return matchingKey ? asset[matchingKey] : '';
}

export default function ScannedAssetDetails({ scannedAssets }) {
  return (
    <section className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 className="text-base font-bold leading-tight text-gray-900">
          Scanned Asset Details
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Recently scanned assets
        </p>
      </div>

      {scannedAssets.length === 0 ? (
        <div className="m-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-6 text-center text-xs text-gray-500">
          No scanned assets yet.
        </div>
      ) : (
        <div
          className="space-y-3 overscroll-contain px-4 py-3"
          style={{
            height: '260px',
            maxHeight: '260px',
            overflowY: 'auto',
            scrollbarGutter: 'stable',
          }}
          tabIndex={0}
        >
          {scannedAssets.map(asset => (
            <div
              key={`${asset.id || asset.asset || asset.Asset}-${asset.scannedAt || ''}`}
              className="rounded-lg border border-green-200 bg-green-50 p-3"
            >
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {detailFields.map(field => {
                  const value = getAssetValue(asset, field.candidates);

                  return (
                    <div
                      key={field.label}
                      className="min-h-[52px] min-w-0 rounded-md border border-green-100 bg-white px-3 py-2"
                    >
                      <div className="truncate text-[11px] font-bold uppercase tracking-wide text-gray-600">
                        {field.label}
                      </div>
                      <div
                        className="mt-1 truncate text-sm font-semibold text-gray-900"
                        title={String(value || '')}
                      >
                        {String(value || '-')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
