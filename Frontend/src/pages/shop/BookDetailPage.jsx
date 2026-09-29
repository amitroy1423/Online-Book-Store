import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookById } from '../../api/book.api';
import BookDetails from '../../components/book/BookDetails';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { ROUTES } from '../../constants/routes';
import './Shop.css';

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBook = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getBookById(id);
      setBook(res.data?.data || null);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load book details.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  return (
    <div className="book-detail-page container">
      <div className="breadcrumb-nav">
        <Link to={ROUTES.BOOKS} className="breadcrumb-link">
          ← Back to Catalog
        </Link>
      </div>

      {loading ? (
        <Spinner message="Loading book details..." />
      ) : error ? (
        <div className="detail-error-wrapper">
          <ErrorMessage message={error} onRetry={fetchBook} />
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to={ROUTES.BOOKS} className="btn btn-secondary">
              Browse Other Books
            </Link>
          </div>
        </div>
      ) : book ? (
        <BookDetails book={book} />
      ) : (
        <EmptyState
          icon="📕"
          title="Book Not Found"
          description="The book you are looking for does not exist or has been removed."
          actionLabel="Return to Catalog"
          actionLink={ROUTES.BOOKS}
        />
      )}
    </div>
  );
}
