import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { amenityService } from '../../services/amenityService'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import { PageLoader } from '../../components/common/Spinner'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Dumbbell, Clock, DollarSign, Calendar, BookOpen } from 'lucide-react'

const bookingStatusVariant = (s) =>
  ({ PENDING:'warning', APPROVED:'success', REJECTED:'danger', CANCELLED:'primary' }[s] || 'primary')

export default function ResidentAmenities() {
  const { user }  = useAuth()
  const [amenities,    setAmenities]    = useState([])
  const [myBookings,   setMyBookings]   = useState([])
  const [loading,      setLoading]      = useState(true)
  const [selected,     setSelected]     = useState(null)   // amenity to book
  const [showBookings, setShowBookings] = useState(false)
  const [saving,       setSaving]       = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const fetchData = () => {
    const sid = user?.societyId
    if (!sid) { setLoading(false); return }
    Promise.all([
      amenityService.getAll(sid),
      amenityService.getMyBookings({ page: 0, size: 50 }),
    ]).then(([aR, bR]) => {
      setAmenities((aR.data?.data?.content ?? aR.data?.data ?? []).filter(a => a.isActive))
      setMyBookings(bR.data?.data?.content ?? bR.data?.data ?? [])
    }).catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [user])

  const onBook = async (data) => {
    setSaving(true)
    try {
      await amenityService.book(selected.id, {
        ...data,
        startTime: data.startTime,
        endTime:   data.endTime,
      })
      toast.success('Booking submitted for approval')
      fetchData(); setSelected(null); reset()
    } catch (e) { toast.error(e.message || 'Failed') } finally { setSaving(false) }
  }

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      await amenityService.cancelBooking(bookingId)
      toast.success('Booking cancelled')
      fetchData()
    } catch (e) { toast.error(e.message || 'Failed') }
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Amenities</h1>
          <p className="page-subtitle">Book society facilities for your use</p>
        </div>
        <button onClick={() => setShowBookings(b => !b)} className="btn-secondary shrink-0">
          <BookOpen className="w-4 h-4" /> {showBookings ? 'Facilities' : 'My Bookings'}
        </button>
      </div>

      {!showBookings ? (
        /* Amenity cards */
        amenities.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center py-20 text-surface-500">
            <Dumbbell className="w-12 h-12 mb-3 opacity-40" />
            <p className="text-sm">No amenities available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {amenities.map(am => (
              <div key={am.id} className="glass-card-hover p-5 flex flex-col gap-3">
                <div>
                  <h3 className="font-semibold text-surface-100">{am.name}</h3>
                  <p className="text-xs text-surface-500 mt-0.5">{am.amenityType?.replace(/_/g,' ')}</p>
                </div>

                {am.description && <p className="text-sm text-surface-400 line-clamp-2">{am.description}</p>}

                <div className="flex items-center gap-3 text-xs text-surface-500 flex-wrap">
                  {am.openingTime && am.closingTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {am.openingTime} – {am.closingTime}
                    </span>
                  )}
                  {am.maxBookingHours && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Max {am.maxBookingHours}h
                    </span>
                  )}
                  {am.feePerHour != null && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      {am.feePerHour === 0 ? 'Free' : `₹${am.feePerHour}/hr`}
                    </span>
                  )}
                </div>

                <button onClick={() => { setSelected(am); reset() }} className="btn-primary w-full justify-center mt-1">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        /* My Bookings */
        <div className="glass-card overflow-hidden">
          {myBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-surface-500">
              <BookOpen className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm">No bookings yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-700/50">
                    {['Amenity','Start','End','Status','Action'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-surface-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-700/30">
                  {myBookings.map(b => (
                    <tr key={b.id} className="hover:bg-surface-700/20 transition-colors">
                      <td className="px-5 py-4 font-medium text-surface-200">{b.amenityName || b.amenity?.name}</td>
                      <td className="px-5 py-4 text-surface-400 text-xs">{b.startTime ? new Date(b.startTime).toLocaleString('en-IN') : '—'}</td>
                      <td className="px-5 py-4 text-surface-400 text-xs">{b.endTime ? new Date(b.endTime).toLocaleString('en-IN') : '—'}</td>
                      <td className="px-5 py-4"><Badge variant={bookingStatusVariant(b.status)}>{b.status}</Badge></td>
                      <td className="px-5 py-4">
                        {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                          <button onClick={() => handleCancel(b.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Booking modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Book – ${selected?.name}`}>
        <form onSubmit={handleSubmit(onBook)} className="space-y-4">
          <div>
            <label className="form-label">Start Date & Time *</label>
            <input type="datetime-local" className="form-input" {...register('startTime', { required: true })} />
            {errors.startTime && <p className="text-xs text-red-400 mt-1">Required</p>}
          </div>
          <div>
            <label className="form-label">End Date & Time *</label>
            <input type="datetime-local" className="form-input" {...register('endTime', { required: true })} />
          </div>
          <div>
            <label className="form-label">Purpose</label>
            <textarea rows={2} className="form-input resize-none" {...register('purpose')} placeholder="What will you be using it for?" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setSelected(null)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Submitting…' : 'Book Now'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
