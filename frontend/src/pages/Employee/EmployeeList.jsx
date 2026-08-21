import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { employeeService } from "../../services/employeeService";
import { departmentService, positionService } from "../../services/departmentService";
import { extractErrorMessage } from "../../services/api";
import Banner from "../../components/Banner";
import EmptyState from "../../components/EmptyState";
import StatusStamp from "../../components/StatusStamp";
import EmployeeForm from "./EmployeeForm";

export default function EmployeeList() {
  const { user } = useAuth();
  const isAdmin = user.role === "ADMIN";

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [nameFilter, setNameFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([employeeService.getAll(), departmentService.getAll(), positionService.getAll()])
      .then(([eRes, dRes, pRes]) => {
        setEmployees(eRes.data);
        setDepartments(dRes.data);
        setPositions(pRes.data);
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const runSearch = async () => {
    setError("");
    try {
      const res = await employeeService.search({
        name: nameFilter || undefined,
        departmentId: deptFilter || undefined,
      });
      setEmployees(res.data);
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (emp) => {
    setEditing(emp);
    setFormOpen(true);
  };

  const handleSubmit = async (payload) => {
    setError("");
    try {
      if (editing) {
        await employeeService.update(editing.employeeId, payload);
      } else {
        await employeeService.create(payload);
      }
      setFormOpen(false);
      load();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const handleDeactivate = async (id) => {
    if (!confirm("Deactivate this employee? They will no longer be able to sign in.")) return;
    setError("");
    try {
      await employeeService.deactivate(id);
      load();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Permanently delete this employee record and their login? This cannot be undone.")) return;
    setError("");
    try {
      await employeeService.remove(id);
      load();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  if (loading) return <div className="loading-row">Loading&hellip;</div>;

  return (
    <div>
      <Banner type="error">{error}</Banner>

      <div className="toolbar">
        <div className="search-row">
          <input
            placeholder="Search by name\u2026"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
          />
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>
            ))}
          </select>
          <button className="btn btn--ghost btn--sm" onClick={runSearch}>Search</button>
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => { setNameFilter(""); setDeptFilter(""); load(); }}
          >
            Reset
          </button>
        </div>
        {isAdmin && <button className="btn" onClick={openNew}>+ New employee</button>}
      </div>

      <div className="card">
        <div className="table-wrap">
          {employees.length === 0 ? (
            <EmptyState title="No employees found" message="Try adjusting your search, or add a new employee." />
          ) : (
            <table className="ledger">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Joined</th>
                  <th>Status</th>
                  {isAdmin && <th></th>}
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.employeeId}>
                    <td>
                      <strong>{emp.firstName} {emp.lastName}</strong>
                      <div style={{ color: "var(--ink-500)", fontSize: 12 }}>{emp.email}</div>
                    </td>
                    <td>{emp.role}</td>
                    <td>{emp.departmentName || "\u2014"}</td>
                    <td>{emp.positionTitle || "\u2014"}</td>
                    <td className="mono">{emp.joinedDate}</td>
                    <td><StatusStamp status={emp.status} /></td>
                    {isAdmin && (
                      <td>
                        <div className="btn-row">
                          <button className="btn btn--ghost btn--sm" onClick={() => openEdit(emp)}>Edit</button>
                          {emp.status === "ACTIVE" && (
                            <button className="btn btn--ghost btn--sm" onClick={() => handleDeactivate(emp.employeeId)}>
                              Deactivate
                            </button>
                          )}
                          <button className="btn btn--danger btn--sm" onClick={() => handleDelete(emp.employeeId)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {formOpen && (
        <EmployeeForm
          employee={editing}
          departments={departments}
          positions={positions}
          onSubmit={handleSubmit}
          onClose={() => setFormOpen(false)}
        />
      )}
    </div>
  );
}
