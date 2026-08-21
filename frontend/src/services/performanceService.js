import api from "./api";

export const performanceService = {
  getAll: () => api.get("/performance"),
  getByEmployee: (employeeId) => api.get(`/performance/employee/${employeeId}`),
  getByDepartment: (departmentId) => api.get(`/performance/department/${departmentId}`),
  create: (payload) => api.post("/performance", payload),
};
