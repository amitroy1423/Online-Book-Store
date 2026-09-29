import { Routes, Route } from 'react-router-dom';
import StoreLayout from '../layouts/StoreLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '../constants/roles';
import { ROUTES } from '../constants/routes';

// Store Pages
import HomePage from '../pages/shop/HomePage';
import BooksPage from '../pages/shop/BooksPage';
import BookDetailPage from '../pages/shop/BookDetailPage';
import CartPage from '../pages/cart/CartPage';
import CheckoutPage from '../pages/cart/CheckoutPage';
import OrdersPage from '../pages/orders/OrdersPage';
import OrderDetailPage from '../pages/orders/OrderDetailPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminBooksPage from '../pages/admin/AdminBooksPage';
import AdminBookFormPage from '../pages/admin/AdminBookFormPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';

// 404
import NotFoundPage from '../pages/common/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Storefront Layout (Public & Customer routes) */}
      <Route element={<StoreLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.BOOKS} element={<BooksPage />} />
        <Route path={ROUTES.BOOK_DETAILS} element={<BookDetailPage />} />
        <Route path={ROUTES.CART} element={<CartPage />} />

        {/* Customer Protected Routes */}
        <Route
          path={ROUTES.CHECKOUT}
          element={
            <ProtectedRoute role={ROLES.CUSTOMER}>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ORDERS}
          element={
            <ProtectedRoute role={ROLES.CUSTOMER}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ORDER_DETAILS}
          element={
            <ProtectedRoute role={ROLES.CUSTOMER}>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 inside Store Layout */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Auth Layout */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>

      {/* Admin Layout (Protected Admin routes) */}
      <Route
        element={
          <ProtectedRoute role={ROLES.ADMIN}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
        <Route path={ROUTES.ADMIN_BOOKS} element={<AdminBooksPage />} />
        <Route path={ROUTES.ADMIN_BOOK_NEW} element={<AdminBookFormPage />} />
        <Route path={ROUTES.ADMIN_BOOK_EDIT} element={<AdminBookFormPage />} />
        <Route path={ROUTES.ADMIN_ORDERS} element={<AdminOrdersPage />} />
      </Route>
    </Routes>
  );
}
