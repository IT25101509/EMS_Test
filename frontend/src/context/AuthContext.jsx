import { createContext, useEffect, useState, useCallback } from "react";
import { authService } from "../services/authService";
import { employeeService } from "../services/employeeService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("ems_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadEmployeeProfile = useCallback(async (userId) => {
    try {
      const res = await employeeService.getByUserId(userId);
      setEmployeeProfile(res.data);
    } catch {
      setEmployeeProfile(null);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadEmployeeProfile(user.userId).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (username, password) => {
    const res = await authService.login(username, password);
    const authData = res.data;
    localStorage.setItem("ems_token", authData.token);
    localStorage.setItem("ems_user", JSON.stringify(authData));
    setUser(authData);
    await loadEmployeeProfile(authData.userId);
    return authData;
  };

  const register = async (payload) => {
    const res = await authService.register(payload);
    const authData = res.data;
    localStorage.setItem("ems_token", authData.token);
    localStorage.setItem("ems_user", JSON.stringify(authData));
    setUser(authData);
    return authData;
  };

  const logout = () => {
    localStorage.removeItem("ems_token");
    localStorage.removeItem("ems_user");
    setUser(null);
    setEmployeeProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, employeeProfile, loading, login, register, logout, reloadProfile: () => user && loadEmployeeProfile(user.userId) }}
    >
      {children}
    </AuthContext.Provider>
  );
}
