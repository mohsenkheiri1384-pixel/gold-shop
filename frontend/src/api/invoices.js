import api from "./axios";

export const invoiceAPI = {
  getAll: (params = {}) => api.get("invoices/", { params }),
  getOne: (id) => api.get(`invoices/${id}/`),
  create: (data) => api.post("invoices/", data),
  update: (id, data) => api.put(`invoices/${id}/`, data),
  delete: (id) => api.delete(`invoices/${id}/`),
  stats: () => api.get("invoices/stats/"),
  clearDemo: () => api.delete("invoices/clear_demo/"),
};
