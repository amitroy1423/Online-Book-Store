import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../api/order.api';
import OrderStatusBadge from '../../components/admin/OrderStatusBadge';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { ROUTES } from '../../constants/routes';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './Orders.css';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getOrderById(id);
      setOrder(res.data?.data || null);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load order details.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return (
    <div className="order-detail-page container">
      <div className="breadcrumb-nav">
        <Link to={ROUTES.ORDERS} className="breadcrumb-link">
          ← Back to My Orders
        </Link>
      </div>

      {loading ? (
        <Spinner message="Loading order details..." />
      ) : error ? (
        <div className="detail-error-wrapper">
          <ErrorMessage message={error} onRetry={fetchOrder} />
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to={ROUTES.ORDERS} className="btn btn-secondary">
              Return to Orders
            </Link>
          </div>
        </div>
      ) : order ? (
        <div className="order-detail-container">
          {/* Header Card */}
          <div className="order-detail-header-card card">
            <div className="detail-header-top">
              <div>
                <span className="order-badge-label">Order Confirmation</span>
                <h1 className="order-detail-id">Order #{order._id}</h1>
                <p className="order-detail-date">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="detail-status-pill">
                <span className="status-label">Current Status:</span>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
          </div>

          <div className="order-detail-grid">
            {/* Left: Items Breakdown */}
            <div className="order-items-column">
              <div className="card order-items-card">
                <h2 className="section-title">Purchased Books ({order.items?.length || 0})</h2>
                <div className="order-items-table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Book</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th style={{ textAlign: 'right' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="table-book-info">
                              <div className="table-book-thumb">
                                {item.book?.image ? (
                                  <img src={item.book.image} alt={item.title} />
                                ) : (
                                  <span>📖</span>
                                )}
                              </div>
                              <div>
                                <span className="table-book-title">{item.title}</span>
                                {item.book?.author && (
                                  <span className="table-book-author">by {item.book.author}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>{formatCurrency(item.price)}</td>
                          <td>{item.quantity}</td>
                          <td style={{ textAlign: 'right', fontWeight: '600' }}>
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right: Shipping & Summary */}
            <div className="order-info-column">
              {/* Shipping Address */}
              <div className="card order-address-card">
                <h3 className="card-heading">📍 Delivery Address</h3>
                <div className="address-details">
                  <p className="recipient-name">
                    <strong>{order.shippingAddress?.fullName}</strong>
                  </p>
                  <p className="address-line">{order.shippingAddress?.address}</p>
                  <p className="address-line">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                  </p>
                  <p className="phone-line">
                    📞 Phone: <strong>{order.shippingAddress?.phone}</strong>
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="card order-payment-card">
                <h3 className="card-heading">💵 Payment Details</h3>
                <p className="payment-type">
                  <strong>Method:</strong> Cash on Delivery
                </p>
                <p className="payment-instruction">
                  Please keep exact cash amount ready for the delivery partner.
                </p>
              </div>

              {/* Order Cost Breakdown */}
              <div className="card order-total-card">
                <h3 className="card-heading">Order Summary</h3>
                <div className="cost-row">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="cost-row">
                  <span>Delivery:</span>
                  <span className="text-success">FREE</span>
                </div>
                <div className="cost-row-total">
                  <span>Total Due:</span>
                  <span className="total-due-amount">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          icon="📦"
          title="Order Not Found"
          description="We could not find the requested order in your account history."
          actionLabel="View All Orders"
          actionLink={ROUTES.ORDERS}
        />
      )}
    </div>
  );
}
