'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, ShieldCheck, User, Users } from 'lucide-react'
import Header from '@/components/header'
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: role
          }
        }
      })
      if (error) throw error

      const userId = data?.user?.id
      if (userId) {
        await supabase.from('profiles').upsert({ id: userId, email, name, role })
      }

      // Redirect directly to main page
      router.push('/')
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
      <div className="min-h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-background via-lavender-50/10 to-pink-50/10 flex flex-col">
        <Header
          showNav={false}
          onNavigate={() => router.push('/')}
          isLoggedIn={true}
          userName={user?.user_metadata?.name || user?.email || 'User'}
        />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-2xl border-primary/20 bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-[2rem]">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/5">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-black tracking-tight">Welcome back</CardTitle>
              <CardDescription className="font-medium italic">{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground text-sm">You are currently logged in to your health portal.</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pb-8">
              <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold" onClick={() => router.push('/')}>
                Go to Dashboard
              </Button>
              <Button variant="ghost" className="w-full h-12 rounded-xl text-muted-foreground hover:bg-primary/5" onClick={() => signOut()}>
                Sign Out
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-background via-lavender-50/10 to-pink-50/10 flex flex-col">
      <Header showNav={false} onNavigate={() => router.push('/')} isLoggedIn={false} />
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md space-y-8 animate-in fade-in duration-700">
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-black tracking-tighter text-foreground">OVIRA</h1>
            <p className="text-muted-foreground font-medium italic">Empowering health with early validation.</p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-primary/5 rounded-2xl h-14 mb-6">
              <TabsTrigger value="signin" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="animate-in fade-in slide-in-from-bottom-2">
              <Card className="shadow-2xl border-none bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-[2.5rem] p-4">
                <CardHeader>
                  <CardTitle className="text-2xl font-black">Login</CardTitle>
                  <CardDescription className="font-medium">Enter your credentials to access your dashboard.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-bold text-foreground/70 px-1">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 rounded-xl bg-white/50 border-muted focus:border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="font-bold text-foreground/70 px-1">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 rounded-xl bg-white/50 border-muted focus:border-primary"
                        required
                      />
                    </div>
                    {message && (
                      <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mt-4 rounded-xl">
                        <AlertDescription className="font-medium">{message.text}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-lg shadow-primary/20 transition-all" type="submit" disabled={loadingLocal}>
                      {loadingLocal && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      Sign In
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="signup" className="animate-in fade-in slide-in-from-bottom-2">
              <Card className="shadow-2xl border-none bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-[2.5rem] p-4">
                <CardHeader>
                  <CardTitle className="text-2xl font-black">Create Account</CardTitle>
                  <CardDescription className="font-medium">Join our platform to start your health assessment.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label className="font-bold text-foreground/70 px-1">I am a...</Label>
                      <Select onValueChange={(value: string) => setRole(value as any)} defaultValue={role}>
                        <SelectTrigger className="h-12 rounded-xl bg-white/50">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-primary/10">
                          <SelectItem value="user">
                            <div className="flex items-center font-medium">
                              <User className="mr-2 h-4 w-4 text-primary" />
                              <span>General User</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="asha">
                            <div className="flex items-center font-medium">
                              <Users className="mr-2 h-4 w-4 text-primary" />
                              <span>ASHA Worker</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-bold text-foreground/70 px-1">Username</Label>
                      <Input
                        id="name"
                        placeholder="Choose a username"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12 rounded-xl bg-white/50 border-muted focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-signup" className="font-bold text-foreground/70 px-1">Email</Label>
                      <Input
                        id="email-signup"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 rounded-xl bg-white/50 border-muted focus:border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-signup" className="font-bold text-foreground/70 px-1">Password</Label>
                      <Input
                        id="password-signup"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 rounded-xl bg-white/50 border-muted focus:border-primary"
                        required
                      />
                    </div>
                    {message && (
                      <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mt-4 rounded-xl">
                        <AlertDescription className="font-medium">{message.text}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-lg shadow-primary/20 transition-all" type="submit" disabled={loadingLocal}>
                      {loadingLocal && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      Create Account
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
