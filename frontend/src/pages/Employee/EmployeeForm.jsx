import { useState } from "react";
import Drawer from "../../components/Drawer";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  username: "",
  password: "",
  role: "EMPLOYEE",
  departmentId: "",
  positionId: "",
  joinedDate: new Date().toISOString().slice(0, 10),
};

export default function EmployeeForm({ employee, departments, positions, onSubmit, onClose }) {
  const [form, setForm] = useState(
    employee
      ? {
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phoneNumber: employee.phoneNumber || "",
          username: employee.username,
          password: "",
          role: employee.role,
          departmentId: employee.departmentId,
          positionId: employee.positionId,
          joinedDate: employee.joinedDate,
        }
      : { ...emptyForm, departmentId: departments[0]?.departmentId || "", positionId: "" }
  );

  const filteredPositions = positions.filter(
    (p) => String(p.departmentId) === String(form.departmentId)
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleDeptChange = (e) => {
    const departmentId = e.target.value;
    const firstPos = positions.find((p) => String(p.departmentId) === String(departmentId));
    setForm({ ...form, departmentId, positionId: firstPos ? firstPos.positionId : "" });
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      departmentId: Number(form.departmentId),
      positionId: Number(form.positionId),
    });
  };

  return (
    <Drawer title={employee ? "Edit employee" : "New employee"} onClose={onClose}>
      <form onSubmit={submit}>
        <div className="form-grid">
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
            <input id="username" name="username" value={form.username} onChange={handleChange} required disabled={!!employee} />
          </div>
          <div className="field">
            <label htmlFor="password">{employee ? "New password (optional)" : "Password"}</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required={!employee}
            />
          </div>
          <div className="field">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={form.role} onChange={handleChange}>
              <option value="EMPLOYEE">Employee</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="joinedDate">Joined date</label>
            <input id="joinedDate" type="date" name="joinedDate" value={form.joinedDate} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="departmentId">Department</label>
            <select id="departmentId" name="departmentId" value={form.departmentId} onChange={handleDeptChange} required>
              {departments.map((d) => (
                <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="positionId">Position</label>
            <select id="positionId" name="positionId" value={form.positionId} onChange={handleChange} required>
              {filteredPositions.map((p) => (
                <option key={p.positionId} value={p.positionId}>{p.title}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn">{employee ? "Save changes" : "Create employee"}</button>
        </div>
      </form>
    </Drawer>
  );
}
