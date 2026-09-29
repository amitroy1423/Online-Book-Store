import { Route } from 'react-router-dom';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminBooksPage from '../pages/admin/AdminBooksPage';
import AdminBookFormPage from '../pages/admin/AdminBookFormPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

export const AdminRoutes = () => (
  <>
    <Route
      path={ROUTES.ADMIN_DASHBOARD}
      element={
        <ProtectedRoute role={ROLES.ADMIN}>
          <AdminDashboardPage />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.ADMIN_BOOKS}
      element={
        <ProtectedRoute role={ROLES.ADMIN}>
          <AdminBooksPage />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.ADMIN_BOOK_NEW}
      element={
        <ProtectedRoute role={ROLES.ADMIN}>
          <AdminBookFormPage />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.ADMIN_BOOK_EDIT}
      element={
        <ProtectedRoute role={ROLES.ADMIN}>
          <AdminBookFormPage />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.ADMIN_ORDERS}
      element={
        <ProtectedRoute role={ROLES.ADMIN}>
          <AdminOrdersPage />
        </ProtectedRoute>
      }
    />
  </>
);
