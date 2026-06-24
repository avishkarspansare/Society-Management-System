import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { userService } from '../../services/userService'
import { useDispatch } from 'react-redux'
import { updateUser } from '../../store/slices/authSlice'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { User, Shield, Bell, Lock, Save, Building2 } from 'lucide-react'
import Badge from '../../components/common/Badge'

const roleVariant = (r) =>
  ({ SUPER_ADMIN:'danger', SOCIETY_ADMIN:'warning', COMMITTEE_MEMBER:'info',
     RESIDENT:'success', SECURITY:'primary', STAFF:'primary' }[r] || 'primary')

export default function Profile() {
  const { user }   = useAuth()
  const dispatch   = useDispatch()
  const [tab, setTab]       = useState('profile')
  const [saving, setSaving] = useState(false)

  const { register: regProfile, handleSubmit: handleProfile, formState: { errors: pErr } } =
    useForm({ defaultValues: { firstName: user?.firstName, lastName: user?.lastName, phone: user?.phone, address: user?.address } })

  const { register: regPwd, handleSubmit: handlePwd, watch, reset: resetPwd, formState: { errors: pwErr } } =
    useForm()

  const onSaveProfile = async (data) => {
    setSaving(true)
    try {
      const res = await userService.updateProfile(user?.id, data)
      dispatch(updateUser(res.data?.data ?? data))
      toast.success('Profile updated')
    } catch (e) { toast.error(e.message || 'Failed') } finally { setSaving(false) }
  }

  const onChangePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setSaving(true)
    try {
      await userService.changePassword(user?.id, {
        currentPassword: data.currentPassword,
        newPassword:     data.newPassword,
      })
      toast.success('Password changed successfully')
      resetPwd()
    } catch (e) { toast.error(e.message || 'Incorrect current password') } finally { setSaving(false) }
  }

  const tabs = [
    { id: 'profile',  label: 'Profile',   icon: User   },
    { id: 'security', label: 'Security',  icon: Lock   },
  ]

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="page-title">Profile & Settings</h1>
        <p className="page-subtitle">Manage your account information</p>
      </div>

      {/* User card */}
      <div className="glass-card p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-2xl font-bold text-white shrink-0">
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
        <div>
          <h2 className="text-xl font-display font-semibold text-surface-100">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-surface-400 text-sm mt-0.5 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5" />
            {user?.email}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={roleVariant(user?.userType)}>{user?.userType?.replace(/_/g,' ')}</Badge>
            {user?.societyId && <Badge variant="primary">Society #{user.societyId}</Badge>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 glass-card p-1 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              tab === id
                ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                : 'text-surface-400 hover:text-surface-200 hover:bg-surface-700/40'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === 'profile' && (
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold text-surface-100 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-primary-400" /> Personal Information
          </h3>
          <form onSubmit={handleProfile(onSaveProfile)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">First Name *</label>
                <input className="form-input" {...regProfile('firstName', { required: true })} />
                {pErr.firstName && <p className="text-xs text-red-400 mt-1">Required</p>}
              </div>
              <div>
                <label className="form-label">Last Name *</label>
                <input className="form-input" {...regProfile('lastName', { required: true })} />
                {pErr.lastName && <p className="text-xs text-red-400 mt-1">Required</p>}
              </div>
            </div>

            <div>
              <label className="form-label">Email</label>
              <input className="form-input opacity-60 cursor-not-allowed" value={user?.email || ''} disabled />
              <p className="text-xs text-surface-500 mt-1">Email cannot be changed here. Contact support.</p>
            </div>

            <div>
              <label className="form-label">Phone</label>
              <input className="form-input" {...regProfile('phone')} />
            </div>

            <div>
              <label className="form-label">Address</label>
              <textarea rows={3} className="form-input resize-none" {...regProfile('address')} />
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" disabled={saving} className="btn-primary">
                <Save className="w-4 h-4" />
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Security tab */}
      {tab === 'security' && (
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold text-surface-100 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary-400" /> Change Password
          </h3>
          <form onSubmit={handlePwd(onChangePassword)} className="space-y-4">
            <div>
              <label className="form-label">Current Password *</label>
              <input type="password" className="form-input" {...regPwd('currentPassword', { required: true })} />
              {pwErr.currentPassword && <p className="text-xs text-red-400 mt-1">Required</p>}
            </div>
            <div>
              <label className="form-label">New Password *</label>
              <input type="password" className="form-input" {...regPwd('newPassword', { required: true, minLength: 8 })} />
              {pwErr.newPassword && <p className="text-xs text-red-400 mt-1">Min 8 characters</p>}
            </div>
            <div>
              <label className="form-label">Confirm New Password *</label>
              <input type="password" className="form-input" {...regPwd('confirmPassword', { required: true })} />
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" disabled={saving} className="btn-primary">
                <Shield className="w-4 h-4" />
                {saving ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
