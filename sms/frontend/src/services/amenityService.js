import api from './api'

const BASE = '/api/v1/amenities'

export const amenityService = {
  getAll:       (societyId, params) => api.get(BASE, { params: { societyId, ...params } }),
  getById:      (id)                => api.get(`${BASE}/${id}`),
  create:       (data)              => api.post(BASE, data),
  update:       (id, data)          => api.put(`${BASE}/${id}`, data),
  delete:       (id)                => api.delete(`${BASE}/${id}`),
  getBookings:  (amenityId, params) => api.get(`${BASE}/${amenityId}/bookings`, { params }),
  book:         (amenityId, data)   => api.post(`${BASE}/${amenityId}/book`, data),
  cancelBooking:(bookingId)         => api.delete(`/api/v1/bookings/${bookingId}`),
  myBookings:   (params)            => api.get('/api/v1/bookings/my', { params }),
}
