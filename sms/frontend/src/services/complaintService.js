import api from './api'

const BASE = '/api/v1/complaints'

export const complaintService = {
  getAll:       (params)          => api.get(BASE, { params }),
  getById:      (id)              => api.get(`${BASE}/${id}`),
  getMine:      (params)          => api.get(`${BASE}/my`, { params }),
  create:       (data)            => api.post(BASE, data),
  update:       (id, data)        => api.put(`${BASE}/${id}`, data),
  updateStatus: (id, status)      => api.patch(`${BASE}/${id}/status`, { status }),
  assign:       (id, assigneeId)  => api.patch(`${BASE}/${id}/assign`, { assigneeId }),
  delete:       (id)              => api.delete(`${BASE}/${id}`),
  bySociety:    (societyId, params) => api.get(BASE, { params: { societyId, ...params } }),
  classify:     (title, description) =>
    api.post('/api/v1/ai/complaints/classify', { title, description }),
}
