import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { ROUTES } from '../../constants/routes';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('All fields are required.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      addToast('Account created successfully! Welcome to BookNest.', 'success');
      navigate(ROUTES.BOOKS, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      <h2>Create Account</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label className="form-label" htmlFor="name">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Rahul Das"
          className="form-input"
          required
          autoComplete="name"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="email">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="rahul@example.com"
          className="form-input"
          required
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="password">
          Password (min. 6 characters)
        </label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Choose a strong password"
          className="form-input"
          required
          autoComplete="new-password"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block btn-lg"
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Register'}
      </button>

      <div className="auth-footer">
        Already have an account? <Link to={ROUTES.LOGIN}>Sign In</Link>
      </div>
    </form>
  );
}
