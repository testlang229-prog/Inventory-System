// frontend/src/components/Login.jsx
import { useState } from 'react';
import employeeIcon from '../assets/icons/employee-icon.png';
import adminIcon from '../assets/icons/admin-icon.png';
import companyPlaceholder from '../assets/auth/company-placeholder.jpg';
import companyLogo from '../assets/auth/company-logo.png';
import eagleLogo from '../assets/logo.jpg';
import scanIcon from '../assets/icons/scan-icon.png';
import trackIcon from '../assets/icons/track-icon.png';
import activityIcon from '../assets/icons/activity-icon.png';
import securityIcon from '../assets/icons/security-icon.png';



export default function Login({
  onLogin,
  onShowAdmin,
  activeTab,
}) {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  

  const validateInput = () => {
    if (!employeeId.trim() || !password.trim()) {
      return 'Please enter your Employee ID and password';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const error = validateInput();
    if (error) {
      setError(error);
      return;
    }

    setError('');

    onLogin({
      employeeId: employeeId.trim(),
      password,
    });
  };

  return (
    <div
  className={`relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-4 transition-all duration-500 ${
    
    activeTab === 'admin'
      ? 'bg-[#020617]'
      : 'bg-[#F6F3EA]'
  }`}
>
  {/* FULLSCREEN BACKGROUND EFFECT */}
<div
  className="absolute inset-0 pointer-events-none"
  style={{
    background:
      activeTab === 'admin'
        ? `
          radial-gradient(circle at top left, rgba(212,160,23,0.15), transparent 35%),
          radial-gradient(circle at bottom right, rgba(245,158,11,0.10), transparent 30%)
        `
        : `
          radial-gradient(circle at top left, rgba(212,160,23,0.22), transparent 38%),
          radial-gradient(circle at bottom right, rgba(245,158,11,0.10), transparent 32%)
        `
  }}
/>

  <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-10 items-center">
    <div className="hidden lg:flex flex-col justify-center pl-8 relative h-[650px]">
      



<img
  src={eagleLogo}
  alt="Golden Eagles"
  className="absolute right-[-120px] top-1/2 -translate-y-1/2 w-[760px] opacity-[0.08] rotate-[-10deg] object-contain"
/>
  <div className="relative z-10 max-w-xl">

    <div className="mb-8">

  <div
    className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500 ${
      activeTab === 'admin'
        ? 'bg-white/10 border border-white/10'
        : 'bg-[#FAEFD9] border border-[#D4A017]/10'
    }`}
  >
    <img
      src={activeTab === 'admin' ? adminIcon : employeeIcon}
      alt="Mode Icon"
      className="w-10 h-10 object-contain"
    />
  </div>

</div>

    <h1
  className={`text-4xl font-bold leading-[1.05] tracking-tight drop-shadow-xl transition-all duration-500 ${
    activeTab === 'admin'
      ? 'text-white'
      : 'text-slate-900'
  }`}
>
      Asset Inventory
      <br />
      System
    </h1>

    <p
  className={`mt-5 text-lg leading-relaxed max-w-md transition-all duration-500 ${
    activeTab === 'admin'
      ? 'text-slate-200'
      : 'text-slate-600'
  }`}
>
  Secure inventory monitoring and asset tracking
  for modern enterprise operations.
</p>

    <div className="grid grid-cols-2 gap-4 mt-8 max-w-lg">

  <div className={`group rounded-[1.6rem] p-5 shadow-[0_8px_32px_rgba(15,23,42,0.12)] backdrop-blur-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(15,23,42,0.18)] relative overflow-hidden ${
  activeTab === 'admin'
    ? 'bg-white/[0.08] border border-white/10'
: 'bg-white/35 border border-white/40'
}`}>
{/* GLASS SHINE */}
<div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
    <div className="w-12 h-12 rounded-xl bg-[#D4A017]/20 flex items-center justify-center mb-4">
      <img
        src={scanIcon}
        alt="Scan"
        className="w-7 h-7 object-contain"
      />
    </div>

    <h3 className={`font-semibold text-base transition-all duration-500 ${
  activeTab === 'admin'
    ? 'text-white'
    : 'text-slate-800'
}`}>
      Scan Assets
    </h3>

    <p className={`text-xs mt-2 leading-relaxed transition-all duration-500 ${
  activeTab === 'admin'
    ? 'text-slate-300'
    : 'text-slate-600'
}`}>
      Fast QR and barcode scanning
    </p>

  </div>

  <div className={`group rounded-[1.6rem] p-5 shadow-[0_8px_32px_rgba(15,23,42,0.12)] backdrop-blur-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(15,23,42,0.18)] relative overflow-hidden ${
  activeTab === 'admin'
    ? 'bg-white/[0.08] border border-white/10'
: 'bg-white/35 border border-white/40'
}`}>
{/* GLASS SHINE */}
<div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
  <div className="w-12 h-12 rounded-xl bg-[#D4A017]/20 flex items-center justify-center mb-4">
    <img
      src={trackIcon}
      alt="Track"
      className="w-7 h-7 object-contain"
    />
  </div>

  <h3
    className={`font-semibold text-base transition-all duration-500 ${
      activeTab === 'admin'
        ? 'text-white'
        : 'text-slate-800'
    }`}
  >
    Track Assets
  </h3>

  <p
    className={`text-xs mt-2 leading-relaxed transition-all duration-500 ${
      activeTab === 'admin'
        ? 'text-slate-300'
        : 'text-slate-600'
    }`}
  >
    Real-time location and status
  </p>

</div>

  <div className={`group rounded-[1.6rem] p-5 shadow-[0_8px_32px_rgba(15,23,42,0.12)] backdrop-blur-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(15,23,42,0.18)] relative overflow-hidden ${
  activeTab === 'admin'
    ? 'bg-white/[0.08] border border-white/10'
: 'bg-white/35 border border-white/40'
}`}>
{/* GLASS SHINE */}
<div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
    <div className="w-12 h-12 rounded-xl bg-[#D4A017]/20 flex items-center justify-center mb-4">
      <img
        src={securityIcon}
        alt="Secure"
        className="w-7 h-7 object-contain"
      />
    </div>

    <h3 className={`font-semibold text-base transition-all duration-500 ${
  activeTab === 'admin'
    ? 'text-white'
    : 'text-slate-800'
}`}>
      Secure Access
    </h3>

    <p className={`text-xs mt-2 leading-relaxed transition-all duration-500 ${
  activeTab === 'admin'
    ? 'text-slate-300'
    : 'text-slate-600'
}`}>
      Role-based access and data security
    </p>

  </div>

  <div className={`group rounded-[1.6rem] p-5 shadow-[0_8px_32px_rgba(15,23,42,0.12)] backdrop-blur-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(15,23,42,0.18)] relative overflow-hidden ${
  activeTab === 'admin'
    ? 'bg-white/[0.08] border border-white/10'
: 'bg-white/35 border border-white/40'
}`}>
{/* GLASS SHINE */}
<div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
    <div className="w-12 h-12 rounded-xl bg-[#D4A017]/20 flex items-center justify-center mb-4">
      <img
        src={activityIcon}
        alt="Reports"
        className="w-7 h-7 object-contain"
      />
    </div>

    <h3 className={`font-semibold text-base transition-all duration-500 ${
  activeTab === 'admin'
    ? 'text-white'
    : 'text-slate-800'
}`}>
      Reports & Insights
    </h3>

    <p className={`text-xs mt-2 leading-relaxed transition-all duration-500 ${
  activeTab === 'admin'
    ? 'text-slate-300'
    : 'text-slate-600'
}`}>
      Powerful reports and analytics
    </p>

  </div>

</div>

  </div>

</div>
<div className="lg:hidden relative w-full max-w-md mx-auto mb-[-55px] z-10 px-2">

  <div className="relative overflow-hidden rounded-[2.8rem] bg-[#0F172A] h-72 gold-soft-glow">

    <div
      className="absolute inset-0 opacity-20"
      style={{
        background:
          'radial-gradient(circle at top left, rgba(212,160,23,0.45), transparent 45%)'
      }}
    />

    <img
  src={eagleLogo}
  alt="Golden Eagles"
  className="absolute right-[-120px] top-1/2 -translate-y-1/2 w-[760px] opacity-[0.08] rotate-[-10deg] object-contain"
/>

    <div className="relative z-10 p-8">

      <img
        src={companyLogo}
        alt="Company Logo"
        className="w-16 h-16 object-contain"
      />

      <h2 className="mt-6 text-3xl font-bold text-white leading-tight">
        Asset Inventory
        <br />
        System
      </h2>

      <p className="mt-3 text-sm text-slate-300">
        Enterprise inventory platform
      </p>

    </div>

  </div>

</div>
      <div
  className={`enterprise-glow relative z-20 max-w-md w-full mx-auto backdrop-blur-2xl rounded-[2.5rem] px-7 py-6 md:p-8 lg:mt-0 -mt-8 transition-all duration-500 ${
    activeTab === 'admin'
      ? 'bg-[#0F172A]/95 border border-white/10'
      : 'pearl-surface border border-white/40'
  }`}
>
      <div className="text-center mb-8">

  <div className="flex justify-center mb-6">

    <div className="w-20 h-20 rounded-[2rem] bg-slate-100 flex items-center justify-center shadow-sm border border-slate-100">

      <img
        src={employeeIcon}
        alt="Employee"
        className="w-10 h-10 object-contain"
      />

    </div>

  </div>

  <h1
  className={`text-4xl md:text-5xl font-extrabold leading-tight tracking-tight transition-all duration-500 ${
    activeTab === 'admin'
      ? 'text-white'
      : 'text-slate-800'
  }`}
>
    Welcome Back
  </h1>

  <p
  className={`mt-3 transition-all duration-500 ${
    activeTab === 'admin'
      ? 'text-slate-400'
      : 'text-slate-500'
  }`}
>
    Sign in to your account
  </p>

<div
  className={`relative mt-7 flex rounded-2xl p-1 overflow-hidden transition-all duration-500 ${
    activeTab === 'admin'
      ? 'bg-white/5 border border-white/10'
      : 'bg-[#F8F5EE] border border-[#E8E2D3]'
  }`}
>

  {/* SLIDING ACTIVE PILL */}
  <div
    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl transition-all duration-300 ease-in-out shadow-md ${
      activeTab === 'user'
        ? 'left-1 bg-[#FAEFD9]'
        : 'left-[calc(50%+2px)] bg-[#0F172A]'
    }`}
  />

  {/* USER BUTTON */}
  <button
    type="button"
    onClick={() => {}}
    className={`relative z-10 flex-1 py-3 text-sm font-semibold transition-all duration-300 ${
      activeTab === 'user'
        ? 'text-[#B8860B]'
        : 'text-slate-500'
    }`}
  >
    User Login
  </button>

  {/* ADMIN BUTTON */}
  <button
    type="button"
    onClick={onShowAdmin}
    className={`relative z-10 flex-1 py-3 text-sm font-semibold transition-all duration-300 ${
      activeTab === 'admin'
        ? 'text-white'
        : 'text-slate-500'
    }`}
  >
    Administrator Access
  </button>

