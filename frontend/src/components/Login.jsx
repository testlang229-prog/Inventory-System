// frontend/src/components/Login.jsx
import { useState } from 'react';



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
    <div className="hidden lg:flex flex-col justify-center">

  <div className="max-w-xl">

    <div className="text-6xl mb-6">
      🏢
    </div>

    <h1 className="text-5xl font-extrabold text-gray-800 leading-tight">
      Asset Inventory
      <br />
      System
    </h1>

    <p className="mt-5 text-lg text-gray-600 leading-relaxed">
      Scan. Track. Manage.
      <br />
      A smarter way to manage assets efficiently.
    </p>

    <div className="grid grid-cols-3 gap-4 mt-10">

      <div className="bg-white/70 rounded-2xl p-5 shadow-lg border border-white/40 transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:scale-[1.03] cursor-pointer">
        <div className="text-3xl mb-3">
          📷
        </div>

        <h3 className="font-bold text-gray-800">
          Scan
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Fast QR and barcode scanning
        </p>
      </div>

      <div className="bg-white/70 rounded-2xl p-5 shadow-lg border border-white/40 transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:scale-[1.03] cursor-pointer">
        <div className="text-3xl mb-3">
          📦
        </div>

        <h3 className="font-bold text-gray-800">
          Track
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Monitor assets in real-time
        </p>
      </div>

      <div className="bg-white/70 rounded-2xl p-5 shadow-lg border border-white/40 transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:scale-[1.03] cursor-pointer">
        <div className="text-3xl mb-3">
          🔒
        </div>

        <h3 className="font-bold text-gray-800">
          Secure
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Protected employee access
        </p>
      </div>

    </div>

  </div>

</div>
      <div className="max-w-md w-full mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/40 p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3 leading-tight">
            🏢 Asset Inventory System
          </h1>
          <p className="text-gray-600 font-medium">
  GMADC - OJT Project
</p>
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">
  Scan. Track. Manage.
  <br />
  Securely access the inventory system.
</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
              Employee ID
            </label>
            <input
              type="text"
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your Employee ID"
              required
            />
          </div>

<div className="mb-6">
  <label
    htmlFor="password"
    className="block text-sm font-medium text-gray-700 mb-2"
  >
    Password
  </label>

  <input
    type="password"
    id="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Enter your password"
    required
  />
</div>

{error && (
  <p className="text-red-500 text-sm mb-4">{error}</p>
)}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition duration-200 font-semibold shadow-lg shadow-blue-200"
          >
            🔓 Access System
          </button>
        </form>

        <button
          type="button"
          onClick={onShowAdmin}
          className="mt-5 w-full border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-100 transition duration-200 font-medium"
        >
          Admin Login
        </button>
      </div>
        </div>

  </div>

  );
}