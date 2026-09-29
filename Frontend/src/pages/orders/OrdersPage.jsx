import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../api/order.api';
import OrderStatusBadge from '../../components/admin/OrderStatusBadge';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { ROUTES } from '../../constants/routes';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './Orders.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getMyOrders();
      setOrders(res.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load your orders history.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-page container">
      <div className="page-header">
        <h1>My Orders</h1>
        <p>Track the delivery status and history of your placed book orders</p>
      </div>

      {loading ? (
        <Spinner message="Loading your order history..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchOrders} />
      ) : orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-history-card card">
              <div className="order-history-header">
                <div className="order-meta-info">
                  <span className="order-id-label">
                    Order ID: <strong>#{order._id}</strong>
                  </span>
                  <span className="order-date-label">
                    Placed on: {formatDate(order.createdAt)}
                  </span>
                </div>
                <div className="order-status-badge-wrap">
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>

              <div className="order-items-preview-strip">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="order-item-chip">
                    <div className="order-item-thumb">
                      {item.book?.image ? (
                        <img src={item.book.image} alt={item.title} />
                      ) : (
                        <span>📖</span>
                      )}
                    </div>
                    <div className="order-item-details">
                      <span className="item-title">{item.title}</span>
                      <span className="item-qty-price">
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-history-footer">
                <div className="order-total-info">
                  <span className="order-payment-type">
                    💵 Payment: Cash on Delivery
                  </span>
                  <span className="order-total-amount">
                    Total: <strong>{formatCurrency(order.totalAmount)}</strong>
                  </span>
                </div>
                <Link
                  to={`/orders/${order._id}`}
                  className="btn btn-secondary btn-sm"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📦"
          title="No Orders Found"
          description="You have not placed any orders yet. Discover books and place your first Cash on Delivery order!"
          actionLabel="Browse Bookstore"
          actionLink={ROUTES.BOOKS}
        />
      )}
    </div>
  );
}
