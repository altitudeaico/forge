'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--forge-bg)' }}>
        <div className="w-full max-w-md text-center">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: '#D1FAE5' }}
          >
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--forge-heading)' }}>
            Check your email
          </h1>
          <p style={{ color: 'var(--forge-muted)' }}>
            We&apos;ve sent a confirmation link to <strong>{email}</strong>. 
            Click the link to activate your account.
          </p>
          <Link 
            href="/login" 
            className="btn btn-secondary mt-6 inline-flex"
          >
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--forge-bg)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
              style={{ background: 'linear-gradient(135deg, #E85D04 0%, #F97316 100%)' }}
            >
              ⚒
            </div>
            <span className="text-2xl font-bold" style={{ color: 'var(--forge-heading)' }}>Forge</span>
          </div>
          <p style={{ color: 'var(--forge-muted)' }}>Create your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="card p-8">
          {error && (
            <div className="mb-6 p-4 rounded-lg text-sm" style={{ background: '#FEE2E2', color: '#991B1B' }}>
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--forge-heading)' }}>
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Smith"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--forge-heading)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--forge-heading)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
            />
            <p className="mt-2 text-xs" style={{ color: 'var(--forge-muted)' }}>
              Minimum 8 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--forge-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--forge-accent)' }}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
