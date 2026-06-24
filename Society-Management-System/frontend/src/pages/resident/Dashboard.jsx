import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { societyService } from '../../services/societyService'
import { paymentService } from '../../services/paymentService'
import { complaintService } from '../../services/complaintService'
import { announcementService } from '../../services/announcementService'
import StatCard from '../../components/common/StatCard'
import Badge, { statusVariant } from '../../components/common/Badge'
import { PageLoader } from '../../components/common/Spinner'
import { CreditCard, MessageSquare, Bell, Building2 } from 'lucide-react'

export default function ResidentDashboard() {
  const { user } = useAuth()
  const [payments, setPayments]         = useState([])
  const [complaints, setComplaints]     = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    Promise.all([
      paymentService.getMine({ page: 0, size: 5 }),
      complaintService.getMine({ page: 0, size: 5 }),
      user?.societyId ? announcementService.getActive(user.societyId) : Promise.resolve({ data: { data: [] } }),
    ]).then(([pRes, cRes, aRes]) => {
      setPayments(pRes.data?.data?.content ?? pRes.data?.data ?? [])
      setComplaints(cRes.data?.data?.content ?? cRes.data?.data ?? [])
      setAnnouncements(aRes.data?.data ?? [])
    }).catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const pendingPayments = payments.filter(p => p.paymentStatus === 'PENDING' || p.paymentStatus === 'OVERDUE')

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">My Dashboard</h1>
        <p className="page-subtitle">Welcome, <span className="text-primary-400">{user?.firstName}</span>!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Pending Payments"  value={pendingPayments.length}  icon={CreditCard}    color="warning" />
        <StatCard label="My Complaints"     value={complaints.length}        icon={MessageSquare} color="info"    />
        <StatCard label="Announcements"     value={announcements.length}     icon={Bell}          color="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pending payments */}
        <div className="glass-card p-5">
          <h2 className="text-base font-display font-semibold text-surface-100 mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" /> Pending Payments
          </h2>
          {pendingPayments.length === 0 ? (
            <p className="text-surface-500 text-sm">No pending payments 🎉</p>
          ) : (
            <div className="space-y-2">
              {pendingPayments.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-700/30 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-surface-200">{p.paymentType}</p>
                    <p className="text-xs text-surface-500">Due: {p.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-surface-100">₹{Number(p.amount).toLocaleString()}</p>
                    <Badge variant={statusVariant(p.paymentStatus)}>{p.paymentStatus}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Announcements */}
        <div className="glass-card p-5">
          <h2 className="text-base font-display font-semibold text-surface-100 mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary-400" /> Latest Announcements
          </h2>
          {announcements.length === 0 ? (
            <p className="text-surface-500 text-sm">No announcements</p>
          ) : (
            <div className="space-y-2">
              {announcements.slice(0, 5).map(a => (
                <div key={a.id} className="p-3 rounded-xl hover:bg-surface-700/30 transition-colors">
                  <p className="text-sm font-medium text-surface-200">{a.title}</p>
                  <p className="text-xs text-surface-500 mt-0.5 line-clamp-1">{a.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
