import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard, getAllOrders } from '../../api/admin.api';
import AdminStatsCard from '../../components/admin/AdminStatsCard';
import OrderStatusBadge from '../../components/admin/OrderStatusBadge';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { ROUTES } from '../../constants/routes';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './AdminPages.css';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [dashRes, ordersRes] = await Promise.all([
        getDashboard(),
        getAllOrders(),
      ]);
      setStats(dashRes.data?.data || null);
      setRecentOrders((ordersRes.data?.data || []).slice(0, 5));
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load dashboard metrics.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="admin-dashboard-page">
      <div className="admin-page-header">
        <div>
          <h1>Administration Dashboard</h1>
          <p>Real-time overview of catalog, orders, and customer activity</p>
        </div>
        <div className="admin-header-actions">
          <Link to={ROUTES.ADMIN_BOOK_NEW} className="btn btn-primary">
            + Add New Book
          </Link>
        </div>
      </div>

      {loading ? (
        <Spinner message="Loading dashboard statistics..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchDashboardData} />
      ) : (
        <>
          {/* Key Metrics Grid */}
          <div className="admin-stats-grid">
            <AdminStatsCard
              title="Total Catalog Books"
              value={stats?.totalBooks ?? 0}
              icon="📚"
              color="primary"
              subtitle="Active titles in catalog"
            />
            <AdminStatsCard
              title="Total Customer Orders"
              value={stats?.totalOrders ?? 0}
              icon="📦"
              color="success"
              subtitle="All-time placed orders"
            />
            <AdminStatsCard
              title="Pending Orders"
              value={stats?.pendingOrders ?? 0}
              icon="⏳"
              color="warning"
              subtitle="Requires fulfillment action"
            />
            <AdminStatsCard
              title="Registered Customers"
              value={stats?.totalCustomers ?? 0}
              icon="👥"
              color="info"
              subtitle="Total active customer accounts"
            />
          </div>

          {/* Quick Shortcuts */}
          <div className="dashboard-shortcuts-row">
            <Link to={ROUTES.ADMIN_BOOKS} className="shortcut-card card">
              <span className="shortcut-icon">📚</span>
              <div>
                <h4>Manage Catalog</h4>
                <p>View, edit, add, or delete bookstore titles</p>
              </div>
            </Link>
            <Link to={ROUTES.ADMIN_ORDERS} className="shortcut-card card">
              <span className="shortcut-icon">📦</span>
              <div>
                <h4>Manage Orders</h4>
                <p>Track customer orders and update dispatch status</p>
              </div>
            </Link>
            <Link to={ROUTES.ADMIN_BOOK_NEW} className="shortcut-card card">
              <span className="shortcut-icon">➕</span>
              <div>
                <h4>New Book Entry</h4>
                <p>Upload new cover image & publish book</p>
              </div>
            </Link>
          </div>

          {/* Recent Orders Section */}
          <div className="card admin-recent-orders-card">
            <div className="table-header-bar">
              <h3>Recent Customer Orders</h3>
              <Link to={ROUTES.ADMIN_ORDERS} className="btn btn-secondary btn-sm">
                View All Orders →
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <span className="monospace-id">#{order._id.substring(order._id.length - 8)}</span>
                        </td>
                        <td>
                          <div>
                            <strong>{order.user?.name || 'Customer'}</strong>
                            <div className="text-muted-xs">{order.user?.email}</div>
                          </div>
                        </td>
                        <td>{order.items?.length || 0} books</td>
                        <td>
                          <strong>{formatCurrency(order.totalAmount)}</strong>
                        </td>
                        <td>
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td style={{ textAlign: 'right' }}>
                          <Link
                            to={ROUTES.ADMIN_ORDERS}
                            className="btn btn-secondary btn-sm"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data-msg">No orders placed yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
