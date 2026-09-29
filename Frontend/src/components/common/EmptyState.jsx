import { Link } from 'react-router-dom';

export default function EmptyState({
  icon = '📚',
  title = 'No items found',
  description = 'There are no items to display at this time.',
  actionLabel,
  actionLink,
  onAction,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && actionLink && (
        <Link to={actionLink} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionLink && (
        <button type="button" onClick={onAction} className="btn btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
