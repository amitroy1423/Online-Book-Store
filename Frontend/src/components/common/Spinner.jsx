export default function Spinner({ size = 'medium', message = '' }) {
  const sizeClass = size === 'small' ? 'spinner-sm' : size === 'large' ? 'spinner-lg' : '';
  return (
    <div className="spinner-container">
      <div className={`spinner ${sizeClass}`} />
      {message && <p className="spinner-message" style={{ marginTop: '0.75rem', color: 'var(--color-muted)' }}>{message}</p>}
    </div>
  );
}
