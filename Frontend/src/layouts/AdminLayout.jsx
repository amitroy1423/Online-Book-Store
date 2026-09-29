import { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import './AdminLayout.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-layout">
      {/* Top Header for Mobile & Desktop */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <button
            className="admin-menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation sidebar"
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
          <Link to={ROUTES.ADMIN_DASHBOARD} className="admin-brand">
            📚 BookNest <span className="admin-badge">Admin</span>
          </Link>
        </div>

        <div className="admin-topbar-right">
          <Link to={ROUTES.BOOKS} className="btn btn-secondary btn-sm store-link-btn">
            🌐 View Store
          </Link>
          <span className="admin-user-greeting">
            Admin: <strong>{user?.name || 'Administrator'}</strong>
          </span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="admin-body">
        {/* Sidebar Overlay on mobile */}
        {sidebarOpen && (
          <div className="admin-sidebar-overlay" onClick={closeSidebar} />
        )}

        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="admin-nav">
            <div className="admin-nav-section-title">Menu</div>
            <NavLink
              to={ROUTES.ADMIN_DASHBOARD}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'active' : ''}`
              }
              onClick={closeSidebar}
            >
              <span className="admin-nav-icon">📊</span>
              Dashboard
            </NavLink>

            <NavLink
              to={ROUTES.ADMIN_BOOKS}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'active' : ''}`
              }
              onClick={closeSidebar}
            >
              <span className="admin-nav-icon">📚</span>
              Books Catalog
            </NavLink>

            <NavLink
              to={ROUTES.ADMIN_ORDERS}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'active' : ''}`
              }
              onClick={closeSidebar}
            >
              <span className="admin-nav-icon">📦</span>
              Orders Management
            </NavLink>

            <div className="admin-nav-divider" />
            <div className="admin-nav-section-title">Store</div>

            <Link
              to={ROUTES.BOOKS}
              className="admin-nav-item"
              onClick={closeSidebar}
            >
              <span className="admin-nav-icon">🛒</span>
              Public Bookstore
            </Link>
          </nav>

          <div className="admin-sidebar-footer">
            <p className="admin-version">BookNest v1.0 • Admin Portal</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
