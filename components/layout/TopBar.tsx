'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/database.types'
import { getInitials, roleLabels, roleColors } from '@/lib/utils'

type Profile = Database['public']['Tables']['profiles']['Row']

export function TopBar({ profile }: { profile: Profile }) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header 
      className="h-14 px-4 md:px-6 flex items-center justify-between flex-shrink-0"
      style={{ 
        background: 'var(--forge-surface)',
        borderBottom: '1px solid var(--forge-border)'
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg, #E85D04 0%, #F97316 100%)' }}
        >
          ⚒
        </div>
        <span 
          className="font-bold text-lg tracking-tight"
          style={{ color: 'var(--forge-heading)' }}
        >
          Forge
        </span>
      </div>

      {/* User */}
      <div className="flex items-center gap-4">
        {/* Role badge */}
        <span 
          className="hidden md:inline-block px-2 py-1 rounded text-xs font-medium"
          style={{ 
            background: `${roleColors[profile.role]}20`,
            color: roleColors[profile.role]
          }}
        >
          {roleLabels[profile.role]}
        </span>

        {/* User dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2">
            <span 
              className="hidden md:inline text-sm"
              style={{ color: 'var(--forge-text)' }}
            >
              {profile.full_name || profile.email}
            </span>
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-sm"
              style={{ background: roleColors[profile.role] }}
            >
              {getInitials(profile.full_name || profile.email)}
            </div>
          </button>

          {/* Dropdown */}
          <div 
            className="absolute right-0 top-full mt-2 w-48 py-2 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
            style={{ 
              background: 'var(--forge-surface)',
              border: '1px solid var(--forge-border)'
            }}
          >
            <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--forge-border)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--forge-heading)' }}>
                {profile.full_name}
              </p>
              <p className="text-xs" style={{ color: 'var(--forge-muted)' }}>
                {profile.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--forge-border)] transition-colors"
              style={{ color: 'var(--forge-text)' }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
