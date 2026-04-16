import { redirect } from 'next/navigation'
import { createServerSupabaseClient, getProfile } from '@/lib/supabase/server'
import { PageHeader, Card, StatCard, StatusBadge, ProgressBar } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function CommercialPage() {
  const profile = await getProfile() as { role: string } | null
  
  // Only super_admin can access
  if (profile?.role !== 'super_admin') {
    redirect('/dashboard')
  }

  const supabase = createServerSupabaseClient()

  const { data: projectsData } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false })

  const projects = projectsData as any[] | null

  // Calculate metrics
  const totalRevenue = projects?.reduce((sum, p) => sum + (p.value_total || 0), 0) || 0
  const totalPaid = projects?.reduce((sum, p) => sum + (p.value_paid || 0), 0) || 0
  const outstanding = totalRevenue - totalPaid
  const avgMargin = projects?.length 
    ? projects.reduce((sum, p) => sum + (p.margin_percent || 0), 0) / projects.length 
    : 0

  const activeProjects = projects?.filter(p => p.status === 'active') || []
  const completedProjects = projects?.filter(p => p.status === 'complete') || []

  return (
    <div>
      <PageHeader 
        title="Commercial"
        description="Financial overview and project profitability"
      />

      {/* Revenue Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          label="Total Revenue" 
          value={formatCurrency(totalRevenue)} 
          accent 
        />
        <StatCard 
          label="Collected" 
          value={formatCurrency(totalPaid)}
        />
        <StatCard 
          label="Outstanding" 
          value={formatCurrency(outstanding)}
        />
        <StatCard 
          label="Avg. Margin" 
          value={`${avgMargin.toFixed(0)}%`}
        />
      </div>

      {/* Pipeline */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Active Projects Revenue */}
        <Card>
          <h3 
            className="font-semibold mb-4"
            style={{ color: 'var(--forge-heading)' }}
          >
            Active Pipeline
          </h3>
          
          {activeProjects.length > 0 ? (
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/projects/${project.id}`}
                      className="font-medium text-sm hover:underline"
                      style={{ color: 'var(--forge-heading)' }}
                    >
                      {project.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span 
                        className="text-xs"
                        style={{ color: 'var(--forge-muted)' }}
                      >
                        {project.client_name}
                      </span>
                      <span 
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ 
                          background: project.margin_percent && project.margin_percent >= 40 
                            ? '#D1FAE5' 
                            : project.margin_percent && project.margin_percent >= 25
                            ? '#FEF3C7'
                            : '#FEE2E2',
                          color: project.margin_percent && project.margin_percent >= 40 
                            ? '#065F46' 
                            : project.margin_percent && project.margin_percent >= 25
                            ? '#92400E'
                            : '#991B1B'
                        }}
                      >
                        {project.margin_percent || 0}% margin
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p 
                      className="font-semibold"
                      style={{ color: '#10B981' }}
                    >
                      {formatCurrency(project.value_total)}
                    </p>
                    <p 
                      className="text-xs"
                      style={{ color: 'var(--forge-muted)' }}
                    >
                      {formatCurrency(project.value_paid)} paid
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p 
              className="text-sm text-center py-4"
              style={{ color: 'var(--forge-muted)' }}
            >
              No active projects
            </p>
          )}
        </Card>

        {/* Payment Status */}
        <Card>
          <h3 
            className="font-semibold mb-4"
            style={{ color: 'var(--forge-heading)' }}
          >
            Payment Status
          </h3>

          <div className="space-y-4">
            {/* Collection Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span 
                  className="text-sm"
                  style={{ color: 'var(--forge-muted)' }}
                >
                  Collection Rate
                </span>
                <span 
                  className="font-semibold"
                  style={{ color: 'var(--forge-heading)' }}
                >
                  {totalRevenue > 0 ? Math.round((totalPaid / totalRevenue) * 100) : 0}%
                </span>
              </div>
              <ProgressBar 
                value={totalRevenue > 0 ? (totalPaid / totalRevenue) * 100 : 0} 
                showLabel={false} 
                size="md"
              />
            </div>

            {/* Outstanding Invoices */}
            <div className="pt-4 border-t" style={{ borderColor: 'var(--forge-border)' }}>
              <h4 
                className="text-sm font-medium mb-3"
                style={{ color: 'var(--forge-heading)' }}
              >
                Outstanding
              </h4>
              
              {projects?.filter(p => (p.value_total || 0) > (p.value_paid || 0)).slice(0, 5).map((project) => (
                <div 
                  key={project.id}
                  className="flex items-center justify-between py-2"
                >
                  <span 
                    className="text-sm"
                    style={{ color: 'var(--forge-text)' }}
                  >
                    {project.name}
                  </span>
                  <span 
                    className="font-medium text-sm"
                    style={{ color: '#F59E0B' }}
                  >
                    {formatCurrency((project.value_total || 0) - (project.value_paid || 0))}
                  </span>
                </div>
              )) || (
                <p 
                  className="text-sm"
                  style={{ color: 'var(--forge-muted)' }}
                >
                  All invoices collected
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* All Projects Table */}
      <Card padding="none">
        <div className="p-4 border-b" style={{ borderColor: 'var(--forge-border)' }}>
          <h3 
            className="font-semibold"
            style={{ color: 'var(--forge-heading)' }}
          >
            All Projects
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left px-4 py-3">Project</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Value</th>
                <th className="text-right px-4 py-3">Paid</th>
                <th className="text-right px-4 py-3">Margin</th>
                <th className="text-left px-4 py-3">Due</th>
              </tr>
            </thead>
            <tbody>
              {projects?.map((project) => (
                <tr key={project.id} className="table-row">
                  <td className="px-4 py-3">
                    <Link 
                      href={`/projects/${project.id}`}
                      className="font-medium hover:underline"
                      style={{ color: 'var(--forge-heading)' }}
                    >
                      {project.name}
                    </Link>
                    <p 
                      className="text-xs"
                      style={{ color: 'var(--forge-muted)' }}
                    >
                      {project.client_name}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={project.status} />
                  </td>
                  <td 
                    className="px-4 py-3 text-right font-medium"
                    style={{ color: '#10B981' }}
                  >
                    {formatCurrency(project.value_total)}
                  </td>
                  <td 
                    className="px-4 py-3 text-right"
                    style={{ color: 'var(--forge-text)' }}
                  >
                    {formatCurrency(project.value_paid)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span 
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ 
                        background: project.margin_percent && project.margin_percent >= 40 
                          ? '#D1FAE5' 
                          : project.margin_percent && project.margin_percent >= 25
                          ? '#FEF3C7'
                          : '#FEE2E2',
                        color: project.margin_percent && project.margin_percent >= 40 
                          ? '#065F46' 
                          : project.margin_percent && project.margin_percent >= 25
                          ? '#92400E'
                          : '#991B1B'
                      }}
                    >
                      {project.margin_percent || 0}%
                    </span>
                  </td>
                  <td 
                    className="px-4 py-3 text-sm"
                    style={{ color: 'var(--forge-muted)' }}
                  >
                    {project.due_date ? formatDate(project.due_date) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
