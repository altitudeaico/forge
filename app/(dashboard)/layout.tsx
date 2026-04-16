'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { MobileNav } from '@/components/layout/MobileNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Profile will be fetched by each page that needs it
  // Middleware handles auth protection
  const profile = { role: 'super_admin', full_name: 'User', email: '' } as any

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--forge-bg)' }}>
      <TopBar profile={profile} />
      
      <div className="flex flex-1">
        <Sidebar profile={profile} />
        
        <main className="flex-1 p-6 pb-24 md:pb-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      <MobileNav profile={profile} />
    </div>
  )
}
