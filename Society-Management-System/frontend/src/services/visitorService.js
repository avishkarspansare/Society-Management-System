import api from './api'
import { store } from '../store/store'

const BASE = '/api/v1/visitors'

const myUnitId   = () => store.getState().auth.user?.unitId
const societyId  = () => store.getState().auth.user?.societyId

export const visitorService = {
  getAll: (societyIdParam, params = {}) =>
    api.get(BASE, { params: { societyId: societyIdParam, ...params } }),

  // Resident: get visitors by their unit
  getMine: (params = {}) => {
    const uid = myUnitId()
    return uid
      ? api.get(`${BASE}/unit/${uid}`, { params })
      : api.get(BASE, { params: { societyId: societyId(), ...params } })
  },

  getToday: (sidParam) =>
    api.get(`${BASE}/today`, { params: { societyId: sidParam } }),

  getActive: (sidParam) =>
    api.get(`${BASE}/active`, { params: { societyId: sidParam } }),

  getById: (id) =>
    api.get(`${BASE}/${id}`),

  getByUnit: (unitId, params = {}) =>
    api.get(`${BASE}/unit/${unitId}`, { params }),

  create: (data) =>
    api.post(BASE, data),

  checkIn: (id) =>
    api.post(`${BASE}/${id}/check-in`),

  checkOut: (id) =>
    api.post(`${BASE}/${id}/check-out`),
}
