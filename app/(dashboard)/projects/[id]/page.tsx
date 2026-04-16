import { notFound } from 'next/navigation'
import { createServerSupabaseClient, getProfile } from '@/lib/supabase/server'
import { StatusBadge, ProgressBar, Card, Avatar } from '@/components/ui'
import { formatCurrency, formatDate, formatRelativeTime, roleColors } from '@/lib/utils'
import Link from 'next/link'
import { ProjectTabs } from './ProjectTabs'

interface Props {
  params: { id: string }
}

export default async function ProjectDetailPage({ params }: Props) {
  const supabase = createServerSupabaseClient()
  const profile = await getProfile() as { role: string } | null
  
  const canSeeCommercial = profile?.role === 'super_admin'

  const { data: projectData } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .single()

  const project = projectData as any

  if (!project) {
    notFound()
  }

  // Fetch related data
  const [
    { data: tasksData },
    { data: milestonesData },
    { data: activitiesData },
    { data: filesData },
    { data: assignmentsData }
  ] = await Promise.all([
    supabase.from('tasks').select('*').eq('project_id', params.id).order('sort_order'),
    supabase.from('milestones').select('*').eq('project_id', params.id).order('sort_order'),
    supabase.from('activities').select('*').eq('project_id', params.id).order('created_at', { ascending: false }).limit(10),
    supabase.from('files').select('*').eq('project_id', params.id).order('created_at', { ascending: false }),
    supabase.from('project_assignments').select('*, profiles(*)').eq('project_id', params.id)
  ])

  const tasks = tasksData as any[] | null
  const milestones = milestonesData as any[] | null
  const activities = activitiesData as any[] | null
  const files = filesData as any[] | null
  const assignments = assignmentsData as any[] | null

  const tasksByStatus = {
    todo: tasks?.filter(t => t.status === 'todo') || [],
    in_progress: tasks?.filter(t => t.status === 'in_progress') || [],
    review: tasks?.filter(t => t.status === 'review') || [],
    done: tasks?.filter(t => t.status === 'done') || [],
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-4" style={{ color: 'var(--forge-muted)' }}>
        <Link href="/projects" className="hover:underline">Projects</Link>
        <span>/</span>
        <span style={{ color: 'var(--forge-heading)' }}>{project.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--forge-heading)' }}>
              {project.name}
            </h1>
            <StatusBadge status={project.status} size="md" />
          </div>
          <p style={{ color: 'var(--forge-muted)' }}>
            {project.client_name}
            {project.due_date && <span className="mx-2">·</span>}
            {project.due_date && `Due ${formatDate(project.due_date)}`}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {canSeeCommercial && project.value_total && (
            <div className="text-right">
              <p className="text-xs" style={{ color: 'var(--forge-muted)' }}>Value</p>
              <p className="text-xl font-bold" style={{ color: '#10B981' }}>
                {formatCurrency(project.value_total)}
              </p>
            </div>
          )}
          <div className="w-40">
            <p className="text-xs mb-1" style={{ color: 'var(--forge-muted)' }}>Progress</p>
            <ProgressBar value={project.progress} size="md" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <p className="text-xs mb-1" style={{ color: 'var(--forge-muted)' }}>Tasks</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--forge-heading)' }}>
            {tasks?.length || 0}
          </p>
        </Card>
        <Card>
          <p className="text-xs mb-1" style={{ color: 'var(--forge-muted)' }}>Completed</p>
          <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
            {tasksByStatus.done.length}
          </p>
        </Card>
        <Card>
          <p className="text-xs mb-1" style={{ color: 'var(--forge-muted)' }}>In Progress</p>
          <p className="text-2xl font-bold" style={{ color: '#3B82F6' }}>
            {tasksByStatus.in_progress.length}
          </p>
        </Card>
        <Card>
          <p className="text-xs mb-1" style={{ color: 'var(--forge-muted)' }}>Files</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--forge-heading)' }}>
            {files?.length || 0}
          </p>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {project.description && (
            <Card>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--forge-heading)' }}>
                Description
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--forge-text)' }}>
                {project.description}
              </p>
            </Card>
          )}

          {/* Tasks Kanban */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--forge-heading)' }}>Tasks</h3>
              <Link href="/tasks" className="text-sm" style={{ color: 'var(--forge-accent)' }}>
                View board →
              </Link>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {['todo', 'in_progress', 'review', 'done'].map((status) => (
                <div 
                  key={status}
                  className="rounded-lg p-3"
                  style={{ background: 'rgba(15, 23, 42, 0.5)' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase" style={{ color: 'var(--forge-muted)' }}>
                      {status.replace('_', ' ')}
                    </span>
                    <span 
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ background: 'var(--forge-border)', color: 'var(--forge-text)' }}
                    >
                      {tasksByStatus[status as keyof typeof tasksByStatus].length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {tasksByStatus[status as keyof typeof tasksByStatus].slice(0, 3).map((task) => (
                      <div 
                        key={task.id}
                        className="p-2 rounded text-xs"
                        style={{ background: 'var(--forge-surface)', color: 'var(--forge-heading)' }}
                      >
                        {task.title}
                      </div>
                    ))}
                    {tasksByStatus[status as keyof typeof tasksByStatus].length > 3 && (
                      <p className="text-xs text-center py-1" style={{ color: 'var(--forge-muted)' }}>
                        +{tasksByStatus[status as keyof typeof tasksByStatus].length - 3} more
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          {milestones && milestones.length > 0 && (
            <Card>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--forge-heading)' }}>
                Milestones
              </h3>
              <div className="space-y-3">
                {milestones.map((milestone, index) => (
                  <div 
                    key={milestone.id}
                    className="flex items-center gap-3"
                  >
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                      style={{ 
                        background: milestone.completed_at ? '#D1FAE5' : 'var(--forge-border)',
                        color: milestone.completed_at ? '#065F46' : 'var(--forge-muted)'
                      }}
                    >
                      {milestone.completed_at ? '✓' : index + 1}
                    </div>
                    <div className="flex-1">
                      <p 
                        className="text-sm font-medium"
                        style={{ 
                          color: milestone.completed_at ? 'var(--forge-muted)' : 'var(--forge-heading)',
                          textDecoration: milestone.completed_at ? 'line-through' : 'none'
                        }}
                      >
                        {milestone.title}
                      </p>
                    </div>
                    {milestone.due_date && (
                      <span className="text-xs" style={{ color: 'var(--forge-muted)' }}>
                        {formatDate(milestone.due_date)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team */}
          <Card>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--forge-heading)' }}>
              Team
            </h3>
            {assignments && assignments.length > 0 ? (
              <div className="space-y-3">
                {assignments.map((assignment: any) => (
                  <div key={assignment.id} className="flex items-center gap-3">
                    <Avatar 
                      name={assignment.profiles?.full_name} 
                      size="sm"
                      color={roleColors[assignment.profiles?.role || 'delivery']}
                    />
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--forge-heading)' }}>
                        {assignment.profiles?.full_name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--forge-muted)' }}>
                        {assignment.role || 'Delivery'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--forge-muted)' }}>
                No team members assigned
              </p>
            )}
          </Card>

          {/* Activity */}
          <Card>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--forge-heading)' }}>
              Activity
            </h3>
            {activities && activities.length > 0 ? (
              <div className="space-y-4">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div 
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ background: 'var(--forge-accent)' }}
                    />
                    <div>
                      <p className="text-sm" style={{ color: 'var(--forge-heading)' }}>
                        {activity.title}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--forge-muted)' }}>
                        {formatRelativeTime(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--forge-muted)' }}>
                No activity yet
              </p>
            )}
          </Card>

          {/* Files */}
          <Card>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--forge-heading)' }}>
              Files
            </h3>
            {files && files.length > 0 ? (
              <div className="space-y-2">
                {files.slice(0, 5).map((file) => (
                  <div 
                    key={file.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-[var(--forge-border)] transition-colors cursor-pointer"
                  >
                    <span className="text-lg">📄</span>
                    <span className="text-sm truncate" style={{ color: 'var(--forge-text)' }}>
                      {file.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--forge-muted)' }}>
                No files uploaded
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
