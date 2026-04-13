import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/server'
import { StatCard, StatusBadge, ProgressBar, Card, PageHeader } from '@/components/ui'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()
  const profile = await getProfile()
  
  const canSeeCommercial = profile?.role === 'super_admin'
  
  // Fetch projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(5)

  // Fetch tasks
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, projects(name)')
    .neq('status', 'done')
    .order('due_date', { ascending: true })
    .limit(5)

  // Fetch recent activity
  const { data: activities } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  // Calculate stats
  const activeProjects = projects?.filter(p => p.status === 'active').length || 0
  const pendingTasks = tasks?.length || 0
  const totalRevenue = canSeeCommercial 
    ? projects?.reduce((sum, p) => sum + (p.value_total || 0), 0) || 0
    : null

  return (
    <div>
      <PageHeader 
        title={`Welcome back${profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}`}
        description="Here's what's happening across your projects"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Projects" value={activeProjects} />
        <StatCard label="Pending Tasks" value={pendingTasks} />
        {canSeeCommercial && (
          <StatCard label="Total Revenue" value={totalRevenue || 0} prefix="£" accent />
        )}
        <StatCard label="This Month" value={3} suffix=" completed" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 
              className="text-lg font-semibold"
              style={{ color: 'var(--forge-heading)' }}
            >
              Recent Projects
            </h2>
            <Link 
              href="/projects"
              className="text-sm"
              style={{ color: 'var(--forge-accent)' }}
            >
              View all →
            </Link>
          </div>

          <Card padding="none">
            {projects && projects.length > 0 ? (
              <div className="divide-y" style={{ borderColor: 'var(--forge-border)' }}>
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-center justify-between p-4 hover:bg-[var(--forge-border)] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="font-medium truncate"
                        style={{ color: 'var(--forge-heading)' }}
                      >
                        {project.name}
                      </h3>
                      <p 
                        className="text-sm truncate"
                        style={{ color: 'var(--forge-muted)' }}
                      >
                        {project.client_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <StatusBadge status={project.status} />
                      <div className="w-20 hidden sm:block">
                        <ProgressBar value={project.progress} showLabel />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center" style={{ color: 'var(--forge-muted)' }}>
                No projects yet
              </div>
            )}
          </Card>
        </div>

        {/* Activity Feed */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 
              className="text-lg font-semibold"
              style={{ color: 'var(--forge-heading)' }}
            >
              Recent Activity
            </h2>
            <Link 
              href="/activity"
              className="text-sm"
              style={{ color: 'var(--forge-accent)' }}
            >
              View all →
            </Link>
          </div>

          <Card padding="sm">
            {activities && activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                      style={{ 
                        background: activity.type === 'payment' ? '#D1FAE5' :
                                   activity.type === 'meeting' ? '#DBEAFE' :
                                   activity.type === 'task' ? '#FEF3C7' :
                                   'var(--forge-border)',
                        color: activity.type === 'payment' ? '#065F46' :
                               activity.type === 'meeting' ? '#1E40AF' :
                               activity.type === 'task' ? '#92400E' :
                               'var(--forge-muted)'
                      }}
                    >
                      {activity.type === 'payment' ? '£' :
                       activity.type === 'meeting' ? '◷' :
                       activity.type === 'task' ? '☑' :
                       '▦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p 
                        className="text-sm truncate"
                        style={{ color: 'var(--forge-heading)' }}
                      >
                        {activity.title}
                      </p>
                      <p 
                        className="text-xs"
                        style={{ color: 'var(--forge-muted)' }}
                      >
                        {formatRelativeTime(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-sm" style={{ color: 'var(--forge-muted)' }}>
                No recent activity
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Tasks Due Soon */}
      {tasks && tasks.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 
              className="text-lg font-semibold"
              style={{ color: 'var(--forge-heading)' }}
            >
              Tasks Due Soon
            </h2>
            <Link 
              href="/tasks"
              className="text-sm"
              style={{ color: 'var(--forge-accent)' }}
            >
              View all →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.slice(0, 3).map((task: any) => (
              <Card key={task.id} hover>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 
                    className="font-medium text-sm"
                    style={{ color: 'var(--forge-heading)' }}
                  >
                    {task.title}
                  </h3>
                  <StatusBadge status={task.status} size="sm" />
                </div>
                <p 
                  className="text-xs"
                  style={{ color: 'var(--forge-muted)' }}
                >
                  {task.projects?.name}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
