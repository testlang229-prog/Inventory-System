import { useState } from 'react';
import adminIcon from '../assets/icons/admin-icon.png';
import usersIcon from '../assets/icons/users-icon.png';
import activityIcon from '../assets/icons/activity-icon.png';
import securityIcon from '../assets/icons/security-icon.png';
import employeeIcon from '../assets/icons/employee-icon.png';
import eagleLogo from '../assets/logo.jpg';

export default function AdminLogin({
  onLogin,
  onBack,
  activeTab,
}) {
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
    <div
  className={`min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-8 transition-all duration-500 ${
    activeTab === 'admin'
      ? 'bg-[#020617]'
      : 'bg-[#F6F3EA]'
  }`}
>
      <div
  className="absolute inset-0"
  style={{
    background: `
      radial-gradient(circle at bottom right, rgba(212,160,23,0.24), transparent 28%),
      radial-gradient(circle at top left, rgba(59,130,246,0.08), transparent 30%)
    `
  }}
/>

<img
  src={eagleLogo}
  alt="Golden Eagles"
  className="absolute left-[-180px] top-1/2 -translate-y-1/2 w-[1050px] opacity-[0.09] rotate-[-10deg]"
/>

  <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-10 items-center">
    <div className="hidden lg:flex flex-col justify-center pl-8">

  <div className="max-w-lg">

    <div className="mb-6">
  <img
    src={adminIcon}
    alt="Admin"
    className="w-20 h-20 object-contain drop-shadow-2xl"
  />
</div>

    <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.05] tracking-tight">
      Admin Control
      <br />
      Center
    </h1>

    <p className="mt-4 text-base text-slate-300 leading-relaxed max-w-md">
      Secure. Control. Monitor.
      <br />
      Manage the inventory system confidently.
    </p>

    <div className="grid grid-cols-3 gap-4 mt-10 max-w-2xl">

  <div className="group min-h-[170px] bg-white/10 border border-white/10 backdrop-blur-xl rounded-[1.3rem] p-4 shadow-2xl hover:-translate-y-1 hover:border-[#D4A017]/30 transition duration-300 flex flex-col">

    <img
      src={usersIcon}
      alt="Users"
      className="w-8 h-8 object-contain mb-3 opacity-90"
    />

    <h3 className="font-semibold text-white text-lg leading-tight">
      Users
    </h3>

    <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
      Manage employee access
    </p>

  </div>

  <div className="group min-h-[170px] bg-white/10 border border-white/10 backdrop-blur-xl rounded-[1.3rem] p-4 shadow-2xl hover:-translate-y-1 hover:border-[#D4A017]/30 transition duration-300 flex flex-col">

    <img
      src={activityIcon}
      alt="Reports"
      className="w-8 h-8 object-contain mb-3 opacity-90"
    />

    <h3 className="font-semibold text-white text-lg leading-tight">
      Reports
    </h3>

    <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
      Monitor inventory activity
    </p>

  </div>

  <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4A017]/30 hover:bg-white/15 hover:shadow-2xl cursor-pointer">

    <img
      src={securityIcon}
      alt="Security"
      className="w-8 h-8 object-contain mb-3 opacity-90"
    />

    <h3 className="font-semibold text-white text-lg leading-tight">
      Security
    </h3>

    <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
      Restricted admin control
    </p>

  </div>

</div>

  </div>

</div>
      <div
  className={`login-glow max-w-md w-full mx-auto backdrop-blur-sm rounded-3xl shadow-2xl px-7 py-6 md:p-10 transition-all duration-500 ${
    activeTab === 'admin'
      ? 'bg-white/95 border border-white/20'
      : 'bg-white/95 border border-slate-200'
  }`}
>

        <div className="text-center mb-8">

  <div className="flex justify-center mb-5">

    <div className="w-20 h-20 rounded-3xl bg-amber-50 flex items-center justify-center shadow-sm">

      <img
        src={adminIcon}
        alt="Admin"
        className="w-10 h-10 object-contain"
      />

    </div>

  </div>

  <h1
  className={`text-4xl md:text-5xl font-extrabold leading-tight tracking-tight transition-all duration-500 ${
    activeTab === 'admin'
      ? 'text-slate-800'
      : 'text-slate-800'
  }`}
>
    Admin Login
  </h1>

  <p className="mt-5 text-slate-500 font-semibold tracking-[0.18em] uppercase text-xs">
    Enterprise Control Center
  </p>

  <p className="text-sm text-slate-500 mt-3">
    Secure administrator control panel
  </p>
  <div
  className={`relative mt-7 flex rounded-2xl p-1 overflow-hidden transition-all duration-500 ${
    activeTab === 'admin'
      ? 'bg-[#F8F8FA] border border-[#E5E7EB]'
      : 'bg-white/5 border border-white/10'
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
  onClick={onBack}
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
  onClick={() => {}}
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
  className={`w-full py-3 px-4 rounded-xl active:scale-[0.98] transition-all duration-500 font-semibold shadow-lg ${
    activeTab === 'admin'
      ? 'bg-[#0F172A] hover:bg-[#1E293B] text-white'
      : 'bg-[#D4A017] hover:brightness-110 text-white'
  }`}
>
  {activeTab === 'admin' ? 'Continue' : 'Login'}
</button>
        </form>

        

      </div>
        </div>

  </div>

  );
}