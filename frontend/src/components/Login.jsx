// frontend/src/components/Login.jsx
import { useState } from 'react';

const departments = [
  'IT Department',
  'HR Department',
  'Finance Department',
  'Operations Department',
  'Maintenance Department',
  'Security Department',
  'Administration',
  'Other'
];

export default function Login({ onLogin, onShowAdmin }) {
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (employeeId.trim() && department) {
      onLogin({ employeeId: employeeId.trim(), department });
      setError('');
    } else {
      setError('Please enter your Employee ID and select a department');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🏢 Asset Inventory System
          </h1>
          <p className="text-gray-600">GMADC - OJT Project</p>
          <p className="text-sm text-gray-500 mt-2">Please enter your credentials to access the system</p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your Employee ID"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select your department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Access System
          </button>
        </form>

        <button
          type="button"
          onClick={onShowAdmin}
          className="mt-5 w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition duration-200"
        >
          Admin Login
        </button>
      </div>
    </div>
  );
}