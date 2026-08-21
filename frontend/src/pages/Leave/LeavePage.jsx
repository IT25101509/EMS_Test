import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { leaveService } from "../../services/leaveService";
import { extractErrorMessage } from "../../services/api";
import Banner from "../../components/Banner";
import EmptyState from "../../components/EmptyState";
import StatusStamp from "../../components/StatusStamp";
import Drawer from "../../components/Drawer";

const emptyForm = { leaveType: "ANNUAL", startDate: "", endDate: "", reason: "" };

export default function LeavePage() {
  const { user, employeeProfile } = useAuth();
  const isStaff = user.role === "ADMIN" || user.role === "MANAGER";

  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    setLoading(true);
    const request = isStaff
      ? leaveService.getAll()
      : employeeProfile
      ? leaveService.getByEmployee(employeeProfile.employeeId)
      : Promise.resolve({ data: [] });

    request
      .then((res) => setLeaves(res.data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, [isStaff, employeeProfile]);

  const handleApply = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await leaveService.apply({ ...form, employeeId: employeeProfile.employeeId });
      setApplyOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const handleApprove = async (id) => {
    setError("");
    try {
      await leaveService.approve(id, "");
      load();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const handleReject = async (id) => {
    const comment = prompt("Reason for rejecting (optional):") || "";
    setError("");
    try {
      await leaveService.reject(id, comment);
      load();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const handleCancel = async (id) => {
    if (!confirm("Cancel this leave request?")) return;
    setError("");
    try {
      await leaveService.cancel(id);
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
        {!isStaff && (
          <button className="btn" onClick={() => setApplyOpen(true)} disabled={!employeeProfile}>
            + Apply for leave
          </button>
        )}
      </div>

      <div className="card">
        <div className="card__header">
          <h3>{isStaff ? "All leave requests" : "Your leave requests"}</h3>
        </div>
        <div className="table-wrap">
          {loading ? (
            <div className="loading-row">Loading&hellip;</div>
          ) : leaves.length === 0 ? (
            <EmptyState title="No leave requests" message={isStaff ? "No leave requests have been submitted yet." : "You haven't applied for leave yet."} />
          ) : (
            <table className="ledger">
              <thead>
                <tr>
                  {isStaff && <th>Employee</th>}
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((l) => (
                  <tr key={l.leaveId}>
                    {isStaff && <td>{l.employeeName}</td>}
                    <td>{l.leaveType}</td>
                    <td className="mono">{l.startDate} &rarr; {l.endDate}</td>
                    <td className="mono">{l.numberOfDays}</td>
                    <td>{l.reason || "\u2014"}</td>
                    <td><StatusStamp status={l.status} /></td>
                    <td>
                      <div className="btn-row">
                        {isStaff && l.status === "PENDING" && (
                          <>
                            <button className="btn btn--ghost btn--sm" onClick={() => handleApprove(l.leaveId)}>Approve</button>
                            <button className="btn btn--danger btn--sm" onClick={() => handleReject(l.leaveId)}>Reject</button>
                          </>
                        )}
                        {!isStaff && l.status === "PENDING" && (
                          <button className="btn btn--ghost btn--sm" onClick={() => handleCancel(l.leaveId)}>Cancel</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {applyOpen && (
        <Drawer title="Apply for leave" onClose={() => setApplyOpen(false)}>
          <form onSubmit={handleApply}>
            <div className="form-grid form-grid--full">
              <div className="field">
                <label htmlFor="leaveType">Leave type</label>
                <select id="leaveType" value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: e.target.value })}>
                  <option value="ANNUAL">Annual</option>
                  <option value="SICK">Sick</option>
                  <option value="CASUAL">Casual</option>
                  <option value="MATERNITY">Maternity</option>
                  <option value="PATERNITY">Paternity</option>
                  <option value="UNPAID">Unpaid</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="startDate">Start date</label>
                <input id="startDate" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
              </div>
              <div className="field">
                <label htmlFor="endDate">End date</label>
                <input id="endDate" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
              </div>
              <div className="field">
                <label htmlFor="reason">Reason</label>
                <textarea id="reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn--ghost" onClick={() => setApplyOpen(false)}>Cancel</button>
              <button type="submit" className="btn">Submit request</button>
            </div>
          </form>
        </Drawer>
      )}
    </div>
  );
}
