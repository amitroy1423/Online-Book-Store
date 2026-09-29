import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import './Cart.css';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item._id, item.quantity - 1);
    } else {
      removeFromCart(item._id);
    }
  };

  const handleIncrease = () => {
    updateQuantity(item._id, item.quantity + 1);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="cart-item-row">
      <div className="cart-item-book">
        <Link to={`/books/${item._id}`} className="cart-item-image-wrapper">
          {item.image ? (
            <img src={item.image} alt={item.title} className="cart-item-image" />
          ) : (
            <div className="cart-item-placeholder">📖</div>
          )}
        </Link>
        <div className="cart-item-info">
          <Link to={`/books/${item._id}`} className="cart-item-title">
            {item.title}
          </Link>
          <span className="cart-item-author">by {item.author}</span>
          <span className="cart-item-unit-price">{formatCurrency(item.price)} each</span>
        </div>
      </div>

      <div className="cart-item-qty-cell">
        <div className="quantity-input-group">
          <button
            type="button"
            className="qty-btn"
            onClick={handleDecrease}
            title={item.quantity === 1 ? 'Remove from cart' : 'Decrease quantity'}
          >
            -
          </button>
          <span className="qty-value">{item.quantity}</span>
          <button
            type="button"
            className="qty-btn"
            onClick={handleIncrease}
            title="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="cart-item-subtotal-cell">
        <span className="cart-item-subtotal">{formatCurrency(itemTotal)}</span>
      </div>

      <div className="cart-item-remove-cell">
        <button
          type="button"
          className="cart-remove-btn"
          onClick={() => removeFromCart(item._id)}
          title="Remove from cart"
          aria-label="Remove item"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
