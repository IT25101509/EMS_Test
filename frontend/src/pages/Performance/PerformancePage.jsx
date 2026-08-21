import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { performanceService } from "../../services/performanceService";
import { employeeService } from "../../services/employeeService";
import { extractErrorMessage } from "../../services/api";
import Banner from "../../components/Banner";
import EmptyState from "../../components/EmptyState";
import Drawer from "../../components/Drawer";

const emptyForm = { employeeId: "", evaluationDate: new Date().toISOString().slice(0, 10), performanceScore: "", comments: "" };

export default function PerformancePage() {
  const { user, employeeProfile } = useAuth();
  const isStaff = user.role === "ADMIN" || user.role === "MANAGER";

  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    setLoading(true);
    const request = isStaff
      ? performanceService.getAll()
      : employeeProfile
      ? performanceService.getByEmployee(employeeProfile.employeeId)
      : Promise.resolve({ data: [] });

    request
      .then((res) => setRecords(res.data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));

    if (isStaff) {
      employeeService.getAll().then((res) => setEmployees(res.data)).catch(() => {});
    }
  };

  useEffect(load, [isStaff, employeeProfile]);

  const openNew = () => {
    setForm({ ...emptyForm, employeeId: employees[0]?.employeeId || "" });
    setFormOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await performanceService.create({
        ...form,
        employeeId: Number(form.employeeId),
        performanceScore: Number(form.performanceScore),
        evaluatedByUserId: user.userId,
      });
      setFormOpen(false);
      load();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  return (
    <div>
      <Banner type="error">{error}</Banner>

      <div className="toolbar">
        <div />
        {isStaff && (
          <button className="btn" onClick={openNew} disabled={employees.length === 0}>
            + New evaluation
          </button>
        )}
      </div>

      <div className="card">
        <div className="card__header">
          <h3>{isStaff ? "Performance evaluations" : "Your performance history"}</h3>
        </div>
        <div className="table-wrap">
          {loading ? (
            <div className="loading-row">Loading&hellip;</div>
          ) : records.length === 0 ? (
            <EmptyState title="No evaluations yet" message="Performance records will appear here once created." />
          ) : (
            <table className="ledger">
              <thead>
                <tr>
                  {isStaff && <th>Employee</th>}
                  <th>Date</th>
                  <th>Score</th>
                  <th>Comments</th>
                  <th>Evaluated by</th>
                </tr>
              </thead>
              <tbody>
                {records.map((p) => (
                  <tr key={p.performanceId}>
                    {isStaff && <td>{p.employeeName}</td>}
                    <td className="mono">{p.evaluationDate}</td>
                    <td className="mono"><strong>{p.performanceScore}</strong> / 100</td>
                    <td>{p.comments || "\u2014"}</td>
                    <td>{p.evaluatedByName || "\u2014"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {formOpen && (
        <Drawer title="New performance evaluation" onClose={() => setFormOpen(false)}>
          <form onSubmit={submit}>
            <div className="form-grid form-grid--full">
              <div className="field">
                <label htmlFor="employeeId">Employee</label>
                <select id="employeeId" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required>
                  {employees.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="evaluationDate">Evaluation date</label>
                <input id="evaluationDate" type="date" value={form.evaluationDate} onChange={(e) => setForm({ ...form, evaluationDate: e.target.value })} required />
              </div>
              <div className="field">
                <label htmlFor="performanceScore">Score (0&ndash;100)</label>
                <input id="performanceScore" type="number" min="0" max="100" step="0.1" value={form.performanceScore} onChange={(e) => setForm({ ...form, performanceScore: e.target.value })} required />
              </div>
              <div className="field">
                <label htmlFor="comments">Comments</label>
                <textarea id="comments" value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn--ghost" onClick={() => setFormOpen(false)}>Cancel</button>
              <button type="submit" className="btn">Save evaluation</button>
            </div>
          </form>
        </Drawer>
      )}
    </div>
  );
}
