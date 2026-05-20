import { useAuth } from '../store/authStore';
import { Navigate } from 'react-router';

function AdminRoute({ children }) {
  const currentUser = useAuth((state) => state.currentUser);
  const loading = useAuth((state) => state.loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'ADMIN') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default AdminRoute;
