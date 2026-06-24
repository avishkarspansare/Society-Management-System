import api from './api'

const BASE = '/api/v1/users'

export const userService = {
  getMe:        ()                => api.get(`${BASE}/me`),
  getAll:       (params)          => api.get(BASE, { params }),
  getById:      (id)              => api.get(`${BASE}/${id}`),
  update:       (id, data)        => api.put(`${BASE}/${id}`, data),
  updateStatus: (id, isActive)    => api.patch(`${BASE}/${id}/status`, { isActive }),
  delete:       (id)              => api.delete(`${BASE}/${id}`),
  getBySociety: (societyId, params) => api.get(BASE, { params: { societyId, ...params } }),
}
