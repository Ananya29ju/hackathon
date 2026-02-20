'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, User, Mail, Save, ChevronLeft, CheckCircle2 } from 'lucide-react'
import Header from './header'
import supabase from '@/lib/supabaseClient'
import { useUser } from '@/lib/auth'

interface ProfileViewProps {
    onNavigate: (view: string) => void
    onStartAssessment: (type: 'menstrual' | 'cancer' | 'both') => void
}

export default function ProfileView({ onNavigate, onStartAssessment }: ProfileViewProps) {
    const { user, loading: userLoading } = useUser()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    useEffect(() => {
        if (user) {
            setName(user.user_metadata?.name || '')
            setEmail(user.email || '')
        }
    }, [user])

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)
        setMessage(null)

        try {
            // 1. Update Auth Metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: { name: name }
            })

            if (authError) throw authError

            // 2. Update Profiles Table
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ name })
                .eq('id', user.id)

            if (profileError) throw profileError

            setMessage({
                type: 'success',
                text: 'Profile updated successfully!'
            })
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || String(err) })
        } finally {
            setLoading(false)
        }
    }

    if (userLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/30 via-background to-primary/5 selection:bg-primary/20">
            <Header
                onNavigate={onNavigate}
                onStartAssessment={onStartAssessment}
                userName={user?.user_metadata?.name || user?.email || 'User'}
                isLoggedIn={!!user}
            />

            <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full space-y-8">
                <Button
                    variant="ghost"
                    onClick={() => onNavigate('landing')}
                    className="group gap-2 text-muted-foreground hover:text-primary transition-all font-black text-xs uppercase tracking-widest hover:bg-primary/5 rounded-full px-6"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Button>

                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="space-y-3">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground">My Profile</h1>
                        <p className="text-muted-foreground font-medium italic text-lg leading-relaxed">Manage your personal information and account settings.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        <Card className="md:col-span-2 shadow-2xl border-none bg-white/60 dark:bg-black/40 backdrop-blur-3xl rounded-[3rem] overflow-hidden animate-in fade-in slide-in-from-left-4 duration-1000 delay-200">
                            <CardHeader className="bg-primary/5 border-b border-primary/10 pb-10 pt-10 px-10">
                                <CardTitle className="text-3xl font-black flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                                        <User className="w-6 h-6 text-primary" />
                                    </div>
                                    Personal Details
                                </CardTitle>
                                <CardDescription className="font-bold text-foreground/40 mt-2 text-sm uppercase tracking-widest">
                                    Secure Health Profile Management
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleUpdateProfile}>
                                <CardContent className="space-y-8 pt-10 px-10">
                                    <div className="space-y-3">
                                        <Label htmlFor="name" className="font-black text-[10px] uppercase tracking-[0.2em] text-primary/60 px-1 flex items-center gap-2">
                                            <User className="w-3.5 h-3.5" /> Full Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="h-16 rounded-2xl bg-white/40 dark:bg-black/20 border-primary/10 focus:border-primary text-xl font-bold px-8 shadow-inner transition-all focus:scale-[1.01]"
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="email" className="font-black text-[10px] uppercase tracking-[0.2em] text-primary/60 px-1 flex items-center gap-2">
                                            <Mail className="w-3.5 h-3.5" /> Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            disabled
                                            className="h-16 rounded-2xl bg-muted/50 border-muted text-xl font-bold px-8 cursor-not-allowed opacity-60 italic"
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    {message && (
                                        <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className={cn(
                                            "rounded-2xl border-none",
                                            message.type === 'success' ? "bg-green-500/10 text-green-600 dark:text-green-400" : ""
                                        )}>
                                            <div className="flex items-center gap-3">
                                                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : null}
                                                <AlertDescription className="font-bold">{message.text}</AlertDescription>
                                            </div>
                                        </Alert>
                                    )}
                                </CardContent>
                                <CardHeader className="pt-0">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-lg shadow-primary/20 transition-all text-lg group"
                                    >
                                        {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Save className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />}
                                        Save Changes
                                    </Button>
                                </CardHeader>
                            </form>
                        </Card>

                        <div className="space-y-6">
                            <Card className="shadow-xl border-none bg-primary/5 backdrop-blur-xl rounded-[2.5rem] p-8 text-center space-y-4">
                                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg">
                                    <span className="text-4xl font-black text-primary">
                                        {name ? name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-foreground truncate">{name || 'User'}</h3>
                                    <p className="text-sm text-muted-foreground font-medium italic truncate">{user?.email}</p>
                                </div>
                                <div className="pt-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-black uppercase tracking-widest">
                                        <CheckCircle2 className="w-3 h-3" /> Profile Active
                                    </div>
                                </div>
                            </Card>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

