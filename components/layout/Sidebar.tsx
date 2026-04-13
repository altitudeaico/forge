'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Database } from '@/lib/supabase/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

const navItems = [
  { href: '/dashboard', icon: '◐', label: 'Dashboard' },
  { href: '/projects', icon: '▦', label: 'Projects' },
  { href: '/tasks', icon: '☑', label: 'Tasks' },
  { href: '/knowledge', icon: '◈', label: 'Knowledge' },
  { href: '/activity', icon: '◷', label: 'Activity' },
]

const adminItems = [
  { href: '/commercial', icon: '◉', label: 'Commercial', roles: ['super_admin'] },
  { href: '/settings', icon: '⚙', label: 'Settings', roles: ['super_admin'] },
]

export function Sidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  
  const allItems = [
    ...navItems,
    ...adminItems.filter(item => item.roles.includes(profile.role))
  ]

  return (
    <aside 
      className="w-56 p-4 flex-shrink-0 hide-mobile"
      style={{ 
        background: 'var(--forge-surface)',
        borderRight: '1px solid var(--forge-border)'
      }}
    >
      <nav className="space-y-1">
        {allItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm
                transition-all duration-150
              `}
              style={{
                background: isActive ? 'var(--forge-border)' : 'transparent',
                color: isActive ? 'var(--forge-heading)' : 'var(--forge-text)',
                fontWeight: isActive ? 500 : 400,
              }}
            >
              <span 
                className="text-base"
                style={{ opacity: isActive ? 1 : 0.7 }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
