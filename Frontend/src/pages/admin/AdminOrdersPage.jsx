import { useState, useEffect, useMemo } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api/admin.api';
import { useToast } from '../../hooks/useToast';
import OrderStatusBadge from '../../components/admin/OrderStatusBadge';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './AdminPages.css';

const STATUS_OPTIONS = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null); // for detail modal
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const { addToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getAllOrders();
      setOrders(res.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load customer orders.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const res = await updateOrderStatus(orderId, newStatus);
      const updated = res.data?.data;

      // Update state in orders list
      setOrders((prev) =>
        prev.map((ord) =>
          ord._id === orderId ? { ...ord, status: updated?.status || newStatus } : ord
        )
      );

      // If currently viewing in detail modal, update that as well
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          status: updated?.status || newStatus,
        }));
      }

      addToast(`Order #${orderId.substring(orderId.length - 6)} status updated to "${newStatus}".`, 'success');
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to update order status.';
      addToast(msg, 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o._id?.toLowerCase().includes(q) ||
          o.user?.name?.toLowerCase().includes(q) ||
          o.user?.email?.toLowerCase().includes(q) ||
          o.shippingAddress?.fullName?.toLowerCase().includes(q) ||
          o.shippingAddress?.phone?.toLowerCase().includes(q) ||
          o.shippingAddress?.city?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [orders, statusFilter, searchQuery]);

  return (
    <div className="admin-orders-page">
      <div className="admin-page-header">
        <div>
          <h1>Orders Fulfillment & Management</h1>
          <p>Track customer purchases and update dispatch status</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={fetchOrders}
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="admin-filter-bar card">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search by customer name, email, phone, city, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="status-filter-pills">
          <button
            type="button"
            className={`pill-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All ({orders.length})
          </button>
          {STATUS_OPTIONS.map((status) => {
            const count = orders.filter((o) => o.status === status).length;
            return (
              <button
                key={status}
                type="button"
                className={`pill-btn pill-${status} ${statusFilter === status ? 'active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <Spinner message="Loading customer orders..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchOrders} />
      ) : filteredOrders.length > 0 ? (
        <div className="card admin-table-card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Info</th>
                  <th>Delivery Location</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Change Status</th>
                  <th style={{ textAlign: 'right' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <div>
                        <strong className="monospace-id">
                          #{order._id.substring(order._id.length - 8)}
                        </strong>
                        <div className="text-muted-xs">
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{order.shippingAddress?.fullName || order.user?.name || 'Customer'}</strong>
                        <div className="text-muted-xs">{order.user?.email}</div>
                        <div className="text-muted-xs">📞 {order.shippingAddress?.phone}</div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <span>{order.shippingAddress?.city}, {order.shippingAddress?.state}</span>
                        <div className="text-muted-xs">PIN: {order.shippingAddress?.pincode}</div>
                      </div>
                    </td>
                    <td>
                      <span className="order-items-count-badge">
                        {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                      </span>
                    </td>
                    <td>
                      <div>
                        <strong>{formatCurrency(order.totalAmount)}</strong>
                        <div className="text-muted-xs">Cash on Delivery</div>
                      </div>
                    </td>
                    <td>
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td>
                      <select
                        className="form-select status-select-dropdown"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingOrderId === order._id}
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st.charAt(0).toUpperCase() + st.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Full
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon="📦"
          title="No Orders Found"
          description={
            statusFilter !== 'all' || searchQuery
              ? 'No customer orders match the selected filters or search keyword.'
              : 'There are currently no customer orders in the system.'
          }
          actionLabel={statusFilter !== 'all' || searchQuery ? 'Clear Filters' : null}
          onAction={() => {
            setStatusFilter('all');
            setSearchQuery('');
          }}
        />
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="overlay" onClick={() => setSelectedOrder(null)}>
          <div
            className="dialog admin-order-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Order Details</h2>
                <p className="monospace-id">ID: #{selectedOrder._id}</p>
                <p className="text-muted-xs">Placed on: {formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section status-management-strip">
                <span className="status-label">Update Status:</span>
                <select
                  className="form-select status-select-dropdown"
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                  disabled={updatingOrderId === selectedOrder._id}
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st.charAt(0).toUpperCase() + st.slice(1)}
                    </option>
                  ))}
                </select>
                <OrderStatusBadge status={selectedOrder.status} />
              </div>

              {/* Customer & Delivery Address */}
              <div className="modal-section modal-two-col">
                <div className="modal-info-box">
                  <h4>Customer Account</h4>
                  <p><strong>Name:</strong> {selectedOrder.user?.name || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedOrder.user?.email || 'N/A'}</p>
                  <p><strong>Payment:</strong> Cash on Delivery (COD)</p>
                </div>
                <div className="modal-info-box">
                  <h4>Shipping Destination</h4>
                  <p><strong>Recipient:</strong> {selectedOrder.shippingAddress?.fullName}</p>
                  <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
                  <p><strong>Street:</strong> {selectedOrder.shippingAddress?.address}</p>
                  <p><strong>City/State:</strong> {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="modal-section">
                <h4>Purchased Items</h4>
                <div className="modal-items-list">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="modal-item-row">
                      <div className="modal-item-thumb">
                        {item.book?.image ? (
                          <img src={item.book.image} alt={item.title} />
                        ) : (
                          <span>📖</span>
                        )}
                      </div>
                      <div className="modal-item-details">
                        <span className="modal-item-title">{item.title}</span>
                        {item.book?.author && (
                          <span className="text-muted-xs">by {item.book.author}</span>
                        )}
                        <span className="text-muted-xs">
                          {item.quantity} × {formatCurrency(item.price)}
                        </span>
                      </div>
                      <span className="modal-item-subtotal">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-total-bar">
                <span>Grand Total Due:</span>
                <span className="modal-grand-amount">
                  {formatCurrency(selectedOrder.totalAmount)}
                </span>
              </div>
            </div>

            <div className="dialog-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
