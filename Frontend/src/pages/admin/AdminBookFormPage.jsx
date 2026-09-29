import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBookById } from '../../api/book.api';
import { createBook, updateBook } from '../../api/admin.api';
import { useToast } from '../../hooks/useToast';
import BookForm from '../../components/admin/BookForm';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { ROUTES } from '../../constants/routes';

export default function AdminBookFormPage() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [initialData, setInitialData] = useState(null);
  const [loadingBook, setLoadingBook] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchBook = async () => {
        try {
          setLoadingBook(true);
          setFetchError('');
          const res = await getBookById(id);
          setInitialData(res.data?.data || null);
        } catch (err) {
          setFetchError(
            err.response?.data?.message || 'Failed to load existing book data.'
          );
        } finally {
          setLoadingBook(false);
        }
      };
      fetchBook();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (isEditMode) {
        await updateBook(id, formData);
        addToast('Book updated successfully!', 'success');
      } else {
        await createBook(formData);
        addToast('New book published successfully!', 'success');
      }
      navigate(ROUTES.ADMIN_BOOKS);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-book-form-page">
      <div className="breadcrumb-nav">
        <Link to={ROUTES.ADMIN_BOOKS} className="breadcrumb-link">
          ← Back to Books Catalog
        </Link>
      </div>

      {loadingBook ? (
        <Spinner message="Loading book details for editing..." />
      ) : fetchError ? (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <ErrorMessage message={fetchError} />
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to={ROUTES.ADMIN_BOOKS} className="btn btn-secondary">
              Return to Catalog
            </Link>
          </div>
        </div>
      ) : (
        <BookForm
          initialData={initialData}
          onSubmit={handleSubmit}
          loading={saving}
        />
      )}
    </div>
  );
}
