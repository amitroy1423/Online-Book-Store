import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function NotFoundPage() {
  return (
    <div className="empty-state container" style={{ padding: '4rem 1rem' }}>
      <div className="empty-state-icon" style={{ fontSize: '4rem' }}>🗺️</div>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>404 — Page Not Found</h1>
      <p style={{ maxWidth: '480px', margin: '0 auto 1.5rem', color: 'var(--color-muted)' }}>
        Sorry, the page you are looking for does not exist, has been removed, or is temporarily unavailable.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        <Link to={ROUTES.HOME} className="btn btn-primary">
          Back to Home
        </Link>
        <Link to={ROUTES.BOOKS} className="btn btn-secondary">
          Browse Catalog
        </Link>
      </div>
    </div>
  );
}
