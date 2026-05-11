// frontend/src/components/UserManagement.jsx
import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ employeeId: '', department: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);

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

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/users`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.employeeId.trim() || !formData.department) {
      setError('Please fill in all fields');
      return;
    }

    try {
      let response;
      if (editingId) {
        response = await fetch(`${API_BASE}/users/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        response = await fetch(`${API_BASE}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      const data = await response.json();
      if (data.success) {
        setSuccess(data.message);
        setFormData({ employeeId: '', department: '' });
        setEditingId(null);
        setShowForm(false);
        fetchUsers();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to save user');
    }
  };

  const handleEdit = (user) => {
    setFormData({ employeeId: user.employeeId, department: user.department });
    setEditingId(user.employeeId);
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm(`Are you sure you want to delete employee ${employeeId}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/users/${employeeId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(data.message);
        fetchUsers();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ employeeId: '', department: '' });
    setEditingId(null);
    setError('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          👥 User Management
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Add User
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-4 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-4 text-green-700">
          {success}
        </div>
      )}

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            {editingId ? 'Edit User' : 'Add New User'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID
              </label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., EMP001"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {editingId ? 'Update User' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No users found. Create your first user.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Employee ID</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Department</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Created Date</th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{user.employeeId}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.department}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-2 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.employeeId)}
                      className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
