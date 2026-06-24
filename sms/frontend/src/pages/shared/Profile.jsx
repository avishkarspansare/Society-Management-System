import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { userService } from '../../services/userService'
import { PageLoader } from '../../components/common/Spinner'
import { User, Shield, Bell, Lock, Save, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../../services/api'

function ProfileTab({ user }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: user?.firstName,
      lastName:  user?.lastName,
      phone:     user?.phone,
      address:   user?.address,
    }
  })
  const [saving, setSaving] = useState(false)

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      await userService.update(user.id, data)
      toast.success('Profile updated!')
    } catch (e) { toast.error(e.message || 'Failed to update profile') }
    finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">First Name</label>
          <input {...register('firstName', { required: 'Required' })} className="form-input" />
          {errors.firstName && <p className="text-xs text-red-400 mt-1">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="form-label">Last Name</label>
          <input {...register('lastName', { required: 'Required' })} className="form-input" />
          {errors.lastName && <p className="text-xs text-red-400 mt-1">{errors.lastName.message}</p>}
        </div>
      </div>
      <div>
        <label className="form-label">Email (read-only)</label>
        <input value={user?.email || ''} disabled className="form-input opacity-50 cursor-not-allowed" />
      </div>
      <div>
        <label className="form-label">Phone</label>
        <input {...register('phone')} className="form-input" placeholder="+91 9876543210" />
      </div>
      <div>
        <label className="form-label">Address</label>
        <textarea {...register('address')} rows={2} className="form-input resize-none" placeholder="Your address…" />
      </div>
      <button type="submit" disabled={saving} className="btn-primary">
        <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  )
}

function SecurityTab() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [saving, setSaving]   = useState(false)

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      return toast.error('Passwords do not match')
    }
    setSaving(true)
    try {
      await api.post('/api/v1/auth/change-password', {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      })
      toast.success('Password changed successfully!')
    } catch (e) { toast.error(e.message || 'Failed to change password') }
    finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div>
        <label className="form-label">Current Password</label>
        <div className="relative">
          <input {...register('oldPassword', { required: 'Required' })}
            type={showOld ? 'text' : 'password'} className="form-input pr-10" />
          <button type="button" onClick={() => setShowOld(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500">
            {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.oldPassword && <p className="text-xs text-red-400 mt-1">{errors.oldPassword.message}</p>}
      </div>
      <div>
        <label className="form-label">New Password</label>
        <div className="relative">
          <input {...register('newPassword', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })}
            type={showNew ? 'text' : 'password'} className="form-input pr-10" />
          <button type="button" onClick={() => setShowNew(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500">
            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.newPassword && <p className="text-xs text-red-400 mt-1">{errors.newPassword.message}</p>}
      </div>
      <div>
        <label className="form-label">Confirm New Password</label>
        <input {...register('confirmPassword', { required: 'Required' })}
          type="password" className="form-input" />
        {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
      </div>
      <button type="submit" disabled={saving} className="btn-primary">
        <Lock className="w-4 h-4" /> {saving ? 'Updating…' : 'Change Password'}
      </button>
    </form>
  )
}

const TABS = [
  { id: 'profile',  label: 'Profile',  icon: User },
  { id: 'security', label: 'Security', icon: Lock },
]

export default function Profile() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-xl font-bold text-white shrink-0">
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
        <div>
          <h1 className="page-title">{user?.firstName} {user?.lastName}</h1>
          <p className="text-sm text-surface-400 mt-0.5 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-primary-400" />
            {user?.userType?.replace(/_/g, ' ')} · {user?.email}
          </p>
          {user?.unitNumber && (
            <p className="text-xs text-surface-500 mt-0.5">Unit: {user.unitNumber}</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-800 rounded-xl w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === id ? 'bg-primary-600 text-white' : 'text-surface-400 hover:text-surface-100'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="glass-card p-6">
        {activeTab === 'profile'  && <ProfileTab user={user} />}
        {activeTab === 'security' && <SecurityTab />}
      </div>
    </div>
  )
}
