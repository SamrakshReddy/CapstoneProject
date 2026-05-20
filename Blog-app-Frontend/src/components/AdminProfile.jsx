import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
  bodyText,
  ghostBtn,
  loadingClass,
  pageTitleClass,
} from "../styles/common";

function AdminProfile() {
  const user = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!user) {
    return <p className={loadingClass}>Loading admin profile...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className={pageTitleClass}>Admin Profile</p>
            <p className={`${bodyText} mt-2`}>Manage your account and access admin tools.</p>
          </div>
          <button className={`${ghostBtn} px-6 py-2`} onClick={onLogout}>
            Logout
          </button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-6">
            <p className="text-sm text-slate-500 uppercase tracking-[0.24em]">Name</p>
            <p className="mt-3 text-lg font-semibold text-slate-900">{user.firstName} {user.lastName}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-6">
            <p className="text-sm text-slate-500 uppercase tracking-[0.24em]">Email</p>
            <p className="mt-3 text-lg font-semibold text-slate-900">{user.email}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-6">
            <p className="text-sm text-slate-500 uppercase tracking-[0.24em]">Role</p>
            <p className="mt-3 text-lg font-semibold text-slate-900">{user.role}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-6">
            <p className="text-sm text-slate-500 uppercase tracking-[0.24em]">Status</p>
            <p className="mt-3 text-lg font-semibold text-slate-900">
              {user.isActive ? "Active" : "Blocked"}
            </p>
          </div>
        </div>
      </div>

      {/* Admin Dashboard Navigation */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Admin Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Dashboard */}
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500 group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📊</div>
            <h3 className="font-semibold text-slate-900 mb-2">Dashboard</h3>
            <p className="text-sm text-slate-600">View platform statistics</p>
          </button>

          {/* Manage Users */}
          <button
            onClick={() => navigate('/admin-users')}
            className="p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 border-l-4 border-purple-500 group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">👥</div>
            <h3 className="font-semibold text-slate-900 mb-2">Manage Users</h3>
            <p className="text-sm text-slate-600">View & manage users</p>
          </button>

          {/* Manage Authors */}
          <button
            onClick={() => navigate('/admin-authors')}
            className="p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 border-l-4 border-green-500 group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">✍️</div>
            <h3 className="font-semibold text-slate-900 mb-2">Manage Authors</h3>
            <p className="text-sm text-slate-600">Manage author accounts</p>
          </button>

          {/* Manage Articles */}
          <button
            onClick={() => navigate('/admin-articles')}
            className="p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 border-l-4 border-emerald-500 group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📰</div>
            <h3 className="font-semibold text-slate-900 mb-2">Manage Articles</h3>
            <p className="text-sm text-slate-600">Moderate content</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
