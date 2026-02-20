'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft, Info, Image as ImageIcon, Video, PlayCircle, Eye } from 'lucide-react'
import Image from 'next/image'
import Header from './header'

interface EndometrialCancerDetailsProps {
    onNavigate: (view: string) => void
    onStartAssessment: (type: 'menstrual' | 'cancer' | 'both') => void
    userName?: string
}

export default function EndometrialCancerDetails({ onNavigate, onStartAssessment, userName = 'Ananya' }: EndometrialCancerDetailsProps) {
    const symptoms = [
        {
            title: '1. Abnormal Bleeding',
            description: 'The most common symptom is unusual vaginal bleeding, including bleeding between periods, spotting, or any bleeding after menopause.',
        },
        {
            title: '2. Unusual Discharge',
            description: 'Foul-smelling, watery, or bloody vaginal discharge that is not related to a period.',
        },
        {
            title: '3. Pelvic Pain',
            description: 'Persistent pain or a feeling of pressure in the lower abdomen or pelvis.',
        },
        {
            title: '4. Pain During Activity',
            description: 'Discomfort during sexual intercourse or while urinating.',
        },
        {
            title: '5. Advanced Signs',
            description: 'Unexplained weight loss, a palpable mass in the pelvic area, or extreme fatigue.',
        }
    ]

    return (
        <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-50 via-background to-orange-50 dark:from-amber-950/10 dark:to-orange-950/10">
            <Header
                onStartAssessment={onStartAssessment}
                userName={userName}
                onNavigate={onNavigate}
            />

            <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full space-y-16">
                {/* Header Section */}
                <section className="space-y-6">
                    <Button
                        variant="ghost"
                        onClick={() => onNavigate('preventive-care')}
                        className="group gap-2 text-muted-foreground hover:text-primary transition-colors font-bold"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Wellness Hub
                    </Button>

                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-xs font-black uppercase tracking-widest">
                            <Eye className="w-3 h-3" />
                            Early Detection Focus
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.1]">
                            Endometrial <span className="text-secondary-foreground">Cancer Signs</span>
                        </h1>
                        <p className="max-w-2xl text-lg text-muted-foreground font-medium leading-relaxed italic">
                            Uterine cancer is often caught early because its primary symptom—abnormal bleeding—is very noticeable.
                        </p>
                    </div>
                </section>

                {/* Structured Content Section */}
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Textual Content */}
                    <section className="space-y-8">
                        <div className="space-y-2 mb-8">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-amber-700 dark:text-amber-400">
                                <div className="w-2 h-8 bg-amber-500 rounded-full" />
                                Monitoring Changes
                            </h2>
                        </div>
                        <div className="space-y-10">
                            {symptoms.map((step, idx) => (
                                <div key={idx} className="space-y-3 relative pl-8 border-l-2 border-amber-500/10">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-amber-500 shadow-sm" />
                                    <h3 className="text-xl font-black tracking-tight text-foreground">{step.title}</h3>
                                    <p className="text-muted-foreground font-medium leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Right: Media Placeholders */}
                    <section className="space-y-8 sticky top-32">
                        <div className="space-y-12">
                            {/* Endometrial Cancer Symptom Image */}
                            <a href="https://www.mayoclinic.org/diseases-conditions/endometrial-cancer/symptoms-causes/syc-20352461" target="_blank" rel="noopener noreferrer" className="block group text-center">
                                <Card className="aspect-video relative overflow-hidden rounded-[2rem] border-none shadow-2xl border border-primary/10">
                                    <Image
                                        src="/images/endo.jpeg"
                                        alt="Endometrial Cancer Symptom Map"
                                        fill
                                        className="object-cover animate-in fade-in zoom-in-105 duration-1000"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                                </Card>
                                <p className="mt-4 text-center text-xs font-black text-primary group-hover:underline uppercase tracking-wider">click here for more info</p>
                            </a>

                            {/* Endometrial Cancer Clinical Guide Video */}
                            <div className="aspect-video relative overflow-hidden rounded-[2rem] shadow-2xl border border-primary/10 bg-black">
                                <iframe
                                    src="https://www.youtube.com/embed/tAC8fKTzY8o"
                                    title="Endometrial Cancer Clinical Guide"
                                    className="absolute inset-0 w-full h-full border-none"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Conclusion Action */}
                <Card className="rounded-[3rem] p-12 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-none shadow-2xl shadow-primary/5 text-center space-y-6">
                    <div className="max-w-2xl mx-auto space-y-4">
                        <h3 className="text-3xl font-black tracking-tight">Vigilance leads to early resolution</h3>
                        <p className="text-muted-foreground font-medium italic">
                            Abnormal vaginal bleeding is the most common sign. If you experience this, it is highly recommended to speak with your doctor immediately for testing.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 pt-4">
                            <Button
                                onClick={() => onNavigate('landing')}
                                className="rounded-full px-10 py-6 h-auto font-bold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                            >
                                Return to Dashboard
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => onNavigate('preventive-care')}
                                className="rounded-full px-10 py-6 h-auto font-bold border-primary/20 text-primary hover:bg-primary/5 transition-all"
                            >
                                Preventive Care
                            </Button>
                        </div>
                    </div>
                </Card>
            </main>

            <footer className="border-t border-border/30 py-8 text-center bg-white/30 backdrop-blur-sm mt-auto">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-muted-foreground/40">
                    Uterine Health &copy; 2026 OVIRA Healthcare
                </p>
            </footer>
        </div>
    )
}
