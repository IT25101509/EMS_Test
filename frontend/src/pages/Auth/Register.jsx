import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { extractErrorMessage } from "../../services/api";
import Banner from "../../components/Banner";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  username: "",
  password: "",
  role: "ADMIN",
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__side">
        <span className="auth-page__eyebrow">First-time setup</span>
        <h1 className="auth-page__title">Open the first personnel file.</h1>
        <p className="auth-page__copy">
          Use this form once to create the system's initial Administrator account. After that,
          create Manager and Employee accounts from the Employees page &mdash; it links each
          login to a full employee record (department, position, join date).
        </p>
      </div>
      <div className="auth-page__form-side">
        <div className="auth-card">
          <h2>Create account</h2>
          <p className="auth-card__sub">Register a new user account.</p>
          <Banner type="error">{error}</Banner>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="firstName">First name</label>
              <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="field">
              <label htmlFor="lastName">Last name</label>
              <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="field">
              <label htmlFor="phoneNumber">Phone number</label>
              <input id="phoneNumber" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="username">Username</label>
              <input id="username" name="username" value={form.username} onChange={handleChange} required />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" value={form.role} onChange={handleChange}>
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="EMPLOYEE">Employee</option>
              </select>
            </div>
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? "Creating\u2026" : "Create account"}
            </button>
          </form>
          <div className="auth-card__switch">
            Already have an account? <button onClick={() => navigate("/login")}>Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
}
