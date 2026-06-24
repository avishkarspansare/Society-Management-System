import api from './api'

const BASE = '/api/v1/auth'

export const authService = {
  login:    (data)    => api.post(`${BASE}/login`, data),
  register: (data)    => api.post(`${BASE}/register`, data),
  refresh:  (token)   => api.post(`${BASE}/refresh`, { refreshToken: token }),
}
