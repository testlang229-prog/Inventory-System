// frontend/src/components/UserManagement.jsx
import { useState, useEffect } from 'react';
import apiClient from '../services/api';
import adminIcon from '../assets/icons/admin.svg';
import userIcon from '../assets/icons/user.svg';
import lockIcon from '../assets/icons/lock.svg';


export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
  employeeId: '',
  name: '',
  department: '',
  password: '',
  role: 'user'
});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
const [showRemoveModal, setShowRemoveModal] = useState(false);
const [selectedUserId, setSelectedUserId] = useState('');
const [customDepartments, setCustomDepartments] =
  useState([]);

const [showDepartmentModal, setShowDepartmentModal] =
  useState(false);

const [newDepartment, setNewDepartment] =
  useState('');

  const departments = [
  'IT Department',
  'HR Department',
  'Finance Department',
  'Operations Department',
  'Maintenance Department',
  'Security Department',
  'Administration',
  ...customDepartments,
  '➕ Add New Department'
];

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/users');
const data = response.data;
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

    if (
  !formData.employeeId.trim() ||
  !formData.name.trim() ||
  !formData.department ||
  !formData.password
) {
      setError('Please fill in all fields');
      return;
    }

    try {
      let response;
      if (editingId) {
        response = await apiClient.put(`/users/${editingId}`, formData);
      } else {
        response = await apiClient.post('/users', formData);
      }

      const data = response.data;
      if (data.success) {
        setSuccess(data.message);
        setFormData({
  employeeId: '',
  name: '',
  department: '',
  password: '',
  role: 'user'
});
        setEditingId(null);
        setShowForm(false);
        fetchUsers();
      } else {
        setError(data.message);
      }
    } catch (err) {

  setError(
    err.response?.data?.message ||
    err.message ||
    'Failed to save user'
  );

}
  };

  const handleEdit = (user) => {
    setFormData({
  employeeId: user.employeeId,
  name: user.name || '',
  department: user.department,
  password: '',
  role: user.role || 'user'
});
    setEditingId(user.employeeId);
    setShowForm(true);
    setError('');
  };

  const handleDelete = (employeeId) => {
  setSelectedUserId(employeeId);
  setShowRemoveModal(true);
};

const confirmRemoveUser = async () => {
  try {
    const response = await apiClient.delete(`/users/${selectedUserId}`);
    const data = response.data;

    if (data.success) {
      setSuccess(data.message);
      fetchUsers();
    } else {
      setError(data.message);
    }
  } catch (err) {
    setError('Failed to remove user');
  } finally {
    setShowRemoveModal(false);
    setSelectedUserId('');
  }
};

