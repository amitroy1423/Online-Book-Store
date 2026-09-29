import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import './Admin.css';

export default function BookForm({ initialData = null, onSubmit, loading = false }) {
  const isEditMode = !!initialData;
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    author: initialData?.author || '',
    category: initialData?.category || '',
    price: initialData?.price !== undefined ? initialData.price : '',
    description: initialData?.description || '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.image || null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB.');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setError('Image must be a JPEG, PNG, or WebP file.');
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Book title is required.');
      return;
    }

    if (!formData.author.trim()) {
      setError('Author name is required.');
      return;
    }

    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
      setError('Please provide a valid non-negative price.');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title.trim());
    data.append('author', formData.author.trim());
    data.append('price', Number(formData.price));

    if (formData.description.trim()) {
      data.append('description', formData.description.trim());
    }

    if (formData.category.trim()) {
      data.append('category', formData.category.trim());
    }

    if (selectedFile) {
      data.append('image', selectedFile);
    }

    try {
      await onSubmit(data);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.errors ? err.response.data.errors.join(', ') : 'Failed to save book.');
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="book-form card" noValidate>
      <h2 className="form-title">
        {isEditMode ? 'Edit Book Details' : 'Add New Book to Catalog'}
      </h2>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-grid">
        <div className="form-group span-2">
          <label className="form-label" htmlFor="title">
            Book Title <span className="required-star">*</span>
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. The Alchemist"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="author">
            Author <span className="required-star">*</span>
          </label>
          <input
            id="author"
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="e.g. Paulo Coelho"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="category">
            Category / Genre
          </label>
          <input
            id="category"
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Fiction, Self-Help, Science"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="price">
            Price (₹ INR) <span className="required-star">*</span>
          </label>
          <input
            id="price"
            type="number"
            name="price"
            min="0"
            step="1"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g. 399"
            className="form-input"
            required
          />
        </div>

        <div className="form-group span-2">
          <label className="form-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide a summary or blurb of the book..."
            className="form-textarea"
          />
        </div>

        {/* Cover Image Upload Section */}
        <div className="form-group span-2">
          <label className="form-label" htmlFor="image-file">
            Book Cover Image (Max 5MB • JPG, PNG, WebP)
          </label>
          
          <div className="image-upload-wrapper">
            <input
              id="image-file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="file-input-hidden"
            />

            {previewUrl ? (
              <div className="image-preview-container">
                <img
                  src={previewUrl}
                  alt="Cover preview"
                  className="image-preview"
                />
                <div className="image-preview-info">
                  <span className="image-status-text">
                    {selectedFile ? `New file selected: ${selectedFile.name}` : 'Current Cover Image'}
                  </span>
                  <div className="image-preview-btns">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Cover
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={handleRemoveImage}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="upload-dropzone"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="upload-icon">📷</span>
                <span className="upload-title">Click to browse and upload cover image</span>
                <span className="upload-subtitle">Uploaded securely via ImageKit</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(ROUTES.ADMIN_BOOKS)}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving Book...' : isEditMode ? 'Update Book' : 'Publish Book'}
        </button>
      </div>
    </form>
  );
}
