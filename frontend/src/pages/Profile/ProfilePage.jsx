import { useAuth } from "../../hooks/useAuth";
import StatusStamp from "../../components/StatusStamp";
import Banner from "../../components/Banner";

export default function ProfilePage() {
  const { user, employeeProfile } = useAuth();

  return (
    <div>
      <div className="card">
        <div className="card__header">
          <h3>Account information</h3>
        </div>
        <div className="card__body">
          <div className="form-grid">
            <Field label="Full name" value={user.fullName} />
            <Field label="Username" value={user.username} />
            <Field label="Role" value={user.role} />
            <Field label="User ID" value={user.userId} mono />
          </div>
        </div>
      </div>

      <div style={{ height: 20 }} />

      {employeeProfile ? (
        <div className="card">
          <div className="card__header">
            <h3>Employment details</h3>
          </div>
          <div className="card__body">
            <div className="form-grid">
              <Field label="Email" value={employeeProfile.email} />
              <Field label="Phone" value={employeeProfile.phoneNumber || "\u2014"} />
              <Field label="Department" value={employeeProfile.departmentName || "\u2014"} />
              <Field label="Position" value={employeeProfile.positionTitle || "\u2014"} />
              <Field label="Joined date" value={employeeProfile.joinedDate} mono />
              <div className="field">
                <label>Status</label>
                <div style={{ marginTop: 2 }}>
                  <StatusStamp status={employeeProfile.status} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Banner type="error">
          No employee record is linked to this account. Ask an administrator to create one under
          Employees.
        </Banner>
      )}
    </div>
  );
}

function Field({ label, value, mono }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className={mono ? "mono" : ""} style={{ padding: "9px 0" }}>{value}</div>
    </div>
  );
}
