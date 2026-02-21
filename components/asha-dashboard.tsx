'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Search,
    ArrowUpDown,
    Filter,
    User,
    Calendar,
    Activity,
    ChevronRight,
    Download,
    Trash2,
    CheckCircle2,
    Clock,
    BarChart3,
    PieChart,
    Users
} from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts'
import { cn } from '@/lib/utils'
import supabase from '@/lib/supabaseClient'
import { getRiskCategory } from '@/lib/risk-calculator'

interface PatientRecord {
    id: string
    patient_name: string
    patient_phone: string
    age: number
    primary_risk: string
    risk_score: number
    created_at: string
    symptoms?: any
}

export default function AshaDashboard() {
    const [records, setRecords] = useState<PatientRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setSortConfig] = useState<{ key: keyof PatientRecord, direction: 'asc' | 'desc' } | null>(null)

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                // Fetch from assessments where patient_name is not null
                // Or if we specifically created a new table, we'd fetch from there.
                // For now, let's pull from assessments where user_id matches the ASHA worker.
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const { data, error } = await supabase
                    .from('assessments')
                    .select('*')
                    .eq('user_id', user.id)
                    .not('patient_name', 'is', null)
                    .order('created_at', { ascending: false })

                if (error) throw error

                // Map the data to our interface
                const mappedRecords = (data || []).map(item => {
                    const primaryKey = item.primary_risk;
                    let score = 0;

                    // Logic to find the relevant score based on primary risk or highest overall
                    if (primaryKey === 'breast') score = item.breast_risk_score || item.symptoms?.breastRisk?.score || 0;
                    else if (primaryKey === 'ovarian') score = item.ovarian_risk_score || item.symptoms?.ovarianRisk?.score || 0;
                    else if (primaryKey === 'endometrial') score = item.endometrial_risk_score || item.symptoms?.endometrialRisk?.score || 0;
                    else score = item.menstrual_score || (typeof item.symptoms?.menstrualRisk === 'number' ? item.symptoms.menstrualRisk : 0);

                    return {
                        id: item.id,
                        patient_name: item.patient_name || 'Anonymous',
                        patient_phone: item.patient_phone || 'No Phone',
                        age: item.age || 0,
                        primary_risk: primaryKey || 'Menstrual',
                        risk_score: score,
                        created_at: item.created_at,
                        symptoms: item.symptoms
                    }
                })

                setRecords(mappedRecords)
            } catch (err) {
                console.error('Error fetching patient records:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchRecords()
    }, [])

    const handleSort = (key: keyof PatientRecord) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    const filteredAndSortedRecords = useMemo(() => {
        let result = [...records]

        // Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(r =>
                r.patient_name.toLowerCase().includes(query) ||
                r.patient_phone.toLowerCase().includes(query) ||
                r.primary_risk.toLowerCase().includes(query)
            )
        }

        // Sort
        if (sortConfig) {
            result.sort((a, b) => {
                const aVal = a[sortConfig.key]
                const bVal = b[sortConfig.key]
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
                return 0
            })
        }

        return result
    }, [records, searchQuery, sortConfig])

    const getRiskStyles = (score: number) => {
        const category = getRiskCategory(score)
        switch (category) {
            case 'low': return 'text-emerald-500 bg-emerald-50 border-emerald-100'
            case 'moderate': return 'text-amber-500 bg-amber-50 border-amber-100'
            case 'high': return 'text-rose-500 bg-rose-50 border-rose-100'
            case 'critical': return 'text-purple-500 bg-purple-50 border-purple-100'
            default: return 'text-slate-500 bg-slate-50 border-slate-100'
        }
    }

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete the screening record for ${name}?`)) return

        try {
            const { error } = await supabase
                .from('assessments')
                .delete()
                .eq('id', id)

            if (error) throw error

            setRecords(prev => prev.filter(r => r.id !== id))
        } catch (err) {
            console.error('Error deleting record:', err)
            alert('Failed to delete record. Please try again.')
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="font-bold text-primary/60 animate-pulse uppercase tracking-widest text-xs">Loading Patient Records...</p>
            </div>
        )
    }

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Greeting */}
            <div className="space-y-1">
                <h2 className="text-4xl font-black tracking-tighter text-foreground">Welcome back.</h2>
                <p className="text-muted-foreground font-medium italic">You are viewing your private community healthcare records.</p>
            </div>
            {/* Analytics & Stats */}
            {/* Analytics & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Community Reach', value: records.length, sub: 'Total Patients Screened', icon: Users, color: 'text-primary' },
                    { label: 'High Priority', value: records.filter(r => getRiskCategory(r.risk_score) === 'high' || getRiskCategory(r.risk_score) === 'critical').length, sub: 'Needs Clinical Follow-up', icon: Activity, color: 'text-rose-500' },
                    { label: 'Active Today', value: records.filter(r => new Date(r.created_at).toDateString() === new Date().toDateString()).length, sub: 'New Screenings Conducted', icon: Clock, color: 'text-amber-500' },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-xl shadow-primary/5 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-[2.5rem] p-2 hover:scale-[1.02] transition-transform cursor-default overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                            <stat.icon className="w-24 h-24" />
                        </div>
                        <CardContent className="pt-8 flex items-center justify-between relative z-10">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                                <p className={cn("text-5xl font-black tracking-tighter", stat.color)}>{stat.value}</p>
                                <p className="text-xs font-medium text-muted-foreground/60 italic">{stat.sub}</p>
                            </div>
                            <div className={cn("p-4 rounded-2xl bg-slate-50 dark:bg-white/5 shadow-inner", stat.color)}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Table Card */}
            <Card className="border-none shadow-2xl shadow-primary/5 bg-white/90 dark:bg-black/40 backdrop-blur-xl rounded-[3rem] overflow-hidden">
                <CardHeader className="p-8 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <CardTitle className="text-3xl font-black tracking-tighter">Patient Registry</CardTitle>
                            <CardDescription className="text-muted-foreground font-medium italic">Manage and review screening results for your local community.</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Search by name..."
                                    className="pl-11 h-12 w-[280px] rounded-2xl border-none bg-primary/5 focus:bg-primary/10 transition-all font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="ghost" className="h-12 w-12 rounded-2xl bg-primary/5 hover:bg-primary/10 p-0 text-primary">
                                <Filter className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-primary/5">
                                    <th className="p-6 text-left" onClick={() => handleSort('patient_name')}>
                                        <button className="flex items-center gap-2 text-xs font-black text-primary/60 uppercase tracking-widest hover:text-primary transition-colors">
                                            Patient Name <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="p-6 text-left" onClick={() => handleSort('patient_phone')}>
                                        <button className="flex items-center gap-2 text-xs font-black text-primary/60 uppercase tracking-widest hover:text-primary transition-colors">
                                            Phone Number <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="p-6 text-left" onClick={() => handleSort('age')}>
                                        <button className="flex items-center gap-2 text-xs font-black text-primary/60 uppercase tracking-widest hover:text-primary transition-colors">
                                            Age <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="p-6 text-left" onClick={() => handleSort('primary_risk')}>
                                        <button className="flex items-center gap-2 text-xs font-black text-primary/60 uppercase tracking-widest hover:text-primary transition-colors">
                                            Primary Concern <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="p-6 text-left" onClick={() => handleSort('risk_score')}>
                                        <button className="flex items-center gap-2 text-xs font-black text-primary/60 uppercase tracking-widest hover:text-primary transition-colors">
                                            Risk Intensity <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="p-6 text-left" onClick={() => handleSort('created_at')}>
                                        <button className="flex items-center gap-2 text-xs font-black text-primary/60 uppercase tracking-widest hover:text-primary transition-colors">
                                            Screened Date <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="p-6"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSortedRecords.length > 0 ? (
                                    filteredAndSortedRecords.map((r) => (
                                        <tr key={r.id} className="group border-b border-primary/5 hover:bg-primary/[0.02] transition-colors">
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-sm shadow-inner group-hover:scale-110 transition-transform text-center flex-shrink-0">
                                                        {r.patient_name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-foreground">{r.patient_name}</span>
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-0">Screener Access Only</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className="font-bold text-foreground/80">{r.patient_phone}</span>
                                            </td>
                                            <td className="p-6">
                                                <span className="font-semibold text-foreground/70">{r.age} yrs</span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary/40" />
                                                    <span className="font-bold capitalize text-sm">
                                                        {r.primary_risk.toLowerCase().includes('menstrual') ? 'Menstrual Health' : 'Advanced Screening'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className={cn(
                                                    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black border uppercase tracking-wider",
                                                    getRiskStyles(r.risk_score)
                                                )}>
                                                    {getRiskCategory(r.risk_score)}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-foreground/70">{new Date(r.created_at).toLocaleDateString()}</span>
                                                    <span className="text-[10px] font-medium text-muted-foreground uppercase">{new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 text-primary">
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-10 w-10 rounded-xl hover:bg-rose-50 text-rose-500"
                                                        onClick={() => handleDelete(r.id, r.patient_name)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-24 text-center">
                                            <div className="max-w-xs mx-auto space-y-4">
                                                <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-inner">
                                                    <Activity className="w-8 h-8 text-slate-300" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-black text-foreground">No patient records found</p>
                                                    <p className="text-sm font-medium text-muted-foreground italic">Start a screening assessment to begin collecting patient data.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
