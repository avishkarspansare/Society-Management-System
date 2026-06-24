import api from './api'

const BASE = '/api/v1/payments'

export const paymentService = {
  getAll:      (params)   => api.get(BASE, { params }),
  getById:     (id)       => api.get(`${BASE}/${id}`),
  getMine:     (params)   => api.get(`${BASE}/my`, { params }),
  create:      (data)     => api.post(BASE, data),
  update:      (id, data) => api.put(`${BASE}/${id}`, data),
  getOverdue:  (societyId) => api.get(`${BASE}/overdue`, { params: { societyId } }),
  sendReminder:(id)       => api.post(`${BASE}/${id}/reminder`),
  getReceipt:  (id)       => api.get(`${BASE}/${id}/receipt`),
  bySociety:   (societyId, params) => api.get(BASE, { params: { societyId, ...params } }),
}
