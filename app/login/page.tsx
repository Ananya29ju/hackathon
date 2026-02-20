'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, ShieldCheck, User, Users } from 'lucide-react'
import supabase from '@/lib/supabaseClient'
import { useUser, signOut } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'user' | 'asha'>('user')
  const [loadingLocal, setLoadingLocal] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

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

      setMessage({ type: 'success', text: 'Sign-up successful! Check your email for confirmation.' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || String(err) })
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
      setMessage({ type: 'error', text: err.message || String(err) })
    } finally {
      setLoadingLocal(false)
    }
  }

  if (!loading && user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-muted to-background p-4">
        <Card className="w-full max-w-md shadow-2xl border-primary/20 bg-card/50 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3">
            <Button className="w-full" onClick={() => router.push('/')}>
              Go to Dashboard
            </Button>
            <Button variant="outline" className="w-full" onClick={() => signOut()}>
              Sign Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-muted to-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">OVIRA</h1>
          <p className="text-muted-foreground italic">Empowering women with early cancer risk detection.</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card className="shadow-2xl border-primary/10 bg-card/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {message && (
                    <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mt-4">
                      <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={loadingLocal}>
                    {loadingLocal && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="shadow-2xl border-primary/10 bg-card/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Join our platform to start your health assessment.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>I am a...</Label>
                    <Select onValueChange={(value) => setRole(value as any)} defaultValue={role}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">
                          <div className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>General User</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="asha">
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            <span>ASHA Worker</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Ananya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input
                      id="password-signup"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {message && (
                    <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mt-4">
                      <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={loadingLocal}>
                    {loadingLocal && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
