// frontend/src/components/StatusBadge.jsx
// Component to display colored status badges

export default function StatusBadge({ status }) {
  // Define colors based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCOUNTED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'RECONCILING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'UNACCOUNTED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
}
