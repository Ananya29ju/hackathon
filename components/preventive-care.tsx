'use client'

import { useState, useMemo, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ChevronLeft, Shield, Calendar, CheckCircle2, Heart, Info, Apple, Activity, Bell, AlertCircle, Waves, Eye, Search, Sparkles, ExternalLink } from 'lucide-react'
import Header from './header'
import { cn } from '@/lib/utils'

interface PreventiveCareProps {
    onNavigate: (view: string) => void
    onStartAssessment: (type: 'menstrual' | 'cancer' | 'both') => void
    userName?: string
    results?: any // Pass assessment results here
    userRole?: string
}

const GENERAL_PREVENTION = [
    {
        title: 'Menstrual Hygiene',
        description: 'Proper practice prevents infections like UTIs and Bacterial Vaginosis. Change products every 4-8 hours and wash with clean water.',
        category: 'Essential Practice',
        icon: <Heart className="w-6 h-6 text-pink-500" />,
        color: 'bg-pink-50 dark:bg-pink-950/30',
        borderColor: 'border-pink-100 dark:border-pink-900/50',
    },
    {
        title: 'Dietary Recommendations',
        description: 'What you eat influences how your body handles hormonal shifts. Include iron, magnesium, and omega-3s.',
        category: 'Nutritional Balance',
        icon: <Apple className="w-6 h-6 text-green-500" />,
        color: 'bg-green-50 dark:bg-green-950/30',
        borderColor: 'border-green-100 dark:border-green-900/50'
    },
    {
        title: 'Lifestyle and Self-Care',
        description: 'Managing your energy and environment can turn a difficult cycle into a more manageable one.',
        category: 'Holistic Well-being',
        icon: <Activity className="w-6 h-6 text-blue-500" />,
        color: 'bg-blue-50 dark:bg-blue-950/30',
        borderColor: 'border-blue-100 dark:border-blue-900/50'
    }
]

const CANCER_PREVENTIVE = [
    {
        title: 'Breast Cancer Symptoms',
        description: 'Regular self-awareness and screening are critical for identifying changes in breast tissue early.',
        category: 'Clinical Awareness',
        icon: <AlertCircle className="w-6 h-6 text-indigo-500" />,
        color: 'bg-indigo-50 dark:bg-indigo-950/30',
        borderColor: 'border-indigo-100 dark:border-indigo-900/50'
    },
    {
        title: 'Ovarian Cancer Symptoms',
        description: 'Understand the BEACH acronym to recognize subtle but persistent signs of ovarian health concerns.',
        category: 'BEACH Awareness',
        icon: <Waves className="w-6 h-6 text-lavender-500" />,
        color: 'bg-lavender-50 dark:bg-lavender-950/30',
        borderColor: 'border-lavender-100 dark:border-lavender-900/50'
    },
    {
        title: 'Endometrial Cancer Symptoms',
        description: 'Uterine cancer is often diagnosed early because its primary symptom—abnormal bleeding—is very noticeable.',
        category: 'Early Detection',
        icon: <Eye className="w-6 h-6 text-amber-500" />,
        color: 'bg-amber-50 dark:bg-amber-950/30',
        borderColor: 'border-amber-100 dark:border-amber-900/50'
    }
]

