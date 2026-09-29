export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
      <span>⚠️ {message}</span>
      {onRetry && (
        <button className="btn btn-secondary btn-sm" onClick={onRetry} type="button">
          Try Again
        </button>
      )}
    </div>
  );
}
