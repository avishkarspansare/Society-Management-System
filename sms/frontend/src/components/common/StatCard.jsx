import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

/**
 * A dashboard stat card with icon, value, label, and optional trend.
 */
export default function StatCard({ label, value, icon: Icon, color = 'primary', trend, trendLabel, subtitle }) {
  const colorMap = {
    primary: { bg: 'bg-primary-500/15',  icon: 'text-primary-400',  border: 'border-primary-500/20' },
    accent:  { bg: 'bg-accent-500/15',   icon: 'text-accent-400',   border: 'border-accent-500/20'  },
    success: { bg: 'bg-emerald-500/15',  icon: 'text-emerald-400',  border: 'border-emerald-500/20' },
    danger:  { bg: 'bg-red-500/15',      icon: 'text-red-400',      border: 'border-red-500/20'     },
    warning: { bg: 'bg-amber-500/15',    icon: 'text-amber-400',    border: 'border-amber-500/20'   },
    info:    { bg: 'bg-blue-500/15',     icon: 'text-blue-400',     border: 'border-blue-500/20'    },
  }
  const c = colorMap[color] || colorMap.primary

  return (
    <div className="glass-card-hover p-5 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center shrink-0`}>
        {Icon && <Icon className={`w-6 h-6 ${c.icon}`} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-display font-bold text-surface-50 leading-tight">
          {value ?? '—'}
        </p>
        <p className="text-sm text-surface-400 mt-0.5">{label}</p>
        {subtitle && <p className="text-xs text-surface-500 mt-0.5">{subtitle}</p>}
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            {trend > 0  ? <TrendingUp  className="w-3.5 h-3.5 text-emerald-400" /> :
             trend < 0  ? <TrendingDown className="w-3.5 h-3.5 text-red-400"    /> :
                          <Minus        className="w-3.5 h-3.5 text-surface-500" />}
            <span className={`text-xs font-medium ${
              trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-red-400' : 'text-surface-500'
            }`}>
              {Math.abs(trend)}% {trendLabel || 'vs last month'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
