import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';
import './StoreLayout.css';

export default function StoreLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate(ROUTES.LOGIN);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  const isAdmin = user?.role === ROLES.ADMIN;

  return (
    <div className="store-layout">
      <header className="navbar">
        <div className="container navbar-inner">
          <Link to={ROUTES.HOME} className="navbar-brand" onClick={closeMenu}>
            📚 BookNest
          </Link>

          <button
            className="navbar-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>

          <nav className={`navbar-nav ${mobileMenuOpen ? 'open' : ''}`}>
            <NavLink to={ROUTES.BOOKS} className="nav-link" onClick={closeMenu}>
              Books
            </NavLink>

            {isAuthenticated && !isAdmin && (
              <>
                <NavLink to={ROUTES.CART} className="nav-link cart-link" onClick={closeMenu}>
                  Cart
                  {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                </NavLink>
                <NavLink to={ROUTES.ORDERS} className="nav-link" onClick={closeMenu}>
                  My Orders
                </NavLink>
              </>
            )}

            {isAuthenticated && isAdmin && (
              <NavLink
                to={ROUTES.ADMIN_DASHBOARD}
                className="nav-link admin-nav-link"
                onClick={closeMenu}
              >
                📊 Admin Dashboard
              </NavLink>
            )}

            {!isAuthenticated && (
              <NavLink to={ROUTES.CART} className="nav-link cart-link" onClick={closeMenu}>
                Cart
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </NavLink>
            )}

            <div className="nav-actions">
              {isAuthenticated ? (
                <>
                  <span className="nav-user">Hi, {user.name}</span>
                  <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to={ROUTES.LOGIN} className="btn btn-secondary btn-sm" onClick={closeMenu}>
                    Login
                  </Link>
                  <Link to={ROUTES.REGISTER} className="btn btn-primary btn-sm" onClick={closeMenu}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="store-main">
        <Outlet />
      </main>

      <footer className="store-footer">
        <div className="container">
          <p>© 2026 BookNest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
