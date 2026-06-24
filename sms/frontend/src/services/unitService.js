import api from './api'

const BASE = '/api/v1/units'

export const unitService = {
  getAll:      (societyId, params) => api.get(BASE, { params: { societyId, ...params } }),
  getById:     (id)                => api.get(`${BASE}/${id}`),
  getBySociety:(societyId, params) => api.get(BASE, { params: { societyId, ...params } }),
  create:      (data)              => api.post(BASE, data),
  update:      (id, data)          => api.put(`${BASE}/${id}`, data),
  delete:      (id)                => api.delete(`${BASE}/${id}`),
  assign:      (id, userId)        => api.patch(`${BASE}/${id}/assign`, { userId }),
  vacate:      (id)                => api.patch(`${BASE}/${id}/vacate`),
}