</div>

</div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
              Employee ID
            </label>
            <div className="relative">

  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
    <img
  src={employeeIcon}
  alt="User"
  className="w-5 h-5 opacity-50"
/>
  </span>

  <input
    type="text"
    id="employeeId"
    value={employeeId}
    onChange={(e) => setEmployeeId(e.target.value)}
    className={`w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-500 focus:outline-none ${
  activeTab === 'admin'
    ? 'bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#D4A017]'
    : 'border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500'
}`}
    placeholder="Enter your Employee ID"
    required
  />

</div>
          </div>

<div className="mb-6">
  <label
    htmlFor="password"
    className="block text-sm font-medium text-gray-700 mb-2"
  >
    Password
  </label>

  <div className="relative">

  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
    <img
  src={adminIcon}
  alt="Lock"
  className="w-5 h-5 opacity-50"
/>
  </span>

  <input
    type="password"
    id="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className={`w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-500 focus:outline-none ${
  activeTab === 'admin'
    ? 'bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#D4A017]'
    : 'border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500'
}`}
    placeholder="Enter your password"
    required
  />

</div>
</div>

{error && (
  <p className="text-red-500 text-sm mb-4">{error}</p>
)}

          <button
  type="submit"
            className={`w-full py-3.5 px-4 rounded-xl active:scale-[0.98] transition-all duration-500 font-semibold shadow-xl ${
  activeTab === 'admin'
    ? 'bg-[#D4A017] text-[#0F172A] hover:brightness-110'
    : 'gold-gradient text-white hover:brightness-110'
}`}
          >
            Login
          </button>
        </form>
      </div>
        </div>

  </div>

  );
}