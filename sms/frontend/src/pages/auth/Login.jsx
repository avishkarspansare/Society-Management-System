import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Building2, Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Spinner from '../../components/common/Spinner'

const schema = z.object({
  email:    z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function Login() {
  const { login, loading, isAuthenticated, user } = useAuth()
  const [showPass, setShowPass] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  // Already logged in — redirect
  if (isAuthenticated) {
    const isAdmin = user?.userType === 'SUPER_ADMIN' || user?.userType === 'SOCIETY_ADMIN'
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/resident/dashboard'} replace />
  }

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Left panel — hero */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-hero-pattern p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-white text-lg">Society MS</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-accent-400" />
            <span className="text-accent-400 text-sm font-semibold tracking-wide uppercase">Smart Society Management</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-white leading-tight mb-4">
            Manage Your Society<br />
            <span className="text-gradient">Smarter & Faster</span>
          </h1>
          <p className="text-surface-300 text-base leading-relaxed">
            All-in-one platform for residents, admins, and security staff.
            Payments, complaints, visitors, announcements — all in one place.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { n: '500+', l: 'Societies' },
              { n: '50K+', l: 'Residents' },
              { n: '99.9%', l: 'Uptime' },
              { n: '24/7', l: 'Support' },
            ].map(({ n, l }) => (
              <div key={l} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4">
                <p className="text-2xl font-display font-bold text-white">{n}</p>
                <p className="text-surface-400 text-sm">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-surface-500 text-xs">
          © 2026 Society Management System. All rights reserved.
        </p>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-surface-50 text-lg">Society MS</span>
          </div>

          <h2 className="text-3xl font-display font-bold text-surface-50 mb-2">Welcome back</h2>
          <p className="text-surface-400 mb-8">Sign in to your society account</p>

          <form onSubmit={handleSubmit(login)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="form-label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@society.com"
                  className={`form-input pl-10 ${errors.email ? 'border-red-500/50 focus:ring-red-500/40' : ''}`}
                  id="login-email"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="form-label mb-0">Password</label>
                <a href="#" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`form-input pl-10 pr-10 ${errors.password ? 'border-red-500/50' : ''}`}
                  id="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base"
              id="login-submit"
            >
              {loading ? <Spinner size="sm" /> : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-400">
            New to the system?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Request access
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
