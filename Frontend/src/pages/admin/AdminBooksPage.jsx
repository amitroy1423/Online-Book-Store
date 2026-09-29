import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllBooks } from '../../api/book.api';
import { deleteBook } from '../../api/admin.api';
import { useToast } from '../../hooks/useToast';
import ConfirmModal from '../../components/common/ConfirmModal';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { ROUTES } from '../../constants/routes';
import { formatCurrency } from '../../utils/formatters';
import './AdminPages.css';

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { addToast } = useToast();

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getAllBooks();
      setBooks(res.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load bookstore catalog.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);
      await deleteBook(deleteTarget._id);
      setBooks((prev) => prev.filter((b) => b._id !== deleteTarget._id));
      addToast(`Book "${deleteTarget.title}" deleted successfully.`, 'success');
      setDeleteTarget(null);
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to delete book. Please try again.';
      addToast(msg, 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter books
  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;
    const q = searchQuery.toLowerCase().trim();
    return books.filter(
      (b) =>
        b.title?.toLowerCase().includes(q) ||
        b.author?.toLowerCase().includes(q) ||
        b.category?.toLowerCase().includes(q)
    );
  }, [books, searchQuery]);

  return (
    <div className="admin-books-page">
      <div className="admin-page-header">
        <div>
          <h1>Books Management</h1>
          <p>Create, modify, update cover images, or delete catalog titles</p>
        </div>
        <div className="admin-header-actions">
          <Link to={ROUTES.ADMIN_BOOK_NEW} className="btn btn-primary">
            + Add New Book
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar card">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search catalog books by title, author, or category..."
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
        <div className="admin-filter-meta">
          <span>
            Total: <strong>{filteredBooks.length}</strong> {filteredBooks.length === 1 ? 'book' : 'books'}
          </span>
        </div>
      </div>

      {loading ? (
        <Spinner message="Loading catalog books..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchBooks} />
      ) : filteredBooks.length > 0 ? (
        <div className="card admin-table-card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title & Author</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book._id}>
                    <td>
                      <div className="admin-book-thumb">
                        {book.image ? (
                          <img src={book.image} alt={book.title} />
                        ) : (
                          <span>📖</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        <Link
                          to={`/books/${book._id}`}
                          className="admin-book-title-link"
                          target="_blank"
                          title="Preview in public store"
                        >
                          <strong>{book.title}</strong>
                        </Link>
                        <div className="text-muted-xs">by {book.author}</div>
                      </div>
                    </td>
                    <td>
                      {book.category ? (
                        <span className="badge badge-info">{book.category}</span>
                      ) : (
                        <span className="text-muted-xs">—</span>
                      )}
                    </td>
                    <td>
                      <strong>{formatCurrency(book.price)}</strong>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-action-btns">
                        <Link
                          to={`/admin/books/${book._id}/edit`}
                          className="btn btn-secondary btn-sm"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteTarget(book)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon="📚"
          title="No Books Found"
          description={
            searchQuery
              ? 'No books match your current search query.'
              : 'There are currently no books in the catalog. Add your first book now!'
          }
          actionLabel={searchQuery ? 'Clear Search' : '+ Add New Book'}
          actionLink={searchQuery ? null : ROUTES.ADMIN_BOOK_NEW}
          onAction={searchQuery ? () => setSearchQuery('') : null}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Book"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete Book"
        cancelText="Cancel"
        isDanger={true}
        isLoading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
