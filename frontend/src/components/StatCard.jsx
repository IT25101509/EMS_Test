export default function StatCard({ label, value, tone }) {
  return (
    <div className={`stat-card ${tone ? `stat-card--${tone}` : ""}`}>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value}</div>
    </div>
  );
}
