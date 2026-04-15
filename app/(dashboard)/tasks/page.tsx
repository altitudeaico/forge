import { createServerSupabaseClient, getProfile } from '@/lib/supabase/server'
import { PageHeader, StatusBadge, Avatar, Card } from '@/components/ui'
import { formatDate, roleColors } from '@/lib/utils'
import { TaskBoard } from './TaskBoard'

export default async function TasksPage() {
  const supabase = createServerSupabaseClient()
  const profile = await getProfile() as { role: string } | null

  const { data: tasksData } = await supabase
    .from('tasks')
    .select(`
      *,
      projects(id, name),
      assignee:profiles!tasks_assignee_id_fkey(id, full_name, role)
    `)
    .order('sort_order')

  const tasks = tasksData as any[] | null

  const { data: projectsData } = await supabase
    .from('projects')
    .select('id, name')
    .in('status', ['active', 'discovery'])

  const projects = projectsData as any[] | null

  const tasksByStatus = {
    todo: tasks?.filter(t => t.status === 'todo') || [],
    in_progress: tasks?.filter(t => t.status === 'in_progress') || [],
    review: tasks?.filter(t => t.status === 'review') || [],
    done: tasks?.filter(t => t.status === 'done') || [],
  }

  const columns = [
    { id: 'todo', title: 'To Do', color: '#64748B' },
    { id: 'in_progress', title: 'In Progress', color: '#3B82F6' },
    { id: 'review', title: 'Review', color: '#F59E0B' },
    { id: 'done', title: 'Done', color: '#10B981' },
  ]

  return (
    <div>
      <PageHeader 
        title="Tasks"
        description="Track and manage tasks across all projects"
      />

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => (
          <div 
            key={column.id}
            className="rounded-xl p-4 min-h-[500px]"
            style={{ background: 'rgba(15, 23, 42, 0.5)' }}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ background: column.color }}
                />
                <span 
                  className="font-semibold text-sm"
                  style={{ color: 'var(--forge-heading)' }}
                >
                  {column.title}
                </span>
              </div>
              <span 
                className="text-xs px-2 py-0.5 rounded"
                style={{ background: 'var(--forge-border)', color: 'var(--forge-text)' }}
              >
                {tasksByStatus[column.id as keyof typeof tasksByStatus].length}
              </span>
            </div>

            {/* Tasks */}
            <div className="space-y-3">
              {tasksByStatus[column.id as keyof typeof tasksByStatus].map((task: any) => (
                <Card 
                  key={task.id} 
                  padding="sm"
                  hover
                  className="cursor-pointer"
                >
                  {/* Priority indicator */}
                  {task.priority === 'high' || task.priority === 'urgent' ? (
                    <div 
                      className="text-[10px] font-semibold uppercase mb-2 inline-block px-1.5 py-0.5 rounded"
                      style={{ 
                        background: task.priority === 'urgent' ? '#FEE2E2' : '#FEF3C7',
                        color: task.priority === 'urgent' ? '#991B1B' : '#92400E'
                      }}
                    >
                      {task.priority}
                    </div>
                  ) : null}

                  {/* Title */}
                  <h4 
                    className="font-medium text-sm mb-2"
                    style={{ color: 'var(--forge-heading)' }}
                  >
                    {task.title}
                  </h4>

                  {/* Project */}
                  {task.projects && (
                    <p 
                      className="text-xs mb-3"
                      style={{ color: 'var(--forge-muted)' }}
                    >
                      {task.projects.name}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    {/* Assignee */}
                    {task.assignee ? (
                      <Avatar 
                        name={task.assignee.full_name} 
                        size="sm"
                        color={roleColors[task.assignee.role || 'delivery']}
                      />
                    ) : (
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                        style={{ 
                          background: 'var(--forge-border)', 
                          color: 'var(--forge-muted)' 
                        }}
                      >
                        ?
                      </div>
                    )}

                    {/* Due date */}
                    {task.due_date && (
                      <span 
                        className="text-xs"
                        style={{ 
                          color: new Date(task.due_date) < new Date() 
                            ? '#EF4444' 
                            : 'var(--forge-muted)' 
                        }}
                      >
                        {formatDate(task.due_date)}
                      </span>
                    )}
                  </div>
                </Card>
              ))}

              {tasksByStatus[column.id as keyof typeof tasksByStatus].length === 0 && (
                <div 
                  className="text-center py-8 text-sm"
                  style={{ color: 'var(--forge-muted)' }}
                >
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