const handleAddDepartment = () => {

  if (!newDepartment.trim()) return;

  const departmentName =
    newDepartment.trim();

  if (
    departments.includes(departmentName)
  ) {
    setShowDepartmentModal(false);
    setNewDepartment('');
    return;
  }

  setCustomDepartments(prev => [
    ...prev,
    departmentName
  ]);

  setFormData({
    ...formData,
    department: departmentName
  });

  setNewDepartment('');
  setShowDepartmentModal(false);
};

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
  employeeId: '',
  name: '',
  department: '',
  password: '',
  role: 'user'
});
    setEditingId(null);
    setError('');
  };

  return (
    <div className="bg-gradient-to-br from-white/80 via-white/65 to-slate-100/40 backdrop-blur-2xl border border-white/50 rounded-[32px] shadow-[0_10px_40px_rgba(15,23,42,0.05)] p-5 sm:p-6 overflow-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">
  User Management
</h2>
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto px-5 py-3 bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-2xl hover:scale-[1.01] transition-all duration-300 shadow-[0_8px_24px_rgba(99,102,241,0.18)] font-semibold"
        >
          Add User
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
        <div className="bg-white/45 backdrop-blur-2xl rounded-[28px] p-6 mb-6 border border-white/50 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            {editingId ? 'Edit User' : 'Add New User'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Employee ID
  </label>

  <input
    type="text"
    value={formData.employeeId}
    onChange={(e) =>
      setFormData({
        ...formData,
        employeeId: e.target.value
      })
    }
    className="w-full px-3 py-2 border border-white/60 bg-white/60 backdrop-blur-xl rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300"
    placeholder="e.g., EMP001"
    required
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Full Name
  </label>

  <input
    type="text"
    value={formData.name}
    onChange={(e) =>
      setFormData({
        ...formData,
        name: e.target.value
      })
    }
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Enter full name"
    required
  />
</div>

            <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Department
  </label>

  <select
  value={formData.department}
  onChange={(e) => {

    if (
      e.target.value ===
      '➕ Add New Department'
    ) {
      setShowDepartmentModal(true);
      return;
    }

    setFormData({
      ...formData,
      department: e.target.value
    });
  }}
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  required
>
  <option value="">
    Select Department
  </option>

  {departments.map((dept) => (
    <option
      key={dept}
      value={dept}
    >
      {dept}
    </option>
  ))}
</select>
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Password
  </label>

  <input
    type="password"
    value={formData.password}
    onChange={(e) =>
      setFormData({
        ...formData,
        password: e.target.value
      })
    }
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Enter password"
    required
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Role
  </label>

  <select
    value={formData.role}
    onChange={(e) =>
      setFormData({
        ...formData,
        role: e.target.value
      })
    }
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="user">User</option>
    <option value="admin">Admin</option>
  </select>
</div>

            <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3 justify-end">
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

  <div className="overflow-x-auto animate-pulse">

    <table className="min-w-[700px] w-full">

      <thead className="bg-gray-100 border-b border-gray-300">
        <tr>
          {[...Array(5)].map((_, index) => (
            <th
              key={index}
              className="px-4 py-3"
            >
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {[...Array(6)].map((_, rowIndex) => (
          <tr
            key={rowIndex}
            className="border-b border-gray-200"
          >

            {[...Array(5)].map((_, colIndex) => (
              <td
                key={colIndex}
                className="px-4 py-4"
              >
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </td>
            ))}

          </tr>
        ))}
      </tbody>

    </table>

  </div>

) : users.length === 0 ? (
        <div className="text-center py-16 bg-white/45 backdrop-blur-2xl rounded-[28px] border border-white/50 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <p className="text-gray-600">No users found. Create your first user.</p>
        </div>
      ) : (
        <>
          <div className="md:hidden space-y-4">

  {users.map((user, idx) => (

    <div
      key={idx}
      className="rounded-[28px] border border-white/50 bg-gradient-to-br from-white/80 via-white/65 to-slate-100/40 backdrop-blur-2xl shadow-[0_8px_30px_rgba(15,23,42,0.05)] p-5"
    >

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-slate-100 flex items-center justify-center shadow-inner">

            <span className="text-lg font-bold text-slate-700">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>

          </div>

          <div>

            <h3 className="text-lg font-bold text-slate-800 tracking-tight">
              {user.name || user.employeeId}
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              {user.department}
            </p>

          </div>

        </div>

        {user.role === 'admin' ? (

          <span className="inline-flex items-center rounded-full bg-rose-50/80 border border-white/60 px-3 py-1 text-xs font-semibold text-rose-700 backdrop-blur-xl">
            ADMIN
          </span>

        ) : (

          <span className="inline-flex items-center rounded-full bg-indigo-50/80 border border-white/60 px-3 py-1 text-xs font-semibold text-indigo-700 backdrop-blur-xl">
            USER
          </span>

        )}

      </div>

      <div className="mt-5 flex gap-3">

        <button
          onClick={() => handleEdit(user)}
          className="flex-1 py-3 rounded-2xl bg-white/60 border border-white/60 text-slate-700 font-medium shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
        >
          Edit
        </button>

        {user.role !== 'admin' ? (

          <button
            onClick={() =>
              handleDelete(user.employeeId)
            }
            className="flex-1 py-3 rounded-2xl bg-rose-50/80 border border-white/60 text-rose-700 font-medium shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
          >
            Remove
          </button>

        ) : (

          <div className="flex-1 py-3 rounded-2xl bg-slate-100/70 border border-white/60 text-slate-400 font-medium text-center">
            Protected
          </div>

        )}

      </div>

    </div>

  ))}

</div>

        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-[700px] w-full">
            <thead className="bg-white/70 backdrop-blur-xl border-b border-white/50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Employee ID</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Department</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
  Role
</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Created Date</th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={idx} className="border-b border-white/50 hover:bg-white/40 transition-all duration-300">
                  <td className="px-4 py-3 text-sm text-gray-900">{user.employeeId}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.department}</td>
                  <td className="px-4 py-3 text-sm">

  {user.role === 'admin' ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50/80 border-white/60 backdrop-blur-xl px-3 py-1 text-xs font-semibold text-rose-700 border">
      <>
  <img
    src={adminIcon}
    alt="Admin"
    className="w-4 h-4 object-contain"
  />

  ADMIN
</>
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50/80 border-white/60 backdrop-blur-xl px-3 py-1 text-xs font-semibold text-indigo-700 border">
      <>
  <img
    src={userIcon}
    alt="User"
    className="w-4 h-4 object-contain"
  />

  USER
</>
    </span>
  )}

</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-3 py-2 text-sm bg-white/60 border border-white/60 rounded-xl text-slate-700 hover:bg-white/80 transition-all duration-300 mr-2 shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
                    >
                      Edit
                    </button>
                    {user.role !== 'admin' ? (

  <button
    onClick={() => handleDelete(user.employeeId)}
    className="px-3 py-2 text-sm bg-rose-50/80 border border-white/60 rounded-xl text-rose-700 hover:bg-rose-100/80 transition-all duration-300 shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
  >
    Remove
  </button>

) : (

  <span className="inline-flex items-center rounded-xl bg-slate-100/70 border border-white/60 px-3 py-2 text-xs font-semibold text-slate-500 backdrop-blur-xl">
    <>
  <img
    src={lockIcon}
    alt="Protected"
    className="w-4 h-4 object-contain"
  />

  Protected
</>
  </span>

)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
              </>
      )}
    {showRemoveModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
    <div className="bg-white/75 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_60px_rgba(15,23,42,0.12)] border border-white/50 p-6 w-full max-w-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Remove User
      </h3>

      <p className="text-gray-600 mb-6">
        Are you sure you want to remove this account?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setShowRemoveModal(false);
            setSelectedUserId('');
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={confirmRemoveUser}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}

{showDepartmentModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

    <div className="bg-white/75 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_60px_rgba(15,23,42,0.12)] border border-white/50 w-full max-w-md p-6">

      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Add New Department
      </h3>

      <p className="text-sm text-gray-500 mb-4">
        Create a new department for users.
      </p>

      <input
        type="text"
        value={newDepartment}
        onChange={(e) =>
          setNewDepartment(e.target.value)
        }
        placeholder="Enter department name"
        className="w-full px-4 py-3 border border-white/60 bg-white/60 backdrop-blur-xl rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300 shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
      />

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => {
            setShowDepartmentModal(false);
            setNewDepartment('');
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handleAddDepartment}
          className="px-5 py-3 bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-2xl hover:scale-[1.01] transition-all duration-300 shadow-[0_8px_24px_rgba(99,102,241,0.18)]"
        >
          Add Department
        </button>

      </div>

    </div>

  </div>
)}

</div>
);
}
