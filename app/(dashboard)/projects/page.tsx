import { createServerSupabaseClient, getProfile } from '@/lib/supabase/server'
import { StatusBadge, ProgressBar, Card, PageHeader, EmptyState } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { NewProjectButton } from './NewProjectButton'

export default async function ProjectsPage() {
  const supabase = createServerSupabaseClient()
  const profile = await getProfile() as { role: string } | null
  
  const canSeeCommercial = profile?.role === 'super_admin'
  const canCreate = profile?.role === 'super_admin' || profile?.role === 'admin'

  const { data: projectsData } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false })

  const projects = projectsData as any[] | null

  return (
    <div>
      <PageHeader 
        title="Projects"
        description="Manage all your client projects"
        action={canCreate && <NewProjectButton />}
      />

      {projects && projects.length > 0 ? (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card hover className="block">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 
                        className="font-semibold text-lg truncate"
                        style={{ color: 'var(--forge-heading)' }}
                      >
                        {project.name}
                      </h3>
                      <StatusBadge status={project.status} />
                    </div>
                    <p 
                      className="text-sm"
                      style={{ color: 'var(--forge-muted)' }}
                    >
                      {project.client_name}
                      {project.due_date && (
                        <span className="mx-2">·</span>
                      )}
                      {project.due_date && `Due ${formatDate(project.due_date)}`}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {canSeeCommercial && project.value_total && (
                      <div className="text-right hidden md:block">
                        <p 
                          className="text-sm"
                          style={{ color: 'var(--forge-muted)' }}
                        >
                          Value
                        </p>
                        <p 
                          className="font-semibold"
                          style={{ color: '#10B981' }}
                        >
                          {formatCurrency(project.value_total)}
                        </p>
                      </div>
                    )}
                    <div className="w-32">
                      <p 
                        className="text-xs mb-1"
                        style={{ color: 'var(--forge-muted)' }}
                      >
                        Progress
                      </p>
                      <ProgressBar value={project.progress} />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon="▦"
            title="No projects yet"
            description="Create your first project to get started"
            action={canCreate ? {
              label: 'New Project',
              onClick: () => {}
            } : undefined}
          />
        </Card>
      )}
    </div>
  )
}
