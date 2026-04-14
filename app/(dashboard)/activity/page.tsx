import { createServerSupabaseClient, getProfile } from '@/lib/supabase/server'
import { PageHeader, Card, Avatar } from '@/components/ui'
import { formatDate, formatRelativeTime, roleColors } from '@/lib/utils'
import Link from 'next/link'

const activityIcons: Record<string, string> = {
  project: '▦',
  task: '☑',
  meeting: '◷',
  payment: '£',
  invoice: '📄',
  comment: '💬',
  file: '📎',
  assignment: '👤',
}

const activityColors: Record<string, { bg: string; text: string }> = {
  project: { bg: '#DBEAFE', text: '#1E40AF' },
  task: { bg: '#FEF3C7', text: '#92400E' },
  meeting: { bg: '#E0E7FF', text: '#3730A3' },
  payment: { bg: '#D1FAE5', text: '#065F46' },
  invoice: { bg: '#FEE2E2', text: '#991B1B' },
  comment: { bg: '#F3E8FF', text: '#6B21A8' },
  file: { bg: '#E5E7EB', text: '#374151' },
  assignment: { bg: '#CFFAFE', text: '#0E7490' },
}

export default async function ActivityPage() {
  const supabase = createServerSupabaseClient()
  const profile = await getProfile()

  const { data: activitiesData } = await supabase
    .from('activities')
    .select(`
      *,
      user:profiles(id, full_name, role),
      project:projects(id, name)
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  const activities = activitiesData as any[] | null

  // Group activities by date
  const groupedActivities: Record<string, any[]> = {}
  activities?.forEach((activity) => {
    const date = new Date(activity.created_at).toDateString()
    if (!groupedActivities[date]) {
      groupedActivities[date] = []
    }
    groupedActivities[date].push(activity)
  })

  const dateGroups = Object.entries(groupedActivities)

  return (
    <div>
      <PageHeader 
        title="Activity"
        description="Recent activity across all projects"
      />

      {dateGroups.length > 0 ? (
        <div className="space-y-8">
          {dateGroups.map(([date, dayActivities]) => (
            <div key={date}>
              {/* Date Header */}
              <div 
                className="text-sm font-semibold mb-4 sticky top-0 py-2"
                style={{ 
                  color: 'var(--forge-muted)',
                  background: 'var(--forge-bg)'
                }}
              >
                {new Date(date).toDateString() === new Date().toDateString() 
                  ? 'Today'
                  : new Date(date).toDateString() === new Date(Date.now() - 86400000).toDateString()
                  ? 'Yesterday'
                  : formatDate(date)
                }
              </div>

              {/* Activities */}
              <div className="space-y-3">
                {dayActivities.map((activity: any) => {
                  const colors = activityColors[activity.type] || activityColors.task
                  
                  return (
                    <Card key={activity.id} padding="sm">
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: colors.bg, color: colors.text }}
                        >
                          {activityIcons[activity.type] || '•'}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p 
                                className="font-medium"
                                style={{ color: 'var(--forge-heading)' }}
                              >
                                {activity.title}
                              </p>
                              {activity.description && (
                                <p 
                                  className="text-sm mt-1"
                                  style={{ color: 'var(--forge-text)' }}
                                >
                                  {activity.description}
                                </p>
                              )}
                            </div>
                            <span 
                              className="text-xs flex-shrink-0"
                              style={{ color: 'var(--forge-muted)' }}
                            >
                              {formatRelativeTime(activity.created_at)}
                            </span>
                          </div>

                          {/* Meta */}
                          <div className="flex items-center gap-4 mt-3">
                            {activity.user && (
                              <div className="flex items-center gap-2">
                                <Avatar 
                                  name={activity.user.full_name} 
                                  size="sm"
                                  color={roleColors[activity.user.role || 'delivery']}
                                />
                                <span 
                                  className="text-xs"
                                  style={{ color: 'var(--forge-muted)' }}
                                >
                                  {activity.user.full_name}
                                </span>
                              </div>
                            )}
                            {activity.project && (
                              <Link 
                                href={`/projects/${activity.project.id}`}
                                className="text-xs hover:underline"
                                style={{ color: 'var(--forge-accent)' }}
                              >
                                {activity.project.name}
                              </Link>
                            )}
                            {activity.is_internal && (
                              <span 
                                className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded"
                                style={{ background: 'var(--forge-border)', color: 'var(--forge-muted)' }}
                              >
                                Internal
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12" style={{ color: 'var(--forge-muted)' }}>
            No activity yet
          </div>
        </Card>
      )}
    </div>
  )
}
