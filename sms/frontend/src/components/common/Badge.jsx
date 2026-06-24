const variants = {
  success: 'badge-success',
  warning: 'badge-warning',
  danger:  'badge-danger',
  info:    'badge-info',
  primary: 'badge-primary',
  default: 'badge bg-surface-700/50 text-surface-300 border border-surface-600/30',
}

/**
 * Status badge with variant styling.
 */
export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  )
}

/**
 * Maps common domain status strings to badge variants.
 */
export function statusVariant(status) {
  const map = {
    ACTIVE: 'success', PAID: 'success', RESOLVED: 'success', CHECKED_OUT: 'success',
    CONFIRMED: 'success', COMPLETED: 'success', REGISTERED: 'success',
    PENDING: 'warning', IN_PROGRESS: 'warning', EXPECTED: 'warning',
    OVERDUE: 'danger', REJECTED: 'danger', DENIED: 'danger', CANCELLED: 'danger',
    CRITICAL: 'danger', OPEN: 'info', CHECKED_IN: 'primary',
    INACTIVE: 'default', CLOSED: 'default',
  }
  return map[status] || 'default'
}
