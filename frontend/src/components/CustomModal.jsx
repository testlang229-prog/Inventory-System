export default function CustomModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) {

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">

      <div className="w-full max-w-xl rounded-[2rem] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] px-8 py-9 animate-fadeIn">

        <h2 className="text-[2rem] font-bold text-slate-800">
          {title}
        </h2>

        <p className="mt-6 text-[1.1rem] leading-relaxed text-slate-500">
          {message}
        </p>

        <div className="flex justify-end gap-4 mt-10">

          <button
            onClick={onCancel}
            className="px-8 h-14 rounded-2xl border border-slate-200 bg-white text-slate-700 text-lg font-medium hover:bg-slate-50 transition-all duration-300"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="px-8 h-14 rounded-2xl bg-red-500 text-white text-lg font-semibold hover:bg-red-600 transition-all duration-300 shadow-lg"
          >
            {confirmText}
          </button>

        </div>

      </div>

    </div>
  );
}