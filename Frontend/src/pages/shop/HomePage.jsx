import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBooks } from '../../api/book.api';
import BookGrid from '../../components/book/BookGrid';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { ROUTES } from '../../constants/routes';
import './Shop.css';

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getAllBooks();
      setBooks(res.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load books. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const featuredBooks = books.slice(0, 8);

  return (
    <div className="home-page container">
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-tag">✨ Welcome to BookNest</span>
          <h1 className="hero-title">
            Discover Your Next <br />
            <span className="hero-highlight">Favorite Story</span>
          </h1>
          <p className="hero-description">
            Explore thousands of bestselling titles across fiction, science,
            self-growth, and academic disciplines. Delivered straight to your
            doorstep with Cash on Delivery.
          </p>
          <div className="hero-actions">
            <Link to={ROUTES.BOOKS} className="btn btn-primary btn-lg">
              Explore All Books →
            </Link>
            <Link to={ROUTES.CART} className="btn btn-secondary btn-lg">
              View Cart
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card-stack">
            <div className="hero-stack-item item-1">📚 Best-Sellers</div>
            <div className="hero-stack-item item-2">🚚 Fast COD Delivery</div>
            <div className="hero-stack-item item-3">⭐ 100% Genuine Books</div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="features-strip">
        <div className="feature-item">
          <span className="feature-icon">📦</span>
          <div>
            <h4>Cash on Delivery</h4>
            <p>Pay comfortably when your books arrive</p>
          </div>
        </div>
        <div className="feature-item">
          <span className="feature-icon">⚡</span>
          <div>
            <h4>Fast Delivery</h4>
            <p>Direct doorstep dispatch on all orders</p>
          </div>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🛡️</span>
          <div>
            <h4>Curated Quality</h4>
            <p>Handpicked catalog from top authors</p>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="featured-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">New & Featured Releases</h2>
            <p className="section-subtitle">
              Browse our newest additions and popular reads
            </p>
          </div>
          <Link to={ROUTES.BOOKS} className="btn btn-secondary">
            View All ({books.length}) →
          </Link>
        </div>

        {loading ? (
          <Spinner message="Loading bookstore catalog..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchBooks} />
        ) : featuredBooks.length > 0 ? (
          <BookGrid books={featuredBooks} />
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📖</div>
            <h3>No books available yet</h3>
            <p>Check back later or sign in as admin to add books to the catalog.</p>
          </div>
        )}
      </section>
    </div>
  );
}
