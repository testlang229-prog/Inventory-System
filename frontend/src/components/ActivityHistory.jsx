import {
  useState,
  useEffect,
} from 'react';

import {
  fetchActivityHistory,
getLastUpdated,
} from '../services/api';



export default function ActivityHistory({
  scannedAssets,
  currentUser,
}) {
  const [history, setHistory] =
  useState([]);

const [isLoading, setIsLoading] =
  useState(true);

const [lastKnownUpdate, setLastKnownUpdate] =
  useState(null);

  const [search, setSearch] =
  useState('');

  useEffect(() => {
  loadHistory();

  const checkUpdates = async () => {
    try {
      const latestUpdate =
        await getLastUpdated();

      if (
        latestUpdate &&
        lastKnownUpdate &&
        latestUpdate !== lastKnownUpdate
      ) {
        await loadHistory();
      }

      if (latestUpdate) {
        setLastKnownUpdate(latestUpdate);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const interval = setInterval(
    checkUpdates,
    2000
  );

  return () => clearInterval(interval);
}, [lastKnownUpdate]);

const loadHistory = async () => {
  try {
    setIsLoading(true);

    const data =
      await fetchActivityHistory();

    setHistory(data || []);
  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

  const filteredHistory =
    history.filter(item => {
      const searchValue =
        search.toLowerCase();

      return (
        (currentUser?.employeeId || '')
  .toLowerCase()
  .includes(searchValue) ||

(currentUser?.name || '')
  .toLowerCase()
  .includes(searchValue) ||

        (
  item.asset ||
  item.Asset ||
  ''
)
  .toLowerCase()
  .includes(searchValue)
      );
    });

  return (
    <div className="bg-white rounded-xl shadow-md p-4">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            📋 Activity History
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            User scan records
          </p>
        </div>

        <input
          type="text"
          placeholder="Search user or asset..."
          value={search}
          onChange={e =>
            setSearch(e.target.value)
          }
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {isLoading ? (
        <div className="text-center py-10">
          Loading activity history...
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No activity history yet.
        </div>
      ) : (
<<<<<<< Updated upstream
        <div className="overflow-auto max-h-[600px] border border-gray-200 rounded-lg">

          <table className="min-w-full border border-gray-200">

            <thead className="bg-gray-100 sticky top-0 z-20">

              <tr>

                <th className="border px-4 py-5 text-left bg-gray-100">
                  Employee ID
                </th>

                <th className="border px-4 py-5 text-left bg-gray-100">
                  User Name
                </th>

                <th className="border px-4 py-5 text-left bg-gray-100">
                  Asset
                </th>

                <th className="border px-4 py-5 text-left bg-gray-100">
                  Asset Description
                </th>

                <th className="border px-4 py-5 text-left bg-gray-100">
                  Serial Number
                </th>

                <th className="border px-4 py-5 text-left bg-gray-100">
                  Date
                </th>

                <th className="border px-4 py-5 text-left bg-gray-100">
                  Time
                </th>

                <th className="border px-4 py-5 text-left bg-gray-100">
=======
        <div className="overflow-auto max-h-[600px] rounded-lg border border-gray-200">

          <table className="min-w-full border border-gray-200">

            <thead className="sticky top-0 z-20 bg-gray-100">

              <tr>

                <th className="border px-4 py-4 text-left bg-gray-100">
                  Employee ID
                </th>

                <th className="border px-4 py-4 text-left bg-gray-100">
                  User Name
                </th>

                <th className="border px-4 py-4 text-left bg-gray-100">
                  Asset
                </th>

                <th className="border px-4 py-4 text-left bg-gray-100">
                  Asset Description
                </th>

                <th className="border px-4 py-4 text-left bg-gray-100">
                  Serial Number
                </th>

                <th className="border px-4 py-4 text-left bg-gray-100">
                  Date
                </th>

                <th className="border px-4 py-4 text-left bg-gray-100">
                  Time
                </th>

                <th className="border px-4 py-4 text-left bg-gray-100">
>>>>>>> Stashed changes
  Scan Method
</th>   

              </tr>

            </thead>

            <tbody>

              {filteredHistory.map(item => {
                const scanDate =
                  new Date(item.scannedAt);

                return (
                  <tr
                    key={`${item.Asset || item.asset}-${item.scannedAt}`}
                    className="hover:bg-gray-50"
                  >

                    <td className="border px-4 py-2">
                      {item.employeeId || '-'}
                    </td>

                    <td className="border px-4 py-2">
                      {item.userName || '-'}
                    </td>

                    <td className="border px-4 py-2">
                      {item.asset || item.Asset || '-'}
                    </td>

                    <td className="border px-4 py-2">
                      {
  item.assetDescription ||
  item['Asset Description'] ||
  '-'
}
                    </td>

                    <td className="border px-4 py-2">
                      {
  item.serialNumber ||
  item['Serial number'] ||
  '-'
}
                    </td>

                    <td className="border px-4 py-2">
                      {scanDate.toLocaleDateString()}
                    </td>

                    <td className="border px-4 py-2">
                      {scanDate.toLocaleTimeString()}
                    </td>

                    <td className="border px-4 py-2">
  <span
    className={
      item.scanMethod === 'MANUAL'
        ? 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold'
        : 'bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold'
    }
  >
    {item.scanMethod || 'QR'}
  </span>
</td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}