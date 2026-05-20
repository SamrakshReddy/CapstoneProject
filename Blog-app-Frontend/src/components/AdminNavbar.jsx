import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../store/authStore';
import toast from 'react-hot-toast';

function AdminNavbar() {
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin-dashboard' },
    { name: 'Users', path: '/admin-users' },
    { name: 'Authors', path: '/admin-authors' },
    { name: 'Articles', path: '/admin-articles' },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="cursor-pointer flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:inline">Admin Panel</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="text-slate-200 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Logout & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="hidden sm:inline px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Logout
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-slate-200 hover:bg-slate-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
              >
                {link.name}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default AdminNavbar;
