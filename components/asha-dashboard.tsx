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

    Trash2,
    CheckCircle2,
    Clock,
    BarChart3,
    PieChart,
    Users,
    Shield,
    Heart,
    MoreVertical,
    LayoutGrid,
    ListFilter,
    FileText
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
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
    const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'moderate' | 'high' | 'critical'>('all')
    const [typeFilter, setTypeFilter] = useState<'all' | 'menstrual' | 'cancer'>('all')
    const [sortConfig, setSortConfig] = useState<{ key: keyof PatientRecord, direction: 'asc' | 'desc' } | null>({ key: 'created_at', direction: 'desc' })

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const { data, error } = await supabase
                    .from('assessments')
                    .select('*')
                    .eq('user_id', user.id)
                    .not('patient_name', 'is', null)
                    .order('created_at', { ascending: false })

                if (error) throw error

                const mappedRecords = (data || []).map(item => {
                    const primaryKey = item.primary_risk;
                    let score = 0;

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

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(r =>
                r.patient_name.toLowerCase().includes(query) ||
                r.patient_phone.toLowerCase().includes(query)
            )
        }

        // Risk Category Filter
        if (riskFilter !== 'all') {
            result = result.filter(r => getRiskCategory(r.risk_score) === riskFilter)
        }

        // Assessment Type Filter
        if (typeFilter !== 'all') {
            result = result.filter(r => {
                const isCancer = ['breast', 'ovarian', 'endometrial'].includes(r.primary_risk.toLowerCase())
                return typeFilter === 'cancer' ? isCancer : !isCancer
            })
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
    }, [records, searchQuery, riskFilter, typeFilter, sortConfig])

    const handleExport = () => {
        if (filteredAndSortedRecords.length === 0) return

        // Create CSV Header
        const headers = ["Patient Name", "Phone", "Age", "Risk Category", "Risk Score", "Primary Concern", "Screened Date"]

        // Map records to CSV rows
        const csvRows = filteredAndSortedRecords.map(r => [
            r.patient_name.replace(/,/g, ''), // Basic sanitization
            `"${r.patient_phone}"`,
            r.age,
            getRiskCategory(r.risk_score),
            r.risk_score,
            r.primary_risk,
            new Date(r.created_at).toLocaleDateString()
        ].join(","))

        const csvContent = [headers.join(","), ...csvRows].join("\n")
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `OVIRA_Patient_Registry_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const getRiskColors = (score: number) => {
        const category = getRiskCategory(score)
        switch (category) {
            case 'low': return 'text-emerald-700 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400'
            case 'moderate': return 'text-amber-700 bg-amber-50 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400'
            case 'high': return 'text-rose-700 bg-rose-50 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400'
            case 'critical': return 'text-purple-700 bg-purple-50 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400'
            default: return 'text-slate-700 bg-slate-50 border-slate-100 dark:bg-slate-950/20 dark:text-slate-400'
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
        <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header with Stats Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-4xl font-black tracking-tighter text-foreground">Patient Registry</h2>
                    <p className="text-muted-foreground font-medium italic">Manage screening records and clinical follow-ups for your community.</p>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={handleExport}
                        disabled={filteredAndSortedRecords.length === 0}
                        className="rounded-2xl bg-white text-primary border-primary/10 hover:bg-primary/5 font-black text-xs uppercase tracking-widest px-6 h-11 gap-2 shadow-xl shadow-primary/5 transition-all hidden md:flex"
                    >
                        <FileText className="w-4 h-4" />
                        Export Registry
                    </Button>
                    <div className="flex bg-primary/5 p-1 rounded-2xl border border-primary/10">
                        {[
                            { id: 'all', label: 'All', icon: LayoutGrid },
                            { id: 'menstrual', label: 'Menstrual', icon: Heart },
                            { id: 'cancer', label: 'Cancer', icon: Shield }
                        ].map((t) => (
                            <Button
                                key={t.id}
                                variant="ghost"
                                size="sm"
                                onClick={() => setTypeFilter(t.id as any)}
                                className={cn(
                                    "rounded-xl font-bold text-[10px] uppercase tracking-wider px-4 h-9 gap-2 transition-all",
                                    typeFilter === t.id ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-primary"
                                )}
                            >
                                <t.icon className="w-3.5 h-3.5" />
                                {t.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Patients', value: records.length, sub: 'Lifetime Screenings', icon: Users, color: 'text-primary' },
                    { label: 'High Priority', value: records.filter(r => ['high', 'critical'].includes(getRiskCategory(r.risk_score))).length, sub: 'Needs Medical Review', icon: Activity, color: 'text-rose-500' },
                    { label: 'Screened Today', value: records.filter(r => new Date(r.created_at).toDateString() === new Date().toDateString()).length, sub: 'Fresh Submissions', icon: Clock, color: 'text-amber-500' },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-xl shadow-primary/5 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-[2.5rem] p-6 hover:translate-y-[-4px] transition-all cursor-default overflow-hidden relative group">
                        <div className="flex items-center justify-between relative z-10">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                                <p className={cn("text-4xl font-black tracking-tighter", stat.color)}>{stat.value}</p>
                                <p className="text-xs font-medium text-muted-foreground/60 italic">{stat.sub}</p>
                            </div>
                            <div className={cn("p-4 rounded-2xl bg-primary/5 shadow-inner group-hover:scale-110 transition-transform", stat.color)}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Table Control Bar */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/40 dark:bg-black/20 p-4 rounded-[2rem] border border-white/20 backdrop-blur-md">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group w-full md:w-[320px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search by name or phone..."
                                className="pl-11 h-12 rounded-2xl border-none bg-white/60 dark:bg-white/5 focus:bg-white transition-all font-medium shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={handleExport}
                            disabled={filteredAndSortedRecords.length === 0}
                            size="icon"
                            variant="outline"
                            className="rounded-2xl border-primary/20 bg-white/60 dark:bg-white/5 h-12 w-12 md:hidden flex-shrink-0"
                        >
                            <FileText className="w-5 h-5 text-primary" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex flex-wrap gap-2">
                            {['all', 'low', 'moderate', 'high', 'critical'].map((cat) => (
                                <Button
                                    key={cat}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setRiskFilter(cat as any)}
                                    className={cn(
                                        "h-9 rounded-full px-4 text-[10px] font-black uppercase tracking-widest border transition-all",
                                        riskFilter === cat
                                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                            : "bg-white/50 border-primary/10 text-muted-foreground hover:bg-white hover:text-primary"
                                    )}
                                >
                                    {cat}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <Card className="border-none shadow-2xl shadow-primary/5 bg-white/90 dark:bg-black/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/20">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-primary/[0.03] border-b border-primary/5 text-center">
                                        <th className="p-6 text-left" onClick={() => handleSort('patient_name')}>
                                            <button className="flex items-center gap-2 text-xs font-black text-primary/60 uppercase tracking-widest hover:text-primary transition-colors">
                                                Patient Info <ArrowUpDown className="w-3 h-3" />
                                            </button>
                                        </th>
                                        <th className="p-6 text-left hidden md:table-cell" onClick={() => handleSort('age')}>
                                            <button className="flex items-center gap-2 text-xs font-black text-primary/60 uppercase tracking-widest hover:text-primary transition-colors">
                                                Details <ArrowUpDown className="w-3 h-3" />
                                            </button>
                                        </th>
                                        <th className="p-6 text-left" onClick={() => handleSort('primary_risk')}>
                                            <button className="flex items-center gap-2 text-xs font-black text-primary/60 uppercase tracking-widest hover:text-primary transition-colors">
                                                Category <ArrowUpDown className="w-3 h-3" />
                                            </button>
                                        </th>
                                        <th className="p-6 text-left" onClick={() => handleSort('risk_score')}>
                                            <button className="flex items-center gap-2 text-xs font-black text-primary/60 uppercase tracking-widest hover:text-primary transition-colors">
                                                Risk Level <ArrowUpDown className="w-3 h-3" />
                                            </button>
                                        </th>
                                        <th className="p-6 text-left hidden lg:table-cell" onClick={() => handleSort('created_at')}>
                                            <button className="flex items-center gap-2 text-xs font-black text-primary/60 uppercase tracking-widest hover:text-primary transition-colors">
                                                Screened On <ArrowUpDown className="w-3 h-3" />
                                            </button>
                                        </th>
                                        <th className="p-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAndSortedRecords.length > 0 ? (
                                        filteredAndSortedRecords.map((r) => (
                                            <tr key={r.id} className="group border-b border-primary/5 hover:bg-primary/[0.02] transition-all">
                                                <td className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center font-black text-primary text-base shadow-sm group-hover:rotate-6 transition-transform">
                                                            {r.patient_name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-foreground text-sm uppercase tracking-tight">{r.patient_name}</span>
                                                            <span className="text-xs font-medium text-muted-foreground">{r.patient_phone}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6 hidden md:table-cell text-left">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-foreground/80">{r.age} Years</span>
                                                        <span className="text-[10px] font-black uppercase text-muted-foreground/50">Calculated Age</span>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-left">
                                                    <div className="flex items-center gap-2">
                                                        {['breast', 'ovarian', 'endometrial'].includes(r.primary_risk.toLowerCase()) ? (
                                                            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-50 border border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30">
                                                                <Shield className="w-3.5 h-3.5 text-rose-500" />
                                                                <span className="text-[10px] font-black uppercase text-rose-600 tracking-wider">Cancer Prep</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30">
                                                                <Heart className="w-3.5 h-3.5 text-emerald-500" />
                                                                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Menstrual</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-6 text-left">
                                                    <Badge className={cn(
                                                        "rounded-lg px-3 py-1.5 text-[10px] font-black border uppercase tracking-widest shadow-none",
                                                        getRiskColors(r.risk_score)
                                                    )}>
                                                        {getRiskCategory(r.risk_score)}
                                                    </Badge>
                                                </td>
                                                <td className="p-6 hidden lg:table-cell text-left">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-foreground/70">{new Date(r.created_at).toLocaleDateString()}</span>
                                                        <span className="text-[10px] font-medium text-muted-foreground uppercase">{new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10">
                                                                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border-none shadow-2xl glass-card">
                                                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3">Management</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="gap-3 cursor-pointer py-3 rounded-xl focus:bg-rose-50 focus:text-rose-500 transition-all font-bold text-xs text-rose-500"
                                                                    onClick={() => handleDelete(r.id, r.patient_name)}
                                                                >
                                                                    <Trash2 className="w-4 h-4 opacity-70" />
                                                                    Delete Record
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="p-24 text-center">
                                                <div className="max-w-xs mx-auto space-y-6">
                                                    <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                                                        <ListFilter className="w-10 h-10 text-slate-300" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-xl font-black text-foreground tracking-tight">No Results Found</p>
                                                        <p className="text-sm font-medium text-muted-foreground italic">We couldn't find any patient records matching your current filter criteria.</p>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        className="rounded-full font-black text-xs uppercase tracking-widest px-8"
                                                        onClick={() => {
                                                            setSearchQuery('')
                                                            setRiskFilter('all')
                                                            setTypeFilter('all')
                                                        }}
                                                    >
                                                        Reset All Filters
                                                    </Button>
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
        </div>
    )
}
