import api from './api'

const BASE = '/api/v1/events'

export const eventService = {
  getAll:       (societyId, params) => api.get(BASE, { params: { societyId, ...params } }),
  getById:      (id)                => api.get(`${BASE}/${id}`),
  getUpcoming:  (societyId)         => api.get(`${BASE}/upcoming`, { params: { societyId } }),
  create:       (data)              => api.post(BASE, data),
  update:       (id, data)          => api.put(`${BASE}/${id}`, data),
  delete:       (id)                => api.delete(`${BASE}/${id}`),
  register:     (id)                => api.post(`${BASE}/${id}/register`),
  unregister:   (id)                => api.delete(`${BASE}/${id}/register`),
}
