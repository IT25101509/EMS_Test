import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { to: "/employees", label: "Employees", roles: ["ADMIN", "MANAGER"] },
  { to: "/departments", label: "Departments & Positions", roles: ["ADMIN"] },
  { to: "/attendance", label: "Attendance", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { to: "/leave", label: "Leave", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { to: "/payroll", label: "Payroll", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { to: "/performance", label: "Performance", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { to: "/profile", label: "My Profile", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
];

const PAGE_TITLES = {
  "/": ["Overview", "Dashboard"],
  "/employees": ["Records", "Employees"],
  "/departments": ["Structure", "Departments & Positions"],
  "/attendance": ["Time & Presence", "Attendance"],
  "/leave": ["Time Off", "Leave Requests"],
  "/payroll": ["Compensation", "Payroll"],
  "/performance": ["Evaluations", "Performance & Reports"],
  "/profile": ["Personnel File", "My Profile"],
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const pathKey = Object.keys(PAGE_TITLES).find((key) =>
    key === "/" ? window.location.pathname === "/" : window.location.pathname.startsWith(key)
  ) || "/";
  const [eyebrow, title] = PAGE_TITLES[pathKey];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__brand-mark">Personnel</div>
          <div className="sidebar__brand-sub">Employee Mgmt. System</div>
        </div>
        <nav className="sidebar__nav">
          {NAV_ITEMS.filter((item) => item.roles.includes(user?.role)).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar__footer">
          <div className="sidebar__user">{user?.fullName}</div>
          <div className="sidebar__user-role">{user?.role}</div>
          <button className="sidebar__logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <div>
            <span className="topbar__eyebrow">{eyebrow}</span>
            <h1 className="topbar__title">{title}</h1>
          </div>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
