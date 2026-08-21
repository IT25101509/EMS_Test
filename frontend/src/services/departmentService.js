import api from "./api";

export const departmentService = {
  getAll: () => api.get("/departments"),
  getById: (id) => api.get(`/departments/${id}`),
  create: (payload) => api.post("/departments", payload),
  update: (id, payload) => api.put(`/departments/${id}`, payload),
  remove: (id) => api.delete(`/departments/${id}`),
};

export const positionService = {
  getAll: () => api.get("/positions"),
  getByDepartment: (departmentId) => api.get(`/positions/department/${departmentId}`),
  create: (payload) => api.post("/positions", payload),
  update: (id, payload) => api.put(`/positions/${id}`, payload),
  remove: (id) => api.delete(`/positions/${id}`),
};
