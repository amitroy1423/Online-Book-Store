import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { ROUTES } from '../../constants/routes';
import { formatCurrency } from '../../utils/formatters';
import './Cart.css';

export default function CartSummary({ showCheckoutBtn = true }) {
  const { totalItems, totalAmount, clearCart } = useCart();

  return (
    <div className="cart-summary card">
      <h3 className="cart-summary-title">Order Summary</h3>
      
      <div className="cart-summary-rows">
        <div className="summary-row">
          <span>Total Books:</span>
          <span className="summary-val">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
        </div>
        <div className="summary-row">
          <span>Subtotal:</span>
          <span className="summary-val">{formatCurrency(totalAmount)}</span>
        </div>
        <div className="summary-row">
          <span>Delivery Charges:</span>
          <span className="summary-val text-success">FREE</span>
        </div>
        <div className="summary-row">
          <span>Payment Method:</span>
          <span className="summary-val">Cash on Delivery</span>
        </div>
      </div>

      <div className="summary-divider" />

      <div className="summary-total-row">
        <span>Grand Total:</span>
        <span className="summary-total-val">{formatCurrency(totalAmount)}</span>
      </div>

      {showCheckoutBtn && totalItems > 0 && (
        <div className="cart-summary-actions">
          <Link to={ROUTES.CHECKOUT} className="btn btn-primary btn-block btn-lg">
            Proceed to Checkout →
          </Link>
          <button
            type="button"
            className="btn btn-secondary btn-block btn-sm"
            onClick={clearCart}
          >
            Clear Entire Cart
          </button>
        </div>
      )}
    </div>
  );
}
