import api from './api'

const BASE = '/api/v1/visitors'

export const visitorService = {
  getAll:       (societyId, params) => api.get(BASE, { params: { societyId, ...params } }),
  getById:      (id)                => api.get(`${BASE}/${id}`),
  getByUnit:    (unitId, params)    => api.get(`${BASE}/unit/${unitId}`, { params }),
  getToday:     (societyId)         => api.get(`${BASE}/today`, { params: { societyId } }),
  getActive:    (societyId)         => api.get(`${BASE}/active`, { params: { societyId } }),
  register:     (societyId, data)   => api.post(BASE, data, { params: { societyId } }),
  checkIn:      (id)                => api.post(`${BASE}/${id}/check-in`),
  checkOut:     (id)                => api.post(`${BASE}/${id}/check-out`),
}
