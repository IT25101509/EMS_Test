import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { payrollService } from "../../services/payrollService";
import { employeeService } from "../../services/employeeService";
import { extractErrorMessage } from "../../services/api";
import Banner from "../../components/Banner";
import EmptyState from "../../components/EmptyState";
import StatusStamp from "../../components/StatusStamp";
import Drawer from "../../components/Drawer";

const emptyForm = {
  employeeId: "",
  basicSalary: "",
  allowances: "0",
  deductions: "0",
  payPeriodStart: "",
  payPeriodEnd: "",
};

export default function PayrollPage() {
  const { user, employeeProfile } = useAuth();
  const isAdmin = user.role === "ADMIN";
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
      ? payrollService.getAll()
      : employeeProfile
      ? payrollService.getByEmployee(employeeProfile.employeeId)
      : Promise.resolve({ data: [] });

    request
      .then((res) => setRecords(res.data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));

    if (isAdmin) {
      employeeService.getAll().then((res) => setEmployees(res.data)).catch(() => {});
    }
  };

  useEffect(load, [isStaff, isAdmin, employeeProfile]);

  const openNew = () => {
    setForm({ ...emptyForm, employeeId: employees[0]?.employeeId || "" });
    setFormOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await payrollService.create({
        ...form,
        employeeId: Number(form.employeeId),
        basicSalary: Number(form.basicSalary),
        allowances: Number(form.allowances || 0),
        deductions: Number(form.deductions || 0),
      });
      setFormOpen(false);
      load();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const markPaid = async (id) => {
    setError("");
    try {
      await payrollService.markPaid(id);
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
        {isAdmin && (
          <button className="btn" onClick={openNew} disabled={employees.length === 0}>
            + New payroll record
          </button>
        )}
      </div>

      <div className="card">
        <div className="card__header">
          <h3>{isStaff ? "Payroll records" : "Your payslips"}</h3>
        </div>
        <div className="table-wrap">
          {loading ? (
            <div className="loading-row">Loading&hellip;</div>
          ) : records.length === 0 ? (
            <EmptyState title="No payroll records" message="Nothing has been generated yet." />
          ) : (
            <table className="ledger">
              <thead>
                <tr>
                  {isStaff && <th>Employee</th>}
                  <th>Pay period</th>
                  <th>Basic</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net salary</th>
                  <th>Status</th>
                  {isAdmin && <th></th>}
                </tr>
              </thead>
              <tbody>
                {records.map((p) => (
                  <tr key={p.payrollId}>
                    {isStaff && <td>{p.employeeName}</td>}
                    <td className="mono">{p.payPeriodStart} &rarr; {p.payPeriodEnd}</td>
                    <td className="mono">{p.basicSalary?.toFixed(2)}</td>
                    <td className="mono">{p.allowances?.toFixed(2)}</td>
                    <td className="mono">{p.deductions?.toFixed(2)}</td>
                    <td className="mono"><strong>{p.netSalary?.toFixed(2)}</strong></td>
                    <td><StatusStamp status={p.paymentStatus} /></td>
                    {isAdmin && (
                      <td>
                        {p.paymentStatus === "PENDING" && (
                          <button className="btn btn--ghost btn--sm" onClick={() => markPaid(p.payrollId)}>
                            Mark paid
                          </button>
                        )}
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
        <Drawer title="New payroll record" onClose={() => setFormOpen(false)}>
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
                <label htmlFor="basicSalary">Basic salary</label>
                <input id="basicSalary" type="number" step="0.01" min="0" value={form.basicSalary} onChange={(e) => setForm({ ...form, basicSalary: e.target.value })} required />
              </div>
              <div className="field">
                <label htmlFor="allowances">Allowances</label>
                <input id="allowances" type="number" step="0.01" min="0" value={form.allowances} onChange={(e) => setForm({ ...form, allowances: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="deductions">Deductions</label>
                <input id="deductions" type="number" step="0.01" min="0" value={form.deductions} onChange={(e) => setForm({ ...form, deductions: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="payPeriodStart">Pay period start</label>
                <input id="payPeriodStart" type="date" value={form.payPeriodStart} onChange={(e) => setForm({ ...form, payPeriodStart: e.target.value })} required />
              </div>
              <div className="field">
                <label htmlFor="payPeriodEnd">Pay period end</label>
                <input id="payPeriodEnd" type="date" value={form.payPeriodEnd} onChange={(e) => setForm({ ...form, payPeriodEnd: e.target.value })} required />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn--ghost" onClick={() => setFormOpen(false)}>Cancel</button>
              <button type="submit" className="btn">Create record</button>
            </div>
          </form>
        </Drawer>
      )}
    </div>
  );
}
