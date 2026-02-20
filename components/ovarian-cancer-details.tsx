'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft, Heart, Image as ImageIcon, Video, PlayCircle, Waves } from 'lucide-react'
import Image from 'next/image'
import Header from './header'

interface OvarianCancerDetailsProps {
    onNavigate: (view: string) => void
    onStartAssessment: (type: 'menstrual' | 'cancer' | 'both') => void
    userName?: string
}

export default function OvarianCancerDetails({ onNavigate, onStartAssessment, userName = 'Ananya' }: OvarianCancerDetailsProps) {
    const symptoms = [
        {
            title: 'B - Bloating',
            description: "Persistent abdominal bloating or swelling that doesn't go away.",
        },
        {
            title: 'E - Early Satiety',
            description: 'Feeling full quickly after eating very little or having a loss of appetite.',
        },
        {
            title: 'A - Abdominal Pain',
            description: 'Ongoing pain or pressure in the pelvic area or lower abdomen.',
        },
        {
            title: 'C - Changes in Habits',
            description: 'New or frequent urge to urinate and changes in bowel habits like constipation or diarrhoea.',
        },
        {
            title: 'H - Heightened Fatigue',
            description: "Constant, extreme tiredness that doesn't improve with rest.",
        }
    ]

    return (
        <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-lavender-50 via-background to-indigo-50 dark:from-lavender-950/10 dark:to-indigo-950/10">
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lavender-100 text-lavender-600 text-xs font-black uppercase tracking-widest">
                            <Waves className="w-3 h-3" />
                            BEACH Awareness
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.1]">
                            Ovarian Cancer <span className="text-secondary-foreground">Symptoms</span>
                        </h1>
                        <p className="max-w-2xl text-lg text-muted-foreground font-medium leading-relaxed italic">
                            The "BEACH" acronym is a vital tool for recognizing persistent changes that require medical evaluation.
                        </p>
                    </div>
                </section>

                {/* Structured Content Section */}
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Textual Content */}
                    <section className="space-y-8">
                        <div className="space-y-2 mb-8">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-lavender-700 dark:text-lavender-400">
                                <div className="w-2 h-8 bg-lavender-500 rounded-full" />
                                Recognizing the Signs (BEACH)
                            </h2>
                        </div>
                        <div className="space-y-10">
                            {symptoms.map((step, idx) => (
                                <div key={idx} className="space-y-3 relative pl-8 border-l-2 border-lavender-500/10">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-lavender-500 shadow-sm" />
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
                            {/* Ovarian Cancer Symptom Image */}
                            <a href="https://www.maxhealthcare.in/blogs/ovarian-cancer-types-stages-and-diagnosis" target="_blank" rel="noopener noreferrer" className="block group text-center">
                                <Card className="aspect-video relative overflow-hidden rounded-[2rem] border-none shadow-2xl border border-primary/10">
                                    <Image
                                        src="/images/ova.jpeg"
                                        alt="Ovarian Cancer Symptom Illustration"
                                        fill
                                        className="object-cover animate-in fade-in zoom-in-105 duration-1000"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                                </Card>
                                <p className="mt-4 text-center text-xs font-black text-primary group-hover:underline uppercase tracking-wider">click here for more info</p>
                            </a>

                            {/* Ovarian Cancer Awareness Video */}
                            <div className="aspect-video relative overflow-hidden rounded-[2rem] shadow-2xl border border-primary/10 bg-black">
                                <iframe
                                    src="https://www.youtube.com/embed/spNNsPQK9pE"
                                    title="Ovarian Cancer Symptoms Guide"
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
                        <h3 className="text-3xl font-black tracking-tight">Listen to your body</h3>
                        <p className="text-muted-foreground font-medium italic">
                            Ovarian cancer symptoms can be subtle. If these symptoms are persistent (occurring more than 12 times a month), please consult your gynecologist.
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
                    Ovarian Health Awareness &copy; 2026 OVIRA Healthcare
                </p>
            </footer>
        </div>
    )
}
