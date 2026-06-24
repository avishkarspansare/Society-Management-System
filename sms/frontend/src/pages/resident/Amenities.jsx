import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { amenityService } from '../../services/amenityService'
import Badge, { statusVariant } from '../../components/common/Badge'
import { PageLoader } from '../../components/common/Spinner'
import Modal from '../../components/common/Modal'
import { Dumbbell, RefreshCw, Calendar, Clock, DollarSign, Users, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

function BookingForm({ amenity, onSubmit, onClose, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm()
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
        <p className="font-semibold text-surface-100">{amenity?.name}</p>
        {amenity?.bookingFee > 0 && (
          <p className="text-sm text-accent-400 mt-0.5">Fee: ₹{amenity.bookingFee}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Start Date & Time *</label>
          <input {...register('startDateTime', { required: 'Required' })} type="datetime-local" className="form-input" />
          {errors.startDateTime && <p className="text-xs text-red-400 mt-1">{errors.startDateTime.message}</p>}
        </div>
        <div>
          <label className="form-label">End Date & Time *</label>
          <input {...register('endDateTime', { required: 'Required' })} type="datetime-local" className="form-input" />
          {errors.endDateTime && <p className="text-xs text-red-400 mt-1">{errors.endDateTime.message}</p>}
        </div>
      </div>
      <div>
        <label className="form-label">Notes</label>
        <textarea {...register('notes')} rows={2} className="form-input resize-none" placeholder="Any special requirements?" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Booking…' : 'Confirm Booking'}
        </button>
      </div>
    </form>
  )
}

export default function ResidentAmenities() {
  const { user } = useAuth()
  const [amenities, setAmenities]       = useState([])
  const [myBookings, setMyBookings]     = useState([])
  const [loading, setLoading]           = useState(true)
  const [saving, setSaving]             = useState(false)
  const [selectedAmenity, setSelectedAmenity] = useState(null)
  const [tab, setTab]                   = useState('amenities')

  const societyId = user?.societyId

  const fetchData = useCallback(async () => {
    if (!societyId) return setLoading(false)
    setLoading(true)
    try {
      const [aRes, bRes] = await Promise.all([
        amenityService.getAll(societyId, { page: 0, size: 50 }),
        amenityService.myBookings({ page: 0, size: 50 }).catch(() => ({ data: { data: [] } })),
      ])
      setAmenities(aRes.data?.data?.content ?? aRes.data?.data ?? [])
      setMyBookings(bRes.data?.data?.content ?? bRes.data?.data ?? [])
    } catch { toast.error('Failed to load amenities') }
    finally { setLoading(false) }
  }, [societyId])

  useEffect(() => { fetchData() }, [fetchData])

  const handleBook = async (data) => {
    setSaving(true)
    try {
      await amenityService.book(selectedAmenity.id, { ...data, userId: user?.id })
      toast.success('Booking confirmed!')
      setSelectedAmenity(null)
      fetchData()
    } catch (e) { toast.error(e.message || 'Failed to book') }
    finally { setSaving(false) }
  }

  const cancelBooking = async (id) => {
    try {
      await amenityService.cancelBooking(id)
      toast.success('Booking cancelled')
      fetchData()
    } catch { toast.error('Failed to cancel booking') }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Amenities</h1>
          <p className="page-subtitle">Book society facilities</p>
        </div>
        <button onClick={fetchData} className="btn-secondary"><RefreshCw className="w-4 h-4" /></button>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-surface-800 rounded-xl w-fit">
        {[['amenities', 'Browse'], ['bookings', 'My Bookings']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === key ? 'bg-primary-600 text-white' : 'text-surface-400 hover:text-surface-100'
            }`}
          >
            {label}
            {key === 'bookings' && myBookings.length > 0 && (
              <span className="ml-1.5 text-xs bg-primary-500/30 text-primary-300 px-1.5 py-0.5 rounded-full">
                {myBookings.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? <PageLoader /> : tab === 'amenities' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {amenities.length === 0 ? (
            <div className="col-span-full py-12 text-center text-surface-500">No amenities available</div>
          ) : amenities.map(a => (
            <div key={a.id} className="glass-card-hover p-5 flex flex-col gap-3">
              <div>
                <p className="font-semibold text-surface-100">{a.name}</p>
                {a.description && (
                  <p className="text-xs text-surface-400 mt-1 line-clamp-2">{a.description}</p>
                )}
              </div>
              <div className="space-y-1 text-xs text-surface-400">
                {a.openingTime && a.closingTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary-400" />
                    {a.openingTime} – {a.closingTime}
                  </div>
                )}
                {a.capacity && (
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    Capacity: {a.capacity}
                  </div>
                )}
                {a.bookingFee > 0 && (
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-accent-400" />
                    ₹{a.bookingFee} per booking
                  </div>
                )}
              </div>
              {a.requiresBooking ? (
                <button
                  onClick={() => setSelectedAmenity(a)}
                  className="btn-primary text-sm justify-center mt-auto"
                >
                  <Calendar className="w-4 h-4" /> Book Now
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-400 text-sm mt-auto">
                  <CheckCircle className="w-4 h-4" /> No booking required
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* My Bookings */
        <div className="table-wrapper">
          <table className="w-full">
            <thead className="table-head">
              <tr>
                {['Amenity', 'Start', 'End', 'Status', 'Actions'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myBookings.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-surface-500">No bookings yet</td></tr>
              ) : myBookings.map(b => (
                <tr key={b.id} className="table-row">
                  <td className="table-td font-medium text-surface-200">{b.amenityName}</td>
                  <td className="table-td text-surface-400 text-xs">
                    {b.startDateTime ? new Date(b.startDateTime).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="table-td text-surface-400 text-xs">
                    {b.endDateTime ? new Date(b.endDateTime).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="table-td">
                    <Badge variant={statusVariant(b.status)}>{b.status}</Badge>
                  </td>
                  <td className="table-td">
                    {b.status === 'CONFIRMED' || b.status === 'PENDING' ? (
                      <button
                        onClick={() => cancelBooking(b.id)}
                        className="btn-ghost text-xs py-1 px-2 text-red-400"
                      >
                        Cancel
                      </button>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={!!selectedAmenity} onClose={() => setSelectedAmenity(null)} title="Book Amenity" size="md">
        <BookingForm
          amenity={selectedAmenity}
          onSubmit={handleBook}
          onClose={() => setSelectedAmenity(null)}
          loading={saving}
        />
      </Modal>
    </div>
  )
}
