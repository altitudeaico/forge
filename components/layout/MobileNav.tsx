'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Database } from '@/lib/supabase/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

const navItems = [
  { href: '/dashboard', icon: '◐', label: 'Home' },
  { href: '/projects', icon: '▦', label: 'Projects' },
  { href: '/tasks', icon: '☑', label: 'Tasks' },
  { href: '/knowledge', icon: '◈', label: 'Knowledge' },
  { href: '/activity', icon: '◷', label: 'Activity' },
]

export function MobileNav({ profile }: { profile: Profile }) {
  const pathname = usePathname()

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 show-mobile justify-around py-2 pb-safe"
      style={{ 
        background: 'var(--forge-surface)',
        borderTop: '1px solid var(--forge-border)'
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href || 
          (item.href !== '/dashboard' && pathname.startsWith(item.href))
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 px-4 py-2"
          >
            <span 
              className="text-xl"
              style={{ color: isActive ? 'var(--forge-accent)' : 'var(--forge-muted)' }}
            >
              {item.icon}
            </span>
            <span 
              className="text-[10px]"
              style={{ color: isActive ? 'var(--forge-accent)' : 'var(--forge-muted)' }}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