export default function PreventiveCare({ onNavigate, onStartAssessment, userName = 'Ananya', results, userRole }: PreventiveCareProps) {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredAndSortedTasks = useMemo(() => {
        const allTasks = [
            ...GENERAL_PREVENTION.map(t => ({ ...t, section: 'Menstrual Health and Wellness' })),
            ...CANCER_PREVENTIVE.map(t => ({ ...t, section: 'Cancer Preventive' }))
        ]

        // Calculate relevance scores based on results
        const scoredTasks = allTasks.map(task => {
            let score = 0
            let isRecommended = false

            if (results) {
                // Period Pain -> Lifestyle & Dietary
                if ((results.maturePain?.includes('Severe') || results.youngPain?.includes('Severe')) &&
                    ['Lifestyle and Self-Care', 'Dietary Recommendations'].includes(task.title)) {
                    score += 10
                    isRecommended = true
                }

                // Abnormal Bleeding -> Endometrial
                if (results.pmBleeding && results.pmBleeding !== 'Never' && task.title === 'Endometrial Cancer Symptoms') {
                    score += 15
                    isRecommended = true
                }

                // Family History -> Cancer Cards
                if (results.matureFamilyHistory?.includes('Yes') && task.section === 'Cancer Preventive') {
                    score += 8
                    isRecommended = true
                }

                // Weight gain -> Dietary
                if ((results.matureWeightGain?.includes('Moderate') || results.matureWeightGain?.includes('Significant')) &&
                    task.title === 'Dietary Recommendations') {
                    score += 5
                    isRecommended = true
                }
            }

            return { ...task, score, isRecommended }
        })

        // Filter based on search query
        const filtered = scoredTasks.filter(task =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.category.toLowerCase().includes(searchQuery.toLowerCase())
        )

        // Sort by score (descending)
        return filtered.sort((a, b) => b.score - a.score)
    }, [results, searchQuery])

    const renderCard = (task: any) => (
        <Card
            key={task.title}
            className={cn(
                "group relative p-8 rounded-[2.5rem] bg-glass shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer overflow-hidden border-none",
                task.isRecommended ? "ring-2 ring-primary/30" : "",
                "hover:-translate-y-2 active:scale-[0.98]"
            )}
            onClick={() => {
                if (task.title === 'Menstrual Hygiene') {
                    onNavigate('hygiene-details')
                } else if (task.title === 'Dietary Recommendations') {
                    onNavigate('dietary-details')
                } else if (task.title === 'Lifestyle and Self-Care') {
                    onNavigate('lifestyle-details')
                } else if (task.title === 'Breast Cancer Symptoms') {
                    onNavigate('breast-cancer-details')
                } else if (task.title === 'Ovarian Cancer Symptoms') {
                    onNavigate('ovarian-cancer-details')
                } else if (task.title === 'Endometrial Cancer Symptoms') {
                    onNavigate('endometrial-cancer-details')
                }
            }}
        >
            {task.isRecommended && (
                <div className="absolute top-0 right-0">
                    <div className="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-bl-3xl flex items-center gap-1.5 shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        RECOMMENDED
                    </div>
                </div>
            )}
            <div className="flex flex-col h-full gap-6">
                <div className="flex items-start justify-between">
                    <div className="w-16 h-16 bg-white dark:bg-black/20 rounded-[1.5rem] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        {task.icon}
                    </div>
                    <span className="px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-sm text-[10px] font-black uppercase tracking-wider text-muted-foreground border border-border/20">
                        {task.category}
                    </span>
                </div>
                <div className="space-y-4">
                    <h3 className="text-2xl font-black tracking-tight">{task.title}</h3>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                        {task.description}
                    </p>
                </div>
                <div className="mt-auto pt-4">
                    <Button variant="ghost" className="p-0 h-auto font-bold text-primary group-hover:gap-3 transition-all">
                        {['Menstrual Hygiene', 'Dietary Recommendations', 'Lifestyle and Self-Care', 'Breast Cancer Symptoms', 'Ovarian Cancer Symptoms', 'Endometrial Cancer Symptoms'].includes(task.title) ? 'Read Full Guide' : 'Learn More'} <CheckCircle2 className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>
        </Card>
    )

    const preventionTasks = filteredAndSortedTasks.filter(t => t.section === 'Menstrual Health and Wellness')
    const cancerTasks = filteredAndSortedTasks.filter(t => t.section === 'Cancer Preventive')

    return (
        <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-50 via-background to-lavender-50 dark:from-pink-950/10 dark:to-lavender-950/10">
            <Header
                onStartAssessment={onStartAssessment}
                userName={userName}
                onNavigate={onNavigate}
                userRole={userRole}
            />

            <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full space-y-20">
                <div className="space-y-12">
                    <section className="space-y-6">
                        <Button
                            variant="ghost"
                            onClick={() => onNavigate('landing')}
                            className="group gap-2 text-muted-foreground hover:text-primary transition-colors font-bold"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </Button>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-4 max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
                                    <Shield className="w-3 h-3" />
                                    Empowerment through Wellness
                                </div>
                                <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.1]">
                                    Health & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-lavender-600">Wellness Hub</span>
                                </h1>
                                <p className="text-lg text-muted-foreground font-medium leading-relaxed italic">
                                    {userRole === 'asha'
                                        ? "Clinical recommendations and guidance resources to help you support and educate your patients."
                                        : "Proactive steps today lead to a healthier tomorrow. Explore clinical recommendations and lifestyle adjustments tailored for your well-being."
                                    }
                                </p>
                            </div>

                            {/* Search Bar */}
                            <div className="relative w-full md:w-80 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Search symptoms, guides..."
                                    value={searchQuery}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                    className="pl-11 h-14 rounded-2xl bg-white/50 dark:bg-black/20 border-2 border-primary/5 focus:border-primary/20 transition-all placeholder:text-muted-foreground/50 font-bold"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Menstrual Health and Wellness Section */}
                    {preventionTasks.length > 0 && (
                        <section className="space-y-10">
                            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                                <Heart className="w-8 h-8 text-pink-500 fill-pink-500/10" />
                                Menstrual Health and Wellness
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {preventionTasks.map(task => renderCard(task))}
                            </div>

                            <div className="flex justify-center pt-4">
                                <a
                                    href="https://www.cdc.gov/hygiene/about/menstrual-hygiene.html"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-3 px-8 py-4 rounded-[2rem] bg-glass hover:bg-primary/5 border border-primary/10 transition-all duration-300"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <ExternalLink className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-black text-foreground/70 group-hover:text-primary tracking-tight">
                                        Looking for more clinical data? <span className="text-primary underline underline-offset-4 ml-1">Click here for more info</span>
                                    </span>
                                </a>
                            </div>
                        </section>
                    )}

                    {/* Cancer Preventive Section */}
                    {cancerTasks.length > 0 && (
                        <section className="space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="w-1.5 h-10 bg-indigo-500 rounded-full" />
                                <h2 className="text-3xl font-black tracking-tight">Cancer Preventive</h2>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {cancerTasks.map(task => renderCard(task))}
                            </div>
                        </section>
                    )}

                    {filteredAndSortedTasks.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto opacity-20">
                                <Search className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black opacity-40 italic">No guides found for "{searchQuery}"</h3>
                        </div>
                    )}
                </div>
            </main>

            <footer className="border-t border-border/30 py-8 text-center bg-white/30 backdrop-blur-sm mt-auto">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-muted-foreground/40">
                    Stay Ahead of the Curve &copy; 2026 OVIRA Healthcare
                </p>
            </footer>
        </div>
    )
}
