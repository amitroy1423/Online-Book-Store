import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { ROLES } from '../../constants/roles';
import { formatCurrency } from '../../utils/formatters';
import './Book.css';

export default function BookCard({ book }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  const isAdmin = user?.role === ROLES.ADMIN;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book);
    addToast(`"${book.title}" added to cart!`, 'success');
  };

  return (
    <div className="book-card card">
      <Link to={`/books/${book._id}`} className="book-card-image-link">
        <div className="book-card-image-wrapper">
          {book.image ? (
            <img
              src={book.image}
              alt={book.title}
              className="book-card-image"
              loading="lazy"
            />
          ) : (
            <div className="book-card-placeholder">
              <span className="placeholder-icon">📖</span>
              <span className="placeholder-text">No Cover Available</span>
            </div>
          )}
          {book.category && (
            <span className="book-category-tag">{book.category}</span>
          )}
        </div>
      </Link>

      <div className="book-card-content">
        <Link to={`/books/${book._id}`} className="book-card-title-link">
          <h3 className="book-card-title" title={book.title}>
            {book.title}
          </h3>
        </Link>
        <p className="book-card-author">by {book.author}</p>
        
        {book.description && (
          <p className="book-card-description">
            {book.description.length > 90
              ? `${book.description.substring(0, 90)}...`
              : book.description}
          </p>
        )}

        <div className="book-card-footer">
          <span className="book-card-price">{formatCurrency(book.price)}</span>
          {!isAdmin ? (
            <button
              type="button"
              className="btn btn-primary btn-sm book-add-btn"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          ) : (
            <Link
              to={`/admin/books/${book._id}/edit`}
              className="btn btn-secondary btn-sm"
            >
              Edit Book
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
