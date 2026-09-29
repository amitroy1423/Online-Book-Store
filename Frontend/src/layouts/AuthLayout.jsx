import { Outlet } from 'react-router-dom';
import './AuthLayout.css';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-logo">📚 BookNest</h1>
          <p className="auth-tagline">Your favourite online book store</p>
        </div>
        <div className="auth-card">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
