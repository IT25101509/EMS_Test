import api from "./api";

export const payrollService = {
  getAll: () => api.get("/payroll"),
  getByEmployee: (employeeId) => api.get(`/payroll/employee/${employeeId}`),
  create: (payload) => api.post("/payroll", payload),
  markPaid: (id) => api.put(`/payroll/${id}/mark-paid`),
};
