import { cn } from '@/lib/utils'

// Stat Card
interface StatCardProps {
  label: string
  value: string | number
  prefix?: string
  suffix?: string
  accent?: boolean
  trend?: 'up' | 'down' | null
  trendValue?: string
}

export function StatCard({ 
  label, 
  value, 
  prefix = '', 
  suffix = '',
  accent = false,
  trend,
  trendValue
}: StatCardProps) {
  return (
    <div 
      className="rounded-xl p-5"
      style={{ 
        background: accent 
          ? 'linear-gradient(135deg, #E85D04 0%, #F97316 100%)' 
          : 'var(--forge-surface)',
        border: accent ? 'none' : '1px solid var(--forge-border)'
      }}
    >
      <div 
        className="text-xs font-medium mb-1"
        style={{ color: accent ? 'rgba(255,255,255,0.8)' : 'var(--forge-muted)' }}
      >
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <span 
          className="text-2xl font-bold"
          style={{ color: accent ? '#fff' : 'var(--forge-heading)' }}
        >
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </span>
        {trend && trendValue && (
          <span 
            className="text-xs font-medium"
            style={{ color: trend === 'up' ? '#10B981' : '#EF4444' }}
          >
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
    </div>
  )
}

// Status Badge
interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

const statusStyles: Record<string, { bg: string; text: string }> = {
  discovery: { bg: '#FEF3C7', text: '#92400E' },
  active: { bg: '#D1FAE5', text: '#065F46' },
  paused: { bg: '#E5E7EB', text: '#374151' },
  complete: { bg: '#DBEAFE', text: '#1E40AF' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B' },
  todo: { bg: '#E5E7EB', text: '#374151' },
  in_progress: { bg: '#DBEAFE', text: '#1E40AF' },
  review: { bg: '#FEF3C7', text: '#92400E' },
  done: { bg: '#D1FAE5', text: '#065F46' },
  low: { bg: '#E5E7EB', text: '#374151' },
  medium: { bg: '#DBEAFE', text: '#1E40AF' },
  high: { bg: '#FEF3C7', text: '#92400E' },
  urgent: { bg: '#FEE2E2', text: '#991B1B' },
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const style = statusStyles[status] || statusStyles.todo
  
  return (
    <span 
      className={cn(
        'inline-flex items-center rounded font-semibold uppercase tracking-wide',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      )}
      style={{ background: style.bg, color: style.text }}
    >
      {status.replace('_', ' ')}
    </span>
  )
}

// Progress Bar
interface ProgressBarProps {
  value: number
  size?: 'sm' | 'md'
  showLabel?: boolean
}

export function ProgressBar({ value, size = 'sm', showLabel = true }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div 
        className={cn(
          'flex-1 rounded-full overflow-hidden',
          size === 'sm' ? 'h-1.5' : 'h-2'
        )}
        style={{ background: 'var(--forge-border)' }}
      >
        <div 
          className="h-full rounded-full transition-all duration-300"
          style={{ 
            width: `${Math.min(100, Math.max(0, value))}%`,
            background: 'var(--forge-accent)'
          }}
        />
      </div>
      {showLabel && (
        <span 
          className="text-xs tabular-nums"
          style={{ color: 'var(--forge-muted)' }}
        >
          {value}%
        </span>
      )}
    </div>
  )
}

// Empty State
interface EmptyStateProps {
  icon: string
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div 
        className="text-4xl mb-4 opacity-50"
      >
        {icon}
      </div>
      <h3 
        className="text-lg font-medium mb-2"
        style={{ color: 'var(--forge-heading)' }}
      >
        {title}
      </h3>
      <p 
        className="text-sm mb-6 max-w-sm mx-auto"
        style={{ color: 'var(--forge-muted)' }}
      >
        {description}
      </p>
      {action && (
        <button onClick={action.onClick} className="btn btn-primary">
          {action.label}
        </button>
      )}
    </div>
  )
}

// Avatar
interface AvatarProps {
  name: string | null
  src?: string | null
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export function Avatar({ name, src, size = 'md', color }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  if (src) {
    return (
      <img 
        src={src} 
        alt={name || 'Avatar'}
        className={cn('rounded-full object-cover', sizeClasses[size])}
      />
    )
  }

  return (
    <div 
      className={cn(
        'rounded-full flex items-center justify-center font-medium text-white',
        sizeClasses[size]
      )}
      style={{ background: color || 'var(--forge-accent)' }}
    >
      {initials}
    </div>
  )
}

// Card
interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  onClick?: () => void
}

export function Card({ 
  children, 
  className, 
  padding = 'md',
  hover = false,
  onClick 
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  }

  return (
    <div 
      className={cn(
        'rounded-xl',
        paddingClasses[padding],
        hover && 'cursor-pointer transition-all duration-150 hover:border-[var(--forge-accent)]',
        className
      )}
      style={{ 
        background: 'var(--forge-surface)',
        border: '1px solid var(--forge-border)'
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// Page Header
interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 
          className="text-2xl font-bold"
          style={{ color: 'var(--forge-heading)' }}
        >
          {title}
        </h1>
        {description && (
          <p 
            className="text-sm mt-1"
            style={{ color: 'var(--forge-muted)' }}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// Loading Spinner
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div 
      className={cn('animate-spin rounded-full border-2 border-t-transparent', sizeClasses[size])}
      style={{ borderColor: 'var(--forge-border)', borderTopColor: 'transparent' }}
    />
  )
}

// Loading State
export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Spinner size="lg" />
    </div>
  )
}
