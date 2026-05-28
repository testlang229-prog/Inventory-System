export default function Sidebar({
  activePage,
  setActivePage,
  navigationItems,
}) {
  return (
    //hello
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex fixed top-28 left-6 h-fit w-[220px] flex-col shrink-0 rounded-[36px] border border-white/50 bg-[#FCFBF7]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.06)] p-5 py-6 z-40">

        <div className="flex flex-col gap-2">

          {navigationItems.map(item => {

            const isActive =
              activePage === item.key;

            return (

              <button
                key={item.key}
                onClick={() =>
                  setActivePage(item.key)
                }
                className={`group flex items-center gap-4 rounded-2xl px-4 py-4 transition-all duration-300 text-left ${
                  isActive
                    ? 'parchment-button'
                    : 'hover:bg-white/70 text-slate-600'
                }`}
              >

                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
                    isActive
                      ? 'bg-black/10 border-black/10'
                      : 'bg-white/50 border-white/60'
                  }`}
                >

                  <img
                    src={item.icon}
                    alt={item.label}
                    className={`w-5 h-5 object-contain ${
                      isActive
                        ? 'opacity-100'
                        : 'opacity-70'
                    }`}
                  />

                </div>

                <div>

                  <p className="font-semibold text-sm">
                    {item.label}
                  </p>

                </div>

              </button>

            );

          })}

        </div>

      </aside>
    </>
  );
}