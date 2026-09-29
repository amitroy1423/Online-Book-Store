import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await login(formData);
      addToast('Logged in successfully!', 'success');

      // Check if user is admin
      if (response?.data?.role === ROLES.ADMIN) {
        navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
      } else {
        const from = location.state?.from?.pathname || ROUTES.BOOKS;
        navigate(from, { replace: true });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Failed to log in. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      <h2>Sign In</h2>

      {error && <div className="alert alert-error">{error}</div>}

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
          placeholder="you@example.com"
          className="form-input"
          required
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className="form-input"
          required
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block btn-lg"
        disabled={loading}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </button>

      <div className="auth-footer">
        Don't have an account? <Link to={ROUTES.REGISTER}>Create account</Link>
      </div>
    </form>
  );
}
