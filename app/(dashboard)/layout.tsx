import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { MobileNav } from '@/components/layout/MobileNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getProfile()
  
  if (!profile) {
    redirect('/login')
  }

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
