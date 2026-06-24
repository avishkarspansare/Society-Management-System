import api from './api'

const BASE = '/api/v1/announcements'

export const announcementService = {
  getAll: (societyId, params = {}) =>
    api.get(BASE, { params: { societyId, ...params } }),

  getActive: (societyId) =>
    api.get(`${BASE}/active`, { params: { societyId } }),

  getById: (id) =>
    api.get(`${BASE}/${id}`),

  create: (data) =>
    api.post(BASE, data),

  update: (id, data) =>
    api.put(`${BASE}/${id}`, data),

  delete: (id) =>
    api.delete(`${BASE}/${id}`),

  notifyAll: (id) =>
    api.post(`${BASE}/${id}/notify`),
}
