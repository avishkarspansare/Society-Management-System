import api from './api'

const BASE = '/api/v1/users'

export const userService = {
  getMe:          ()                       => api.get(`${BASE}/me`),
  getAll:         (params = {})            => api.get(BASE, { params }),
  getBySociety:   (societyId, params = {}) => api.get(`${BASE}/society/${societyId}`, { params }),
  getById:        (id)                     => api.get(`${BASE}/${id}`),
  create:         (data)                   => api.post(BASE, data),
  update:         (id, data)               => api.put(`${BASE}/${id}`, data),
  updateProfile:  (id, data)               => api.put(`${BASE}/${id}`, data),
  changePassword: (id, data)               => api.put(`${BASE}/${id}/password`, data),
  updateStatus:   (id, isActive)           => api.patch(`${BASE}/${id}/status`, { isActive }),
  delete:         (id)                     => api.delete(`${BASE}/${id}`),
}
