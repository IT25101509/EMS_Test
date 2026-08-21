import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import EmployeeList from "./pages/Employee/EmployeeList";
import DepartmentPage from "./pages/Department/DepartmentPage";
import AttendancePage from "./pages/Attendance/AttendancePage";
import LeavePage from "./pages/Leave/LeavePage";
import PayrollPage from "./pages/Payroll/PayrollPage";
import PerformancePage from "./pages/Performance/PerformancePage";
import ProfilePage from "./pages/Profile/ProfilePage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/employees"
            element={
              <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
                <EmployeeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/departments"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <DepartmentPage />
              </ProtectedRoute>
            }
          />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/leave" element={<LeavePage />} />
          <Route path="/payroll" element={<PayrollPage />} />
          <Route path="/performance" element={<PerformancePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
