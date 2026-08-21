import api from "./api";

export const leaveService = {
  getAll: () => api.get("/leaves"),
  getPending: () => api.get("/leaves/pending"),
  getByEmployee: (employeeId) => api.get(`/leaves/employee/${employeeId}`),
  apply: (payload) => api.post("/leaves", payload),
  approve: (id, comment) => api.put(`/leaves/${id}/approve`, { comment }),
  reject: (id, comment) => api.put(`/leaves/${id}/reject`, { comment }),
  cancel: (id) => api.put(`/leaves/${id}/cancel`),
};
