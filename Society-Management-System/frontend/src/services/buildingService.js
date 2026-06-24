import api from './api'

const BASE = '/api/v1/buildings'

export const buildingService = {
  getBySociety: (societyId) => api.get(`${BASE}/society/${societyId}`),
  getById:      (id)        => api.get(`${BASE}/${id}`),
  create:       (data)      => api.post(BASE, data),
  update:       (id, data)  => api.put(`${BASE}/${id}`, data),
  delete:       (id)        => api.delete(`${BASE}/${id}`),
}
