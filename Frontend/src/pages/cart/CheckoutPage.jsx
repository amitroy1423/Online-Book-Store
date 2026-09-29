import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { createOrder } from '../../api/order.api';
import { ROUTES } from '../../constants/routes';
import { formatCurrency } from '../../utils/formatters';
import './CartPages.css';

export default function CheckoutPage() {
  const { items, totalItems, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If cart is empty, redirect to cart page
  useEffect(() => {
    if (items.length === 0 && !loading) {
      navigate(ROUTES.CART, { replace: true });
    }
  }, [items, navigate, loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Validate fields
    const { fullName, phone, address, city, state, pincode } = shippingAddress;
    if (
      !fullName.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pincode.trim()
    ) {
      setError('Please fill in all shipping address fields.');
      return;
    }

    const payload = {
      items: items.map((item) => ({
        book: item._id,
        quantity: item.quantity,
      })),
      shippingAddress: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
      },
    };

    try {
      setLoading(true);
      setError('');
      const res = await createOrder(payload);
      const placedOrder = res.data?.data;

      // Clear local cart
      clearCart();

      addToast('Order placed successfully! Thank you for your purchase.', 'success');

      if (placedOrder?._id) {
        navigate(`/orders/${placedOrder._id}`, { replace: true });
      } else {
        navigate(ROUTES.ORDERS, { replace: true });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.errors ? err.response.data.errors.join(', ') : 'Failed to place order. Please try again.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="checkout-page container">
      <div className="page-header">
        <h1>Checkout & Order Placement</h1>
        <p>Complete your delivery address and confirm your Cash on Delivery order</p>
      </div>

      <div className="checkout-grid">
        {/* Shipping Address Form */}
        <div className="checkout-form-column">
          <form onSubmit={handlePlaceOrder} className="card checkout-card" noValidate>
            <h2 className="section-heading">📍 Shipping Address</h2>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-grid">
              <div className="form-group span-2">
                <label className="form-label" htmlFor="fullName">
                  Recipient Full Name <span className="required-star">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Das"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group span-2">
                <label className="form-label" htmlFor="phone">
                  Phone Number <span className="required-star">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number, e.g. 9876543210"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group span-2">
                <label className="form-label" htmlFor="address">
                  Delivery Street Address <span className="required-star">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  value={shippingAddress.address}
                  onChange={handleChange}
                  placeholder="Flat/House No., Building, Street, Landmark"
                  className="form-textarea"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="city">
                  City <span className="required-star">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  placeholder="e.g. Kolkata"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="state">
                  State <span className="required-star">*</span>
                </label>
                <input
                  id="state"
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleChange}
                  placeholder="e.g. West Bengal"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group span-2">
                <label className="form-label" htmlFor="pincode">
                  PIN Code <span className="required-star">*</span>
                </label>
                <input
                  id="pincode"
                  type="text"
                  name="pincode"
                  value={shippingAddress.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 700001"
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Payment Method Notice */}
            <div className="payment-method-box">
              <div className="payment-method-header">
                <span className="payment-icon">💵</span>
                <div>
                  <h4 className="payment-method-title">Payment Method: Cash on Delivery (COD)</h4>
                  <p className="payment-method-desc">
                    Pay in cash directly to the delivery person when your package is handed to you.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg place-order-btn"
              disabled={loading}
            >
              {loading ? 'Processing Order...' : `Place COD Order • ${formatCurrency(totalAmount)}`}
            </button>
          </form>
        </div>

        {/* Order Items Preview Sidebar */}
        <div className="checkout-summary-column">
          <div className="card checkout-summary-card">
            <h3 className="summary-title">Order Items ({totalItems})</h3>
            <div className="checkout-items-preview">
              {items.map((item) => (
                <div key={item._id} className="checkout-item-mini">
                  <div className="mini-thumb">
                    {item.image ? (
                      <img src={item.image} alt={item.title} />
                    ) : (
                      <span>📖</span>
                    )}
                  </div>
                  <div className="mini-info">
                    <span className="mini-title">{item.title}</span>
                    <span className="mini-qty">Qty: {item.quantity} × {formatCurrency(item.price)}</span>
                  </div>
                  <span className="mini-subtotal">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="checkout-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span className="text-success">FREE</span>
              </div>
              <div className="total-row-grand">
                <span>Total Due on Delivery:</span>
                <span className="grand-amount">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <div className="checkout-edit-cart">
              <Link to={ROUTES.CART} className="btn btn-secondary btn-block btn-sm">
                ← Edit Cart Items
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
