import api from './api'
import { store } from '../store/store'

const BASE = '/api/v1/complaints'

const myUserId = () => store.getState().auth.user?.id

export const complaintService = {
  getBySociety: (societyId, params = {}) =>
    api.get(`${BASE}/society/${societyId}`, { params }),

  // Alias used by existing pages
  bySociety: (societyId, params = {}) =>
    api.get(`${BASE}/society/${societyId}`, { params }),

  getMine: (params = {}) => {
    const uid = myUserId()
    return uid
      ? api.get(`${BASE}/user/${uid}`, { params })
      : Promise.resolve({ data: { data: { content: [] } } })
  },

  getByUser: (userId, params = {}) =>
    api.get(`${BASE}/user/${userId}`, { params }),

  getById: (id) =>
    api.get(`${BASE}/${id}`),

  create: (data) =>
    api.post(BASE, data),

  updateStatus: (id, status, closureReason = '') =>
    api.patch(`${BASE}/${id}/status`, { status, closureReason }),

  assign: (id, staffId) =>
    api.patch(`${BASE}/${id}/assign`, { staffId }),

  resolve: (id, resolvedById, closureReason) =>
    api.patch(`${BASE}/${id}/resolve`, { resolvedById, closureReason }),

  delete: (id) =>
    api.delete(`${BASE}/${id}`),
}
