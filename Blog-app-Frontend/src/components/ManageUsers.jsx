import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminNavbar from './AdminNavbar';

function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit] = useState(8);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:4000/admin-api/users', {
        params: {
          page: currentPage,
          limit,
          search: searchTerm,
          role: roleFilter,
        },
        withCredentials: true,
      });
      setUsers(res.data.payload.users);
      setTotalPages(res.data.payload.totalPages);
      setTotalUsers(res.data.payload.totalUsers);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch users');
      if (err.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (userId) => {
    if (window.confirm('Are you sure you want to block this user?')) {
      try {
        await axios.patch(
          `http://localhost:4000/admin-api/block-user/${userId}`,
          {},
          { withCredentials: true }
        );
        toast.success('User blocked successfully');
        fetchUsers();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to block user');
      }
    }
  };

  const handleUnblock = async (userId) => {
    if (window.confirm('Are you sure you want to unblock this user?')) {
      try {
        await axios.patch(
          `http://localhost:4000/admin-api/unblock-user/${userId}`,
          {},
          { withCredentials: true }
        );
        toast.success('User unblocked successfully');
        fetchUsers();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to unblock user');
      }
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('This action is permanent and will delete all user data and articles. Continue?')) {
      try {
        setDeletingId(userId);
        await axios.delete(
          `http://localhost:4000/admin-api/delete-user/${userId}`,
          { withCredentials: true }
        );
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete user');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  };

  const RoleChip = ({ role }) => {
    const colors = {
      USER: 'bg-blue-100 text-blue-800',
      AUTHOR: 'bg-purple-100 text-purple-800',
      ADMIN: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[role] || 'bg-slate-100'}`}>
        {role}
      </span>
    );
  };

  const StatusBadge = ({ isActive }) => (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}
    >
      {isActive ? 'Active' : 'Blocked'}
    </span>
  );

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AdminNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Manage Users</h1>
          <p className="text-slate-600">Total: {totalUsers} users</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearch}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <select
              value={roleFilter}
              onChange={handleRoleFilter}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="AUTHOR">Author</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('');
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">User</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.profileImageUrl ? (
                            <img
                              src={user.profileImageUrl}
                              alt={user.firstName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-sm font-bold">
                              {user.firstName[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900">
                              {user.firstName} {user.lastName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <RoleChip role={user.role} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge isActive={user.isActive} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          {user.isActive ? (
                            <button
                              onClick={() => handleBlock(user._id)}
                              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-sm font-medium transition-colors"
                            >
                              Block
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnblock(user._id)}
                              className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-sm font-medium transition-colors"
                            >
                              Unblock
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(user._id)}
                            disabled={deletingId === user._id}
                            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            {deletingId === user._id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-slate-600 text-sm">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;
