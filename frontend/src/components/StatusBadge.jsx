// frontend/src/components/StatusBadge.jsx
// Component to display colored status badges

export default function StatusBadge({ status }) {
  // Define colors based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCOUNTED':
        return 'bg-emerald-50/80 text-emerald-700 border-white/60 backdrop-blur-xl';
      case 'RECONCILING':
        return 'bg-amber-50/80 text-amber-700 border-white/60 backdrop-blur-xl';
      case 'UNACCOUNTED':
        return 'bg-rose-50/80 text-rose-700 border-white/60 backdrop-blur-xl';
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
