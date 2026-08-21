import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { attendanceService } from "../../services/attendanceService";
import { leaveService } from "../../services/leaveService";
import { extractErrorMessage } from "../../services/api";
import Banner from "../../components/Banner";
import StatusStamp from "../../components/StatusStamp";
import { Link } from "react-router-dom";

export default function EmployeeDashboard() {
  const { employeeProfile } = useAuth();
  const [todayRecord, setTodayRecord] = useState(null);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => {
    if (!employeeProfile) return;
    Promise.all([
      attendanceService.getByEmployee(employeeProfile.employeeId),
      leaveService.getByEmployee(employeeProfile.employeeId),
    ])
      .then(([attRes, leaveRes]) => {
        const today = new Date().toISOString().slice(0, 10);
        setTodayRecord(attRes.data.find((a) => a.date === today) || null);
        setRecentLeaves(leaveRes.data.slice(0, 5));
      })
      .catch((err) => setError(extractErrorMessage(err)));
  };

  useEffect(load, [employeeProfile]);

  if (!employeeProfile) {
    return (
      <Banner type="error">
        No employee record is linked to your account yet. Ask an administrator to create one.
      </Banner>
    );
  }

  const handleCheckIn = async () => {
    setBusy(true);
    setError("");
    try {
      await attendanceService.checkIn(employeeProfile.employeeId);
      load();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleCheckOut = async () => {
    setBusy(true);
    setError("");
    try {
      await attendanceService.checkOut(employeeProfile.employeeId);
      load();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Banner type="error">{error}</Banner>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card__header">
          <h3>Welcome back, {employeeProfile.firstName}</h3>
        </div>
        <div className="card__body">
          <p style={{ marginTop: 0, color: "var(--ink-500)" }}>
            {employeeProfile.positionTitle} &middot; {employeeProfile.departmentName}
          </p>
          {todayRecord ? (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span className="mono">
                Checked in {todayRecord.checkIn}
                {todayRecord.checkOut ? ` \u2014 out ${todayRecord.checkOut}` : ""}
              </span>
              <StatusStamp status={todayRecord.status} />
              {!todayRecord.checkOut && (
                <button className="btn btn--sm" onClick={handleCheckOut} disabled={busy}>
                  Check out
                </button>
              )}
            </div>
          ) : (
            <button className="btn" onClick={handleCheckIn} disabled={busy}>
              Check in for today
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card__header">
          <h3>Your recent leave requests</h3>
          <Link className="btn btn--ghost btn--sm" to="/leave">
            View all
          </Link>
        </div>
        <div className="table-wrap">
          {recentLeaves.length === 0 ? (
            <div className="empty-state">
              <h4>No leave requests yet</h4>
              <p>Apply for leave from the Leave page.</p>
            </div>
          ) : (
            <table className="ledger">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeaves.map((l) => (
                  <tr key={l.leaveId}>
                    <td>{l.leaveType}</td>
                    <td className="mono">{l.startDate} &rarr; {l.endDate}</td>
                    <td><StatusStamp status={l.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
