import api from './api'

const BASE = '/api/v1/events'

export const eventService = {
  getAll:       (societyId, params = {}) => api.get(BASE, { params: { societyId, ...params } }),
  getUpcoming:  (societyId)              => api.get(`${BASE}/upcoming`, { params: { societyId } }),
  getById:      (id)                     => api.get(`${BASE}/${id}`),
  create:       (data)                   => api.post(BASE, data),
  update:       (id, data)               => api.put(`${BASE}/${id}`, data),
  delete:       (id)                     => api.delete(`${BASE}/${id}`),
  register:     (id)                     => api.post(`${BASE}/${id}/register`),
  unregister:   (id)                     => api.post(`${BASE}/${id}/cancel-registration`),
  getParticipants: (id)                  => api.get(`${BASE}/${id}/participants`),
}
