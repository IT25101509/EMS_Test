import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="empty-state" style={{ paddingTop: 100 }}>
      <h4>Page not found</h4>
      <p>That record doesn't exist in this system.</p>
      <Link className="btn" to="/">Back to dashboard</Link>
    </div>
  );
}
