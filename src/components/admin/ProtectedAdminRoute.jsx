import { Navigate, useLocation } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="admin-loading">
        <Loader className="spin" size={32} />
        <span>Loading...</span>
        <style>{`
          .admin-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            gap: 1rem;
            color: #5c3d2e;
          }
          .spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
