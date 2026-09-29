import { useState, useEffect, useMemo } from 'react';
import { getAllBooks } from '../../api/book.api';
import BookGrid from '../../components/book/BookGrid';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import './Shop.css';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getAllBooks();
      setBooks(res.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load books catalog.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    books.forEach((b) => {
      if (b.category && b.category.trim()) {
        set.add(b.category.trim());
      }
    });
    return ['all', ...Array.from(set)];
  }, [books]);

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(
        (b) => b.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'title') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }
    // 'newest' is already default from backend sort

    return result;
  }, [books, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="books-page container">
      <div className="page-header">
        <h1>Bookstore Catalog</h1>
        <p>Browse our extensive collection of books across all genres</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="catalog-controls card">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search by title, author, or keyword..."
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

        <div className="filter-dropdowns">
          <div className="control-group">
            <label className="control-label" htmlFor="cat-filter">
              Category:
            </label>
            <select
              id="cat-filter"
              className="form-select control-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label className="control-label" htmlFor="sort-filter">
              Sort by:
            </label>
            <select
              id="sort-filter"
              className="form-select control-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {!loading && !error && (
        <div className="catalog-meta">
          <span>
            Showing <strong>{filteredBooks.length}</strong> of{' '}
            <strong>{books.length}</strong> books
          </span>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Catalog Grid */}
      {loading ? (
        <Spinner message="Loading catalog..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchBooks} />
      ) : filteredBooks.length > 0 ? (
        <BookGrid books={filteredBooks} />
      ) : (
        <EmptyState
          icon="🔍"
          title="No matching books found"
          description="Try adjusting your search keywords or category filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('all');
          }}
        />
      )}
    </div>
  );
}
