'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft, Heart, Image as ImageIcon, Video, PlayCircle } from 'lucide-react'
import Image from 'next/image'
import Header from './header'

interface HygieneDetailsProps {
    onNavigate: (view: string) => void
    onStartAssessment: (type: 'menstrual' | 'cancer' | 'both') => void
    userName?: string
}

export default function HygieneDetails({ onNavigate, onStartAssessment, userName = 'Ananya' }: HygieneDetailsProps) {
    const hygieneSteps = [
        {
            title: '1. Change Regularly',
            description: 'Replace sanitary pads every 4–6 hours and tampons every 4–8 hours to prevent bacterial growth and Toxic Shock Syndrome (TSS).',
        },
        {
            title: '2. Genital Cleaning',
            description: "Wash the external area (vulva) at least twice daily with clean water. Avoid douching or scented soaps, as they disrupt the vagina's self-cleaning natural pH balance.",
        },
        {
            title: '3. Correct Wiping',
            description: 'Always wipe from front to back after using the toilet to keep bacteria from the anus away from the vagina.',
        },
        {
            title: '4. Handwashing',
            description: 'Wash hands with soap before and after changing any product to stop germ spread.',
        },
        {
            title: '5. Safe Disposal',
            description: 'Wrap used products in paper and place them in a covered bin. Never flush them, as they cause massive sewage blockages.',
        }
    ]

    return (
        <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-50 via-background to-lavender-50 dark:from-pink-950/10 dark:to-lavender-950/10">
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-600 text-xs font-black uppercase tracking-widest">
                            <Heart className="w-3 h-3" />
                            Essential Hygiene Guide
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.1]">
                            Menstrual <span className="text-secondary-foreground">Hygiene</span>
                        </h1>
                        <p className="max-w-2xl text-lg text-muted-foreground font-medium leading-relaxed italic">
                            Implementing these simple steps daily can significantly reduce health risks and improve your comfort during your cycle.
                        </p>
                    </div>
                </section>

                {/* Structured Content Section */}
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Textual Steps */}
                    <section className="space-y-8">
                        <div className="space-y-2 mb-8">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <div className="w-2 h-8 bg-primary rounded-full" />
                                Essential Practices
                            </h2>
                        </div>
                        <div className="space-y-10">
                            {hygieneSteps.map((step, idx) => (
                                <div key={idx} className="space-y-3 relative pl-8 border-l-2 border-primary/10">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-primary shadow-sm" />
                                    <h3 className="text-xl font-black tracking-tight text-foreground">{step.title}</h3>
                                    <p className="text-muted-foreground font-medium leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Right: Media Placeholders */}
                    <section className="space-y-8">
                        <div className="space-y-12">
                            {/* Image Visual Fit */}
                            <div className="aspect-video relative overflow-hidden rounded-[2rem] shadow-2xl border border-primary/10">
                                <Image
                                    src="/images/hygiene pic.png"
                                    alt="Menstrual Hygiene"
                                    fill
                                    className="object-cover animate-in fade-in zoom-in-105 duration-1000"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                            </div>

                            {/* Menstrual Hygiene Management Video */}
                            <div className="aspect-video relative overflow-hidden rounded-[2rem] shadow-2xl border border-primary/10 bg-black">
                                <iframe
                                    src="https://www.youtube.com/embed/kd_gR_S-rGw"
                                    title="Menstrual Hygiene Management Video"
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
                        <h3 className="text-3xl font-black tracking-tight">Ready to continue your health journey?</h3>
                        <p className="text-muted-foreground font-medium italic">
                            Your well-being is a constant practice. If you have any specific concerns, our risk assessment tools are always available.
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
                    Empowering through Education &copy; 2026 OVIRA Healthcare
                </p>
            </footer>
        </div>
    )
}
