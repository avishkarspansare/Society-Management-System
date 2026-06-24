import api from './api'

const BASE = '/api/v1/notifications'

export const notificationService = {
  getMine:      (params) => api.get(`${BASE}/me`, { params }),
  getUnreadCount: ()     => api.get(`${BASE}/me/unread-count`),
  markRead:     (id)     => api.patch(`${BASE}/${id}/read`),
  markAllRead:  ()       => api.patch(`${BASE}/read-all`),
}
