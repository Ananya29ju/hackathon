'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, User, Mail, Save, ChevronLeft, CheckCircle2, Activity } from 'lucide-react'
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
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [historyLoading, setHistoryLoading] = useState(true)
    const [assessments, setAssessments] = useState<any[]>([])
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    useEffect(() => {
        if (user) {
            setName(user.user_metadata?.name || '')
            setEmail(user.email || '')
            setPhone(user.user_metadata?.phone || '')
            fetchHistory()
        }
    }, [user])

    const isAsha = user?.user_metadata?.role === 'asha'

    const fetchHistory = async () => {
        if (!user || isAsha) {
            setHistoryLoading(false)
            return
        }
        try {
            const { data, error } = await supabase
                .from('assessments')
                .select('*')
                .eq('user_id', user.id)
                .is('patient_name', null) // Only show personal ones here
                .order('created_at', { ascending: false })

            if (error) throw error
            setAssessments(data || [])
        } catch (err) {
            console.error('Error fetching history:', err)
        } finally {
            setHistoryLoading(false)
        }
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)
        setMessage(null)

        try {
            // 1. Update Auth Metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: { name, phone }
            })

            if (authError) throw authError

            // 2. Update Profiles Table
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ name, phone, email })
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
                userRole={user?.user_metadata?.role}
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
                    <div className="space-y-3 text-center md:text-left">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground">
                            {isAsha ? 'ASHA Profile' : 'My Profile'}
                        </h1>
                        <p className="text-muted-foreground font-medium italic text-lg leading-relaxed">
                            {isAsha
                                ? 'Manage your healthcare worker credentials and personal information.'
                                : 'Manage your personal information and account settings.'}
                        </p>
                    </div>

                    <div className={cn("grid gap-10", isAsha ? "grid-cols-1" : "md:grid-cols-3")}>
                        <Card className={cn(
                            "shadow-2xl border-none bg-white/60 dark:bg-black/40 backdrop-blur-3xl rounded-[3rem] overflow-hidden animate-in fade-in slide-in-from-left-4 duration-1000 delay-200",
                            isAsha ? "w-full" : "md:col-span-2"
                        )}>
                            <CardHeader className="bg-primary/5 border-b border-primary/10 pb-10 pt-10 px-10">
                                <CardTitle className="text-3xl font-black flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                                        <User className="w-6 h-6 text-primary" />
                                    </div>
                                    Personal Details
                                </CardTitle>
                                <CardDescription className="font-bold text-foreground/40 mt-2 text-sm uppercase tracking-widest">
                                    {isAsha ? 'ASHA Official Profile' : 'Secure Health Profile Management'}
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
                                        <Label htmlFor="phone" className="font-black text-[10px] uppercase tracking-[0.2em] text-primary/60 px-1 flex items-center gap-2">
                                            <Activity className="w-3.5 h-3.5" /> Phone Number (Locked)
                                        </Label>
                                        <Input
                                            id="phone"
                                            value={phone}
                                            disabled
                                            className="h-16 rounded-2xl bg-muted/50 border-muted text-xl font-bold px-8 cursor-not-allowed opacity-60 italic"
                                            placeholder="No phone registered"
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
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-16 rounded-2xl bg-white/40 dark:bg-black/20 border-primary/10 focus:border-primary text-xl font-bold px-8 shadow-inner transition-all focus:scale-[1.01]"
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

                        {!isAsha && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h2 className="text-3xl font-black tracking-tighter">Your Screening History</h2>
                                    <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest leading-none">
                                        {assessments.length} {assessments.length === 1 ? 'Record' : 'Records'}
                                    </span>
                                </div>

                                {historyLoading ? (
                                    <div className="p-12 text-center bg-white/40 rounded-[2.5rem] border-dashed border-2 border-primary/10">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary/40 mx-auto" />
                                    </div>
                                ) : assessments.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {assessments.map((item) => (
                                            <Card key={item.id} className="p-6 rounded-[2rem] border-none bg-white/80 dark:bg-black/40 backdrop-blur-xl shadow-xl shadow-primary/5 hover:scale-[1.02] transition-all cursor-default group">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="space-y-4 flex-1">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                                                                    {new Date(item.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                                </span>
                                                            </div>
                                                            <h4 className="text-xl font-black tracking-tight capitalize">
                                                                {item.primary_risk || 'Health check'} Assessment
                                                            </h4>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2">
                                                            {item.breast_risk_score > 0 && (
                                                                <span className="bg-rose-50 text-rose-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                                    Breast: {item.breast_risk_score}%
                                                                </span>
                                                            )}
                                                            {item.menstrual_score > 0 && (
                                                                <span className="bg-primary/5 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                                    Menstrual: {item.menstrual_score}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                        <Activity className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <Card className="p-12 text-center rounded-[2.5rem] border-none bg-white/40 backdrop-blur-xl">
                                        <div className="max-w-xs mx-auto space-y-4">
                                            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto">
                                                <Activity className="w-8 h-8 text-primary/20" />
                                            </div>
                                            <p className="text-muted-foreground font-medium italic">You haven't completed any assessments yet. Your health journey starts today!</p>
                                            <Button onClick={() => onStartAssessment('both')} variant="outline" className="rounded-full px-8">
                                                Start My First Check
                                            </Button>
                                        </div>
                                    </Card>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

