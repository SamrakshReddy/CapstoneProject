import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminNavbar from './AdminNavbar';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAuthors: 0,
    totalArticles: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:4000/admin-api/stats', {
        withCredentials: true,
      });
      setStats(res.data.payload);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch stats');
      if (err.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wide mb-2">
            {title}
          </p>
          <p className="text-4xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`text-4xl ${icon}`}>{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AdminNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading dashboard...</p>
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
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-600">Welcome back! Here's your platform overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon="👥"
            color="border-blue-500"
            onClick={() => navigate('/admin-users')}
          />
          <StatCard
            title="Total Authors"
            value={stats.totalAuthors}
            icon="✍️"
            color="border-purple-500"
            onClick={() => navigate('/admin-authors')}
          />
          <StatCard
            title="Total Articles"
            value={stats.totalArticles}
            icon="📰"
            color="border-green-500"
            onClick={() => navigate('/admin-articles')}
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon="✅"
            color="border-emerald-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin-users')}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors text-center"
            >
              <div className="text-2xl mb-2">👥</div>
              <p className="font-semibold text-blue-900">Manage Users</p>
              <p className="text-sm text-blue-700 mt-1">View and manage all users</p>
            </button>

            <button
              onClick={() => navigate('/admin-authors')}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors text-center"
            >
              <div className="text-2xl mb-2">✍️</div>
              <p className="font-semibold text-purple-900">Manage Authors</p>
              <p className="text-sm text-purple-700 mt-1">View and manage all authors</p>
            </button>

            <button
              onClick={() => navigate('/admin-articles')}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors text-center"
            >
              <div className="text-2xl mb-2">📰</div>
              <p className="font-semibold text-green-900">Manage Articles</p>
              <p className="text-sm text-green-700 mt-1">Review and manage articles</p>
            </button>

            <button
              onClick={fetchStats}
              className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors text-center"
            >
              <div className="text-2xl mb-2">🔄</div>
              <p className="font-semibold text-slate-900">Refresh</p>
              <p className="text-sm text-slate-700 mt-1">Update dashboard stats</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
