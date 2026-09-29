import { Route } from 'react-router-dom';
import CartPage from '../pages/cart/CartPage';
import CheckoutPage from '../pages/cart/CheckoutPage';
import OrdersPage from '../pages/orders/OrdersPage';
import OrderDetailPage from '../pages/orders/OrderDetailPage';
import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

export const OrderRoutes = () => (
  <>
    <Route path={ROUTES.CART} element={<CartPage />} />
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
  </>
);
