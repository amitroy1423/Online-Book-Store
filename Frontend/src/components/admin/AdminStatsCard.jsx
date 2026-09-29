import './Admin.css';

export default function AdminStatsCard({ title, value, icon, color = 'primary', subtitle }) {
  return (
    <div className={`admin-stat-card card stat-${color}`}>
      <div className="stat-card-inner">
        <div className="stat-info">
          <span className="stat-title">{title}</span>
          <h2 className="stat-value">{value}</h2>
          {subtitle && <span className="stat-subtitle">{subtitle}</span>}
        </div>
        <div className="stat-icon-wrapper">
          <span className="stat-icon">{icon}</span>
        </div>
      </div>
    </div>
  );
}
