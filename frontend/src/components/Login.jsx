// frontend/src/components/Login.jsx
import { useState } from 'react';
import employeeIcon from '../assets/icons/employee-icon.png';
import adminIcon from '../assets/icons/admin-icon.png';
import companyPlaceholder from '../assets/auth/company-placeholder.jpg';
import companyLogo from '../assets/auth/company-logo.png';
import scanIcon from '../assets/icons/scan-icon.png';
import trackIcon from '../assets/icons/track-icon.png';
import securityIcon from '../assets/icons/security-icon.png';



export default function Login({ onLogin, onShowAdmin }) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center px-4 py-8">

  <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-10 items-center">
    <div className="hidden lg:flex relative overflow-hidden rounded-[2.5rem] min-h-[780px] p-14 flex-col justify-between">
      <img
  src={companyPlaceholder}
  alt="Company"
  className="absolute inset-0 w-full h-full object-cover"
/>

<div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/70 to-indigo-950/70" />

  <div className="relative z-10 max-w-xl">

    <div className="mb-8">

  <img
    src={companyLogo}
    alt="Company Logo"
    className="w-24 h-24 object-contain"
  />

</div>

    <h1 className="text-6xl font-bold text-white leading-[1.05] tracking-tight">
      Asset Inventory
      <br />
      System
    </h1>

    <p className="mt-6 text-xl text-slate-200 leading-relaxed max-w-lg">
  Secure inventory monitoring and asset tracking
  for modern enterprise operations.
</p>

    <div className="grid grid-cols-3 gap-4 mt-10">

      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/15">
        <img
  src={scanIcon}
  alt="Scan"
  className="w-10 h-10 object-contain mb-4"
/>

        <h3 className="font-bold text-white">
          Scan
        </h3>

        <p className="text-sm text-slate-300 mt-1">
          Fast QR and barcode scanning
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/15">
        <img
  src={trackIcon}
  alt="Track"
  className="w-10 h-10 object-contain mb-4"
/>

        <h3 className="font-bold text-white">
          Track
        </h3>

        <p className="text-sm text-slate-300 mt-1">
          Monitor assets in real-time
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/15">
        <img
  src={securityIcon}
  alt="Security"
  className="w-10 h-10 object-contain mb-4"
/>

        <h3 className="font-bold text-white">
          Secure
        </h3>

        <p className="text-sm text-slate-300 mt-1">
          Protected employee access
        </p>
      </div>

    </div>

  </div>

</div>
<div className="lg:hidden w-full max-w-md mx-auto mb-[-60px] z-10 relative px-2">

  <div className="overflow-hidden rounded-[2.5rem] shadow-2xl">

    <img
      src={companyPlaceholder}
      alt="Company"
      className="w-full h-40 object-cover"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

  </div>

</div>
      <div className="login-glow relative z-20 max-w-md w-full mx-auto bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/40 px-7 py-6 md:p-10 lg:mt-0 -mt-8">
      <div className="text-center mb-8">

  <div className="flex justify-center mb-5">

    <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center shadow-sm">

      <img
        src={employeeIcon}
        alt="Employee"
        className="w-10 h-10 object-contain"
      />

    </div>

  </div>

  <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight tracking-tight">
    Asset Inventory
    <br />
    System
  </h1>

  <p className="mt-5 text-slate-500 font-semibold tracking-[0.18em] uppercase text-xs">
    Enterprise Asset Platform
  </p>

  <p className="text-sm text-slate-500 mt-3">
    Secure inventory monitoring platform
  </p>

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
    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition duration-200 font-semibold shadow-lg shadow-blue-200"
          >
            Login
          </button>
        </form>

        <button
          type="button"
          onClick={onShowAdmin}
          className="mt-5 w-full border border-slate-200 text-gray-700 py-3 rounded-xl hover:bg-gray-100 transition duration-200 font-medium"
        >
          Administrator Access
        </button>
      </div>
        </div>

  </div>

  );
}