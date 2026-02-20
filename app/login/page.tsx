'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '../../lib/supabaseClient'
import { useUser, signOut } from '../../lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'user' | 'asha'>('user')
  const [loadingLocal, setLoadingLocal] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoadingLocal(true)
    setMessage(null)
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error

      const userId = (data as any)?.user?.id || (data as any)?.id
      if (userId) {
        await supabase.from('profiles').upsert({ id: userId, email, name, role })
      }

      setMessage('Sign-up successful — check email for confirmation if enabled.')
    } catch (err: any) {
      setMessage(err.message || String(err))
    } finally {
      setLoadingLocal(false)
    }
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoadingLocal(true)
    setMessage(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/')
    } catch (err: any) {
      setMessage(err.message || String(err))
    } finally {
      setLoadingLocal(false)
    }
  }

  if (!loading && user) {
    return (
      <div style={{maxWidth:640, margin:'40px auto', padding:20}}>
        <h2>Signed in</h2>
        <p>{user.email}</p>
        <div style={{display:'flex', gap:8}}>
          <button
            onClick={async () => {
              await signOut()
              router.push('/login')
            }}
          >
            Sign Out
          </button>
          <button
            onClick={() => {
              router.push('/')
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{maxWidth:640, margin:'40px auto', padding:20}}>
      <h1>Login / Sign Up</h1>
      <form onSubmit={handleSignIn}>
        <div style={{marginBottom:12}}>
          <label style={{display:'block', marginBottom:6}}>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value as any)}>
            <option value="user">Normal User</option>
            <option value="asha">Asha Worker</option>
          </select>
        </div>

        <div style={{marginBottom:12}}>
          <label style={{display:'block', marginBottom:6}}>Name (optional)</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
        </div>

        <div style={{marginBottom:12}}>
          <label style={{display:'block', marginBottom:6}}>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>

        <div style={{marginBottom:12}}>
          <label style={{display:'block', marginBottom:6}}>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </div>

        <div style={{display:'flex', gap:8}}>
          <button type="submit" disabled={loadingLocal}>Sign In</button>
          <button type="button" onClick={handleSignUp} disabled={loadingLocal}>Sign Up</button>
        </div>
      </form>

      {message && <p style={{marginTop:12}}>{message}</p>}
    </div>
  )
}
