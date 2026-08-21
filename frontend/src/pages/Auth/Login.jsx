import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { extractErrorMessage } from "../../services/api";
import Banner from "../../components/Banner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.username, form.password);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__side">
        <span className="auth-page__eyebrow">SE2030 &middot; Group 2026&#8209;Y2&#8209;S1&#8209;MLB&#8209;B10G1&#8209;05</span>
        <h1 className="auth-page__title">Every record, every hour, one ledger.</h1>
        <p className="auth-page__copy">
          Sign in to manage employee profiles, attendance, leave, payroll, and performance from
          a single centralized system.
        </p>
      </div>
      <div className="auth-page__form-side">
        <div className="auth-card">
          <h2>Sign in</h2>
          <p className="auth-card__sub">Enter your username and password to access your account.</p>
          <Banner type="error">{error}</Banner>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? "Signing in\u2026" : "Sign in"}
            </button>
          </form>
          <div className="auth-card__switch">
            No account yet? <button onClick={() => navigate("/register")}>Register</button>
          </div>
        </div>
      </div>
    </div>
  );
}
