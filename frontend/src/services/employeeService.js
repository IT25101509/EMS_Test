import api from "./api";

export const employeeService = {
  getAll: () => api.get("/employees"),
  search: (params) => api.get("/employees/search", { params }),
  getById: (id) => api.get(`/employees/${id}`),
  getByUserId: (userId) => api.get(`/employees/by-user/${userId}`),
  create: (payload) => api.post("/employees", payload),
  update: (id, payload) => api.put(`/employees/${id}`, payload),
  deactivate: (id) => api.put(`/employees/${id}/deactivate`),
  remove: (id) => api.delete(`/employees/${id}`),
};
