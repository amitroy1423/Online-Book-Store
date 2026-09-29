export default function OrderStatusBadge({ status }) {
  const normalized = status ? status.toLowerCase() : 'pending';
  return (
    <span className={`badge badge-${normalized}`}>
      {normalized}
    </span>
  );
}
