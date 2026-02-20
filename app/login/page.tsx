'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '../../lib/supabaseClient'
import { useUser, signOut } from '../../lib/auth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Header from '@/components/header'

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
      <div className="min-h-screen bg-background flex flex-col">
        <Header showNav={false} onNavigate={() => router.push('/')} />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">You are signed in</h2>
            <p className="text-muted-foreground mb-6">{user.email}</p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => router.push('/')}
                className="w-full"
              >
                Go to Health Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  await signOut()
                  router.push('/login')
                }}
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showNav={false} onNavigate={() => router.push('/')} />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Welcome to OVIRA</h1>
          <p className="text-muted-foreground text-center mb-8">Login or create an account to track your health.</p>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Account Type</Label>
              <Select value={role} onValueChange={(value: any) => setRole(value)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Normal User</SelectItem>
                  <SelectItem value="asha">Asha Worker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name (optional)</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="pt-4 space-y-3">
              <Button
                className="w-full"
                onClick={handleSignIn}
                disabled={loadingLocal}
              >
                {loadingLocal ? 'Signing in...' : 'Sign In'}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSignUp}
                disabled={loadingLocal}
              >
                Sign Up
              </Button>
            </div>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-lg text-sm text-center ${message.includes('successful') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
