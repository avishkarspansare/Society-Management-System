import api from './api'

const BASE = '/api/v1/units'

export const unitService = {
  getBySociety: (societyId, params = {}) => api.get(`${BASE}/society/${societyId}`, { params }),
  getByBuilding:(buildingId)             => api.get(`${BASE}/building/${buildingId}`),
  getById:      (id)                     => api.get(`${BASE}/${id}`),
  create:       (data)                   => api.post(BASE, data),
  update:       (id, data)               => api.put(`${BASE}/${id}`, data),
  delete:       (id)                     => api.delete(`${BASE}/${id}`),
}
