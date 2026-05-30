export default function CustomModal({
  isOpen,
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false,
  onConfirm,
  onCancel,
}) {

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md px-4">

      <div
        className="
  w-full
  max-w-lg
  rounded-[2rem]
  border
  border-white/20
  bg-white/75
  backdrop-blur-xl
  shadow-[0_25px_80px_rgba(15,23,42,0.28)]
  px-10
  py-10
  animate-fadeIn
"
      >

        <h2 className="text-[2rem] font-black text-slate-800">
          {title}
        </h2>

        <p className="mt-6 text-[1.15rem] leading-relaxed text-slate-700">
          {message}
        </p>

        <div className="flex justify-center gap-4 mt-10">

  {showCancel && (
    <button
      onClick={onCancel}
      className="
        w-full
        max-w-[180px]
        h-14
        rounded-2xl
        border
        border-slate-300
        bg-white/70
        text-slate-700
        text-lg
        font-semibold
        hover:bg-white
        transition-all
        duration-300
      "
    >
      {cancelText}
    </button>
  )}

  <button
    onClick={onConfirm}
    className="
      w-full
      max-w-[220px]
      h-14
      rounded-2xl
      bg-[#0F172A]
      text-white
      text-lg
      font-semibold
      hover:bg-[#1E293B]
      hover:scale-[1.02]
      transition-all
      duration-300
      shadow-lg
    "
  >
    {confirmText}
  </button>

</div>

      </div>

    </div>
  );
}