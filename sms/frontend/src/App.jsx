import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from './store/store'

// Layout
import Layout from './components/layout/Layout'
import PrivateRoute from './routes/PrivateRoute'

// Auth pages
import Login from './pages/auth/Login'

// Admin pages
import AdminDashboard     from './pages/admin/Dashboard'
import AdminPayments      from './pages/admin/Payments'
import AdminComplaints    from './pages/admin/Complaints'
import AdminVisitors      from './pages/admin/Visitors'
import AdminAnnouncements from './pages/admin/Announcements'
import AdminUsers         from './pages/admin/Users'
import AdminUnits         from './pages/admin/Units'
import AdminEvents        from './pages/admin/Events'
import AdminAmenities     from './pages/admin/Amenities'

// Resident pages
import ResidentDashboard     from './pages/resident/Dashboard'
import ResidentPayments      from './pages/resident/Payments'
import ResidentComplaints    from './pages/resident/Complaints'
import ResidentVisitors      from './pages/resident/Visitors'
import ResidentAnnouncements from './pages/resident/Announcements'
import ResidentAmenities     from './pages/resident/Amenities'

// Shared pages
import Profile  from './pages/shared/Profile'
import NotFound from './pages/shared/NotFound'

const ADMIN_ROLES = ['SUPER_ADMIN', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER']

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
            success: { iconTheme: { primary: '#10b981', secondary: '#f1f5f9' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' } },
          }}
        />

        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin routes */}
          <Route path="/admin" element={
            <PrivateRoute roles={ADMIN_ROLES}>
              <Layout />
            </PrivateRoute>
          }>
            <Route index                element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"     element={<AdminDashboard />}     />
            <Route path="users"         element={<AdminUsers />}         />
            <Route path="units"         element={<AdminUnits />}         />
            <Route path="payments"      element={<AdminPayments />}      />
            <Route path="complaints"    element={<AdminComplaints />}    />
            <Route path="visitors"      element={<AdminVisitors />}      />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="events"        element={<AdminEvents />}        />
            <Route path="amenities"     element={<AdminAmenities />}     />
            <Route path="profile"       element={<Profile />}            />
          </Route>

          {/* Resident routes */}
          <Route path="/resident" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index                element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"     element={<ResidentDashboard />}     />
            <Route path="payments"      element={<ResidentPayments />}      />
            <Route path="complaints"    element={<ResidentComplaints />}    />
            <Route path="visitors"      element={<ResidentVisitors />}      />
            <Route path="announcements" element={<ResidentAnnouncements />} />
            <Route path="amenities"     element={<ResidentAmenities />}     />
            <Route path="profile"       element={<Profile />}              />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}
