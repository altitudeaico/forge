'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { UserRole } from '@/lib/supabase/database.types'

export function InviteUserButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const role = formData.get('role') as UserRole

    // In a real app, this would send an invite email via Supabase or Resend
    // For now, just simulate success
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSuccess(true)
    setLoading(false)
    
    setTimeout(() => {
      setIsOpen(false)
      setSuccess(false)
      router.refresh()
    }, 2000)
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="btn btn-primary">
        + Invite User
      </button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="w-full max-w-md rounded-xl p-6 animate-fade-in"
          style={{ background: 'var(--forge-surface)', border: '1px solid var(--forge-border)' }}
        >
          {success ? (
            <div className="text-center py-8">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: '#D1FAE5' }}
              >
                <span className="text-2xl">✓</span>
              </div>
              <h3 
                className="text-lg font-semibold mb-2"
                style={{ color: 'var(--forge-heading)' }}
              >
                Invite Sent!
              </h3>
              <p style={{ color: 'var(--forge-muted)' }}>
                The user will receive an email with login instructions.
              </p>
            </div>
          ) : (
            <>
              <h2 
                className="text-xl font-bold mb-6"
                style={{ color: 'var(--forge-heading)' }}
              >
                Invite User
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--forge-heading)' }}>
                      Email Address *
                    </label>
                    <input 
                      name="email" 
                      type="email"
                      required 
                      placeholder="user@example.com" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--forge-heading)' }}>
                      Role *
                    </label>
                    <select name="role" required>
                      <option value="">Select a role...</option>
                      <option value="admin">Admin</option>
                      <option value="delivery">Delivery Partner</option>
                      <option value="client">Client</option>
                    </select>
                  </div>

                  <div 
                    className="p-3 rounded-lg text-sm"
                    style={{ background: 'var(--forge-bg)', color: 'var(--forge-text)' }}
                  >
                    <strong style={{ color: 'var(--forge-heading)' }}>Role access:</strong>
                    <ul className="mt-2 space-y-1 list-disc list-inside" style={{ color: 'var(--forge-muted)' }}>
                      <li><strong>Admin</strong> — Full project access, no commercial data</li>
                      <li><strong>Delivery Partner</strong> — Assigned projects only</li>
                      <li><strong>Client</strong> — Their own projects only</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsOpen(false)} 
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? 'Sending...' : 'Send Invite'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  )
}
