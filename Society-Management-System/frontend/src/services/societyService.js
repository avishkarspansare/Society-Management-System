import api from './api'

const BASE = '/api/v1/societies'

export const societyService = {
  getAll:       ()           => api.get(BASE),
  getById:      (id)         => api.get(`${BASE}/${id}`),
  create:       (data)       => api.post(BASE, data),
  update:       (id, data)   => api.put(`${BASE}/${id}`, data),
  delete:       (id)         => api.delete(`${BASE}/${id}`),
  getDashboard: (id)         => api.get(`${BASE}/${id}/dashboard`),
  getStats:     (id)         => api.get(`${BASE}/${id}/stats`),
}
