import { createSlice } from '@reduxjs/toolkit'

const token = localStorage.getItem('sms_token')
const user  = localStorage.getItem('sms_user')

const initialState = {
  user:          user  ? JSON.parse(user)  : null,
  token:         token || null,
  isAuthenticated: !!token,
  loading:       false,
  error:         null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true
      state.error   = null
    },
    loginSuccess(state, action) {
      state.loading         = false
      state.isAuthenticated = true
      state.user            = action.payload.user
      state.token           = action.payload.token
      localStorage.setItem('sms_token', action.payload.token)
      localStorage.setItem('sms_user',  JSON.stringify(action.payload.user))
    },
    loginFailure(state, action) {
      state.loading = false
      state.error   = action.payload
    },
    logout(state) {
      state.user            = null
      state.token           = null
      state.isAuthenticated = false
      state.error           = null
      localStorage.removeItem('sms_token')
      localStorage.removeItem('sms_user')
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem('sms_user', JSON.stringify(state.user))
    },
    clearError(state) {
      state.error = null
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, updateUser, clearError } = authSlice.actions
export default authSlice.reducer
