import { useState } from 'react';
import adminIcon from '../assets/icons/admin-icon.png';
import usersIcon from '../assets/icons/users-icon.png';
import activityIcon from '../assets/icons/activity-icon.png';
import securityIcon from '../assets/icons/security-icon.png';
import employeeIcon from '../assets/icons/employee-icon.png';

export default function AdminLogin({ onLogin, onBack }) {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateInput = () => {
    if (!employeeId.trim() || !password.trim()) {
      return 'Please enter Employee ID and password';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateInput();
    if (error) {
      setError(error);
      return;
    }

    setError('');

    await onLogin({
      employeeId: employeeId.trim(),
      password,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center px-4 py-8">

  <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-10 items-center">
    <div className="hidden lg:flex flex-col justify-center">

  <div className="max-w-xl">

    <div className="text-6xl mb-6">
      🔐
    </div>

    <h1 className="text-5xl font-extrabold text-white leading-tight">
      Admin Control
      <br />
      Center
    </h1>

    <p className="mt-5 text-lg text-indigo-200 leading-relaxed">
      Secure. Control. Monitor.
      <br />
      Manage the inventory system confidently.
    </p>

    <div className="grid grid-cols-3 gap-4 mt-10">

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 transition-all duration-300 hover:-translate-y-3 hover:scale-[1.03] hover:bg-white/15 hover:shadow-2xl cursor-pointer">
        <img
  src={usersIcon}
  alt="Users"
  className="w-10 h-10 object-contain mb-4"
/>

        <h3 className="font-bold text-white">
          Users
        </h3>

        <p className="text-sm text-indigo-200 mt-1">
          Manage employee access
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 transition-all duration-300 hover:-translate-y-3 hover:scale-[1.03] hover:bg-white/15 hover:shadow-2xl cursor-pointer">
        <img
  src={activityIcon}
  alt="Reports"
  className="w-10 h-10 object-contain mb-4"
/>

        <h3 className="font-bold text-white">
          Reports
        </h3>

        <p className="text-sm text-indigo-200 mt-1">
          Monitor inventory activity
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 transition-all duration-300 hover:-translate-y-3 hover:scale-[1.03] hover:bg-white/15 hover:shadow-2xl cursor-pointer">
        <img
  src={securityIcon}
  alt="Security"
  className="w-10 h-10 object-contain mb-4"
/>

        <h3 className="font-bold text-white">
          Security
        </h3>

        <p className="text-sm text-indigo-200 mt-1">
          Restricted admin control
        </p>
      </div>

    </div>

  </div>

</div>
      <div className="login-glow max-w-md w-full mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 px-7 py-6 md:p-10">

        <div className="text-center mb-8">

  <div className="flex justify-center mb-5">

    <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center shadow-sm">

      <img
        src={adminIcon}
        alt="Admin"
        className="w-10 h-10 object-contain"
      />

    </div>

  </div>

  <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight tracking-tight">
    Admin Login
  </h1>

  <p className="mt-5 text-slate-500 font-semibold tracking-[0.18em] uppercase text-xs">
    Enterprise Control Center
  </p>

  <p className="text-sm text-slate-500 mt-3">
    Secure administrator control panel
  </p>

</div>

        <form onSubmit={handleSubmit}>

          <div className="mb-6">
            <label
              htmlFor="employeeId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Employee ID
            </label>

            <div className="relative">

  <img
  src={employeeIcon}
  alt="Employee"
  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 object-contain opacity-70"
/>

  <input
    type="text"
    id="employeeId"
    value={employeeId}
    onChange={(e) => setEmployeeId(e.target.value)}
    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
    placeholder="Enter admin employee ID"
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

  <img
  src={securityIcon}
  alt="Password"
  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 object-contain opacity-70"
/>

  <input
    type="password"
    id="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
    placeholder="Enter password"
    required
  />

</div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition duration-200 font-semibold shadow-lg shadow-indigo-300/40"
          >
            Continue
          </button>
        </form>

        <button
          type="button"
          onClick={onBack}
          className="mt-6 w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition duration-200"
        >
          Employee Login
        </button>

      </div>
        </div>

  </div>

  );
}