import api from "./api";

export const attendanceService = {
  getAll: () => api.get("/attendance"),
  getByDate: (date) => api.get("/attendance/by-date", { params: { date } }),
  getByEmployee: (employeeId) => api.get(`/attendance/employee/${employeeId}`),
  checkIn: (employeeId) => api.post("/attendance/check-in", { employeeId }),
  checkOut: (employeeId) => api.put(`/attendance/check-out/${employeeId}`),
};
