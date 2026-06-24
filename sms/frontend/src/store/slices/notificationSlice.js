import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items:       [],
    unreadCount: 0,
    loading:     false,
  },
  reducers: {
    setNotifications(state, action) {
      state.items   = action.payload.content ?? action.payload
      state.loading = false
    },
    setUnreadCount(state, action) {
      state.unreadCount = action.payload
    },
    markRead(state, action) {
      const n = state.items.find(i => i.id === action.payload)
      if (n && !n.isRead) {
        n.isRead = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    markAllRead(state) {
      state.items.forEach(i => { i.isRead = true })
      state.unreadCount = 0
    },
    addNotification(state, action) {
      state.items.unshift(action.payload)
      if (!action.payload.isRead) state.unreadCount += 1
    },
  },
})

export const { setNotifications, setUnreadCount, markRead, markAllRead, addNotification } = notificationSlice.actions
export default notificationSlice.reducer
