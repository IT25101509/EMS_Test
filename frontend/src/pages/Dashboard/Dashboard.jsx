import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { reportsService } from "../../services/reportsService";
import { attendanceService } from "../../services/attendanceService";
import { leaveService } from "../../services/leaveService";
import { extractErrorMessage } from "../../services/api";
import StatCard from "../../components/StatCard";
import Banner from "../../components/Banner";
import StatusStamp from "../../components/StatusStamp";
import EmployeeDashboard from "./EmployeeDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (user.role === "EMPLOYEE") {
    return <EmployeeDashboard />;
  }
  return <AdminManagerDashboard />;
}

function AdminManagerDashboard() {
  const [summary, setSummary] = useState(null);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([reportsService.getDashboard(), leaveService.getPending()])
      .then(([summaryRes, leavesRes]) => {
        setSummary(summaryRes.data);
        setPendingLeaves(leavesRes.data.slice(0, 6));
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-row">Loading dashboard&hellip;</div>;

  return (
    <div>
      <Banner type="error">{error}</Banner>

      <div className="stat-grid">
        <StatCard label="Total employees" value={summary.totalEmployees} />
        <StatCard label="Active employees" value={summary.activeEmployees} tone="green" />
        <StatCard label="Inactive employees" value={summary.inactiveEmployees} tone="amber" />
        <StatCard label="Present today" value={summary.presentToday} tone="green" />
        <StatCard label="On leave today" value={summary.employeesOnLeaveToday} tone="amber" />
        <StatCard label="Pending leave requests" value={summary.pendingLeaveRequests} tone="accent" />
        <StatCard label="Avg. performance score" value={summary.averagePerformanceScore} />
        <StatCard label="Departments" value={summary.totalDepartments} />
      </div>

      <div className="card">
        <div className="card__header">
          <h3>Recent pending leave requests</h3>
        </div>
        <div className="table-wrap">
          {pendingLeaves.length === 0 ? (
            <div className="empty-state">
              <h4>All caught up</h4>
              <p>There are no pending leave requests right now.</p>
            </div>
          ) : (
            <table className="ledger">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingLeaves.map((l) => (
                  <tr key={l.leaveId}>
                    <td>{l.employeeName}</td>
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
