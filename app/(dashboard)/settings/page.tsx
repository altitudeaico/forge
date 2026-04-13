import { redirect } from 'next/navigation'
import { createServerSupabaseClient, getProfile } from '@/lib/supabase/server'
import { PageHeader, Card, Avatar } from '@/components/ui'
import { roleLabels, roleColors } from '@/lib/utils'
import { InviteUserButton } from './InviteUserButton'

export default async function SettingsPage() {
  const profile = await getProfile()
  
  // Only super_admin can access
  if (profile?.role !== 'super_admin') {
    redirect('/dashboard')
  }

  const supabase = createServerSupabaseClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <PageHeader 
        title="Settings"
        description="Manage users and platform settings"
      />

      {/* Team Management */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 
            className="font-semibold text-lg"
            style={{ color: 'var(--forge-heading)' }}
          >
            Team Members
          </h3>
          <InviteUserButton />
        </div>

        <div className="space-y-4">
          {users?.map((user) => (
            <div 
              key={user.id}
              className="flex items-center justify-between p-4 rounded-lg"
              style={{ background: 'var(--forge-bg)' }}
            >
              <div className="flex items-center gap-4">
                <Avatar 
                  name={user.full_name} 
                  size="md"
                  color={roleColors[user.role]}
                />
                <div>
                  <p 
                    className="font-medium"
                    style={{ color: 'var(--forge-heading)' }}
                  >
                    {user.full_name || 'Unnamed User'}
                  </p>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--forge-muted)' }}
                  >
                    {user.email}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span 
                  className="px-3 py-1 rounded text-xs font-medium"
                  style={{ 
                    background: `${roleColors[user.role]}20`,
                    color: roleColors[user.role]
                  }}
                >
                  {roleLabels[user.role]}
                </span>
                
                {user.id !== profile?.id && (
                  <button 
                    className="text-sm hover:underline"
                    style={{ color: 'var(--forge-muted)' }}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Role Permissions */}
      <Card>
        <h3 
          className="font-semibold text-lg mb-6"
          style={{ color: 'var(--forge-heading)' }}
        >
          Role Permissions
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left px-4 py-3">Permission</th>
                <th className="text-center px-4 py-3">Super Admin</th>
                <th className="text-center px-4 py-3">Admin</th>
                <th className="text-center px-4 py-3">Delivery</th>
                <th className="text-center px-4 py-3">Client</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--forge-text)' }}>
              {[
                { name: 'View all projects', super_admin: true, admin: true, delivery: false, client: false },
                { name: 'View assigned projects', super_admin: true, admin: true, delivery: true, client: true },
                { name: 'Create projects', super_admin: true, admin: true, delivery: false, client: false },
                { name: 'Create/edit tasks', super_admin: true, admin: true, delivery: true, client: false },
                { name: 'View Knowledge Base', super_admin: true, admin: true, delivery: true, client: true },
                { name: 'Edit Knowledge Base', super_admin: true, admin: true, delivery: false, client: false },
                { name: 'View Commercial data', super_admin: true, admin: false, delivery: false, client: false },
                { name: 'Manage users', super_admin: true, admin: false, delivery: false, client: false },
                { name: 'Platform settings', super_admin: true, admin: false, delivery: false, client: false },
              ].map((perm, i) => (
                <tr key={i} className="table-row">
                  <td className="px-4 py-3 font-medium">{perm.name}</td>
                  <td className="px-4 py-3 text-center">
                    {perm.super_admin ? '✓' : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {perm.admin ? '✓' : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {perm.delivery ? '✓' : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {perm.client ? '✓' : '—'}
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
