import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { ROLES } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { formatCurrency } from '../../utils/formatters';
import './Book.css';

export default function BookDetails({ book }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, updateQuantity, items } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  const isAdmin = user?.role === ROLES.ADMIN;

  const handleAddToCart = () => {
    // Check if already in cart
    const existing = items.find((item) => item._id === book._id);
    if (existing) {
      updateQuantity(book._id, existing.quantity + quantity);
    } else {
      for (let i = 0; i < quantity; i++) {
        // If adding first time, add and then adjust if > 1
        if (i === 0) {
          addToCart(book);
        }
      }
      if (quantity > 1) {
        updateQuantity(book._id, quantity);
      }
    }
    addToast(`Added ${quantity} ${quantity === 1 ? 'copy' : 'copies'} of "${book.title}" to cart!`, 'success');
  };

  return (
    <div className="book-details-card card">
      <div className="book-details-grid">
        <div className="book-details-media">
          {book.image ? (
            <img
              src={book.image}
              alt={book.title}
              className="book-details-image"
            />
          ) : (
            <div className="book-details-placeholder">
              <span className="placeholder-icon">📖</span>
              <span className="placeholder-text">No Cover Available</span>
            </div>
          )}
        </div>

        <div className="book-details-info">
          <div className="book-details-meta">
            {book.category && (
              <span className="badge badge-info">{book.category}</span>
            )}
            <span className="book-details-id">ID: {book._id}</span>
          </div>

          <h1 className="book-details-title">{book.title}</h1>
          <p className="book-details-author">
            By <span className="author-name">{book.author}</span>
          </p>

          <div className="book-details-price-tag">
            <span className="price-label">Price:</span>
            <span className="price-value">{formatCurrency(book.price)}</span>
            <span className="price-tax">Includes all taxes • Cash on Delivery</span>
          </div>

          <div className="book-details-section">
            <h3>Description</h3>
            <p className="book-details-description">
              {book.description || 'No description provided for this book.'}
            </p>
          </div>

          {!isAdmin ? (
            <div className="book-details-actions">
              <div className="quantity-control">
                <label htmlFor="book-qty" className="quantity-label">
                  Quantity:
                </label>
                <div className="quantity-input-group">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    id="book-qty"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= 1) setQuantity(val);
                    }}
                    className="qty-input"
                  />
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-lg add-to-cart-btn"
                onClick={handleAddToCart}
              >
                🛒 Add to Cart ({formatCurrency(book.price * quantity)})
              </button>

              <Link to={ROUTES.CART} className="btn btn-secondary btn-lg">
                View Cart
              </Link>
            </div>
          ) : (
            <div className="book-details-actions">
              <Link
                to={`/admin/books/${book._id}/edit`}
                className="btn btn-primary btn-lg"
              >
                ✏️ Edit this Book in Admin
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
