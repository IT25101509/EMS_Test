import api from "./api";

export const reportsService = {
  getDashboard: () => api.get("/reports/dashboard"),
};
