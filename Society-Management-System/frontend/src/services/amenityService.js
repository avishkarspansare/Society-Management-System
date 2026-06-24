import api from './api'

const BASE = '/api/v1/amenities'

export const amenityService = {
  getAll:          (societyId, params = {}) => api.get(BASE, { params: { societyId, ...params } }),
  getActive:       (societyId)              => api.get(`${BASE}/active`, { params: { societyId } }),
  getById:         (id)                     => api.get(`${BASE}/${id}`),
  create:          (data)                   => api.post(BASE, data),
  update:          (id, data)               => api.put(`${BASE}/${id}`, data),
  delete:          (id)                     => api.delete(`${BASE}/${id}`),

  // Bookings
  book:            (data)                   => api.post(`${BASE}/bookings`, data),
  cancelBooking:   (bookingId)              => api.post(`${BASE}/bookings/${bookingId}/cancel`),
  getMyBookings:   (params = {})            => api.get(`${BASE}/bookings/my`, { params }),
  getAmenityBookings: (amenityId, params={}) => api.get(`${BASE}/${amenityId}/bookings`, { params }),
}
