'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function NewProjectButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: formData.get('name') as string,
        client_name: formData.get('client_name') as string,
        client_email: formData.get('client_email') as string || null,
        description: formData.get('description') as string || null,
        due_date: formData.get('due_date') as string || null,
        value_total: formData.get('value_total') ? parseFloat(formData.get('value_total') as string) : null,
      })
      .select()
      .single()

    if (!error && data) {
      setIsOpen(false)
      router.push(`/projects/${data.id}`)
      router.refresh()
    }
    
    setLoading(false)
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="btn btn-primary">
        + New Project
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
          className="w-full max-w-lg rounded-xl p-6 animate-fade-in"
          style={{ background: 'var(--forge-surface)', border: '1px solid var(--forge-border)' }}
        >
          <h2 
            className="text-xl font-bold mb-6"
            style={{ color: 'var(--forge-heading)' }}
          >
            New Project
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--forge-heading)' }}>
                  Project Name *
                </label>
                <input name="name" required placeholder="e.g. Website Redesign" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--forge-heading)' }}>
                    Client Name *
                  </label>
                  <input name="client_name" required placeholder="e.g. Acme Corp" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--forge-heading)' }}>
                    Client Email
                  </label>
                  <input name="client_email" type="email" placeholder="client@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--forge-heading)' }}>
                  Description
                </label>
                <textarea name="description" rows={3} placeholder="Brief project description..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--forge-heading)' }}>
                    Due Date
                  </label>
                  <input name="due_date" type="date" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--forge-heading)' }}>
                    Value (£)
                  </label>
                  <input name="value_total" type="number" step="0.01" placeholder="5000" />
                </div>
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
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
