import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

/**
 * ProtectedRoute — wraps routes that require authentication and/or a specific role.
 *
 * Props:
 *   children   — the component to render when authorised
 *   role       — (optional) required role, e.g. ROLES.ADMIN or ROLES.CUSTOMER
 */
export default function ProtectedRoute({ children, role }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (role && user.role !== role) {
    // Redirect admin trying to access customer routes back to admin dashboard
    if (user.role === ROLES.ADMIN) {
      return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
    }
    // Redirect customer trying to access admin routes back to store
    return <Navigate to={ROUTES.BOOKS} replace />;
  }

  return children;
}
