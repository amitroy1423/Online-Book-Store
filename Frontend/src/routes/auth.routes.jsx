import { Route } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import { ROUTES } from '../constants/routes';

export const AuthRoutes = () => (
  <>
    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
    <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
  </>
);
