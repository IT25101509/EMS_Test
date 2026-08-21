import { useEffect, useState } from "react";
import { departmentService, positionService } from "../../services/departmentService";
import { extractErrorMessage } from "../../services/api";
import Banner from "../../components/Banner";
import Drawer from "../../components/Drawer";
import EmptyState from "../../components/EmptyState";

const emptyDept = { departmentName: "", description: "" };
const emptyPos = { title: "", description: "", departmentId: "" };

export default function DepartmentPage() {
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [deptDrawer, setDeptDrawer] = useState(false);
  const [deptForm, setDeptForm] = useState(emptyDept);
  const [editingDept, setEditingDept] = useState(null);

  const [posDrawer, setPosDrawer] = useState(false);
  const [posForm, setPosForm] = useState(emptyPos);
  const [editingPos, setEditingPos] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([departmentService.getAll(), positionService.getAll()])
      .then(([dRes, pRes]) => {
        setDepartments(dRes.data);
        setPositions(pRes.data);
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNewDept = () => {
    setEditingDept(null);
    setDeptForm(emptyDept);
    setDeptDrawer(true);
  };

  const openEditDept = (d) => {
    setEditingDept(d);
    setDeptForm({ departmentName: d.departmentName, description: d.description || "" });
    setDeptDrawer(true);
  };

  const submitDept = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingDept) {
        await departmentService.update(editingDept.departmentId, deptForm);
      } else {
        await departmentService.create(deptForm);
      }
      setDeptDrawer(false);
      load();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const removeDept = async (id) => {
    if (!confirm("Delete this department? Positions under it must be removed first.")) return;
    setError("");
    try {
      await departmentService.remove(id);
      load();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const openNewPos = () => {
    setEditingPos(null);
    setPosForm({ ...emptyPos, departmentId: departments[0]?.departmentId || "" });
    setPosDrawer(true);
  };

  const openEditPos = (p) => {
    setEditingPos(p);
    setPosForm({ title: p.title, description: p.description || "", departmentId: p.departmentId });
    setPosDrawer(true);
  };

  const submitPos = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...posForm, departmentId: Number(posForm.departmentId) };
      if (editingPos) {
        await positionService.update(editingPos.positionId, payload);
      } else {
        await positionService.create(payload);
      }
      setPosDrawer(false);
      load();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const removePos = async (id) => {
    if (!confirm("Delete this position?")) return;
    setError("");
    try {
      await positionService.remove(id);
      load();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  if (loading) return <div className="loading-row">Loading&hellip;</div>;

  return (
    <div>
      <Banner type="error">{error}</Banner>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card__header">
          <h3>Departments</h3>
          <button className="btn btn--sm" onClick={openNewDept}>+ New department</button>
        </div>
        <div className="table-wrap">
          {departments.length === 0 ? (
            <EmptyState title="No departments yet" message="Create your first department to get started." />
          ) : (
            <table className="ledger">
              <thead>
                <tr><th>Name</th><th>Description</th><th></th></tr>
              </thead>
              <tbody>
                {departments.map((d) => (
                  <tr key={d.departmentId}>
                    <td><strong>{d.departmentName}</strong></td>
                    <td>{d.description || "\u2014"}</td>
                    <td>
                      <div className="btn-row">
                        <button className="btn btn--ghost btn--sm" onClick={() => openEditDept(d)}>Edit</button>
                        <button className="btn btn--danger btn--sm" onClick={() => removeDept(d.departmentId)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card__header">
          <h3>Positions</h3>
          <button className="btn btn--sm" onClick={openNewPos} disabled={departments.length === 0}>+ New position</button>
        </div>
        <div className="table-wrap">
          {positions.length === 0 ? (
            <EmptyState title="No positions yet" message="Add a position and assign it to a department." />
          ) : (
            <table className="ledger">
              <thead>
                <tr><th>Title</th><th>Department</th><th>Description</th><th></th></tr>
              </thead>
              <tbody>
                {positions.map((p) => (
                  <tr key={p.positionId}>
                    <td><strong>{p.title}</strong></td>
                    <td>{p.departmentName}</td>
                    <td>{p.description || "\u2014"}</td>
                    <td>
                      <div className="btn-row">
                        <button className="btn btn--ghost btn--sm" onClick={() => openEditPos(p)}>Edit</button>
                        <button className="btn btn--danger btn--sm" onClick={() => removePos(p.positionId)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {deptDrawer && (
        <Drawer title={editingDept ? "Edit department" : "New department"} onClose={() => setDeptDrawer(false)}>
          <form onSubmit={submitDept}>
            <div className="form-grid form-grid--full">
              <div className="field">
                <label htmlFor="departmentName">Department name</label>
                <input
                  id="departmentName"
                  value={deptForm.departmentName}
                  onChange={(e) => setDeptForm({ ...deptForm, departmentName: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="deptDescription">Description</label>
                <textarea
                  id="deptDescription"
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn--ghost" onClick={() => setDeptDrawer(false)}>Cancel</button>
              <button type="submit" className="btn">{editingDept ? "Save changes" : "Create department"}</button>
            </div>
          </form>
        </Drawer>
      )}

      {posDrawer && (
        <Drawer title={editingPos ? "Edit position" : "New position"} onClose={() => setPosDrawer(false)}>
          <form onSubmit={submitPos}>
            <div className="form-grid form-grid--full">
              <div className="field">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  value={posForm.title}
                  onChange={(e) => setPosForm({ ...posForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="departmentId">Department</label>
                <select
                  id="departmentId"
                  value={posForm.departmentId}
                  onChange={(e) => setPosForm({ ...posForm, departmentId: e.target.value })}
                  required
                >
                  {departments.map((d) => (
                    <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="posDescription">Description</label>
                <textarea
                  id="posDescription"
                  value={posForm.description}
                  onChange={(e) => setPosForm({ ...posForm, description: e.target.value })}
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn--ghost" onClick={() => setPosDrawer(false)}>Cancel</button>
              <button type="submit" className="btn">{editingPos ? "Save changes" : "Create position"}</button>
            </div>
          </form>
        </Drawer>
      )}
    </div>
  );
}
