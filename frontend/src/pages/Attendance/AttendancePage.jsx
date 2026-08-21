import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { attendanceService } from "../../services/attendanceService";
import { extractErrorMessage } from "../../services/api";
import Banner from "../../components/Banner";
import EmptyState from "../../components/EmptyState";
import StatusStamp from "../../components/StatusStamp";

export default function AttendancePage() {
  const { user, employeeProfile } = useAuth();
  const isStaff = user.role === "ADMIN" || user.role === "MANAGER";

  const [records, setRecords] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadStaffView = (d) => {
    setLoading(true);
    attendanceService
      .getByDate(d)
      .then((res) => setRecords(res.data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  const loadOwnView = () => {
    if (!employeeProfile) {
      setLoading(false);
      return;
    }
    setLoading(true);
    attendanceService
      .getByEmployee(employeeProfile.employeeId)
      .then((res) => setRecords(res.data.sort((a, b) => (a.date < b.date ? 1 : -1))))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isStaff) {
      loadStaffView(date);
    } else {
      loadOwnView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStaff, employeeProfile]);

  return (
    <div>
      <Banner type="error">{error}</Banner>

      {isStaff && (
        <div className="toolbar">
          <div className="search-row">
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              Date
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  loadStaffView(e.target.value);
                }}
              />
            </label>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card__header">
          <h3>{isStaff ? `Attendance \u2014 ${date}` : "Your attendance history"}</h3>
        </div>
        <div className="table-wrap">
          {loading ? (
            <div className="loading-row">Loading&hellip;</div>
          ) : records.length === 0 ? (
            <EmptyState title="No records" message="No attendance records found for this view." />
          ) : (
            <table className="ledger">
              <thead>
                <tr>
                  {isStaff && <th>Employee</th>}
                  <th>Date</th>
                  <th>Check in</th>
                  <th>Check out</th>
                  <th>Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.attendanceId}>
                    {isStaff && <td>{r.employeeName}</td>}
                    <td className="mono">{r.date}</td>
                    <td className="mono">{r.checkIn || "\u2014"}</td>
                    <td className="mono">{r.checkOut || "\u2014"}</td>
                    <td className="mono">{r.workHours ?? "\u2014"}</td>
                    <td><StatusStamp status={r.status} /></td>
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
