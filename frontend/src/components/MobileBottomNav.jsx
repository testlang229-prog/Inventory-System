import homeIcon from "../assets/icons/home.svg";
import uploadIcon from "../assets/icons/upload.svg";
import scanIcon from "../assets/icons/scan.svg";
import activityIcon from "../assets/icons/activity.svg";
import usersIcon from "../assets/icons/users.svg";

export default function MobileBottomNav({
  activePage,
  setActivePage,
}) {

  const navItems = [
  {
    label: "Home",
    page: "dashboard",
    icon: homeIcon,
  },
  {
    label: "Upload",
    page: "upload",
    icon: uploadIcon,
  },
  {
    label: "Scan",
    page: "scan",
    icon: scanIcon,
  },
  {
    label: "Activity",
    page: "activityHistory",
    icon: activityIcon,
  },
  {
    label: "Users",
    page: "users",
    icon: usersIcon,
  },
];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">

      <div className="mx-5 mb-5 rounded-[36px] border border-white/60 bg-white/70 backdrop-blur-3xl shadow-[0_12px_40px_rgba(15,23,42,0.08)]">

        <div className="grid grid-cols-5 p-2">

          {navItems.map((item) => {

            const isActive =
              activePage === item.page;

            return (
              <button
  key={item.page}
  onClick={() =>
    setActivePage(item.page)
  }
  className={`relative flex flex-col items-center justify-center py-3 transition-all duration-300 ${
    isActive
      ? "scale-105"
      : "scale-100"
  }`}
>

  {isActive && (
    <div className="absolute inset-0 rounded-[24px] bg-[#FAEFD9]/90 border border-white/70 shadow-[0_10px_30px_rgba(250,239,217,0.55)]" />
  )}

  <div className="relative z-10 flex flex-col items-center">

    <img
      src={item.icon}
      alt={item.label}
      className={`w-[22px] h-[22px] object-contain transition-all duration-300 ${
        isActive
          ? "opacity-100 scale-110"
: "opacity-45"
      }`}
    />

    <span
      className={`mt-1 text-[11px] font-semibold transition-all duration-300 ${
        isActive
          ? "text-slate-900"
: "text-slate-500"
      }`}
    >
      {item.label}
    </span>

  </div>

</button>
            );
          })}

        </div>

      </div>

    </div>
  );
}