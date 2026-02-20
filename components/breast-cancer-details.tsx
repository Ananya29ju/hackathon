'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft, Heart, Image as ImageIcon, Video, PlayCircle, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import Header from './header'

interface BreastCancerDetailsProps {
    onNavigate: (view: string) => void
    onStartAssessment: (type: 'menstrual' | 'cancer' | 'both') => void
    userName?: string
}

export default function BreastCancerDetails({ onNavigate, onStartAssessment, userName = 'Ananya' }: BreastCancerDetailsProps) {
    const symptoms = [
        {
            title: '1. New Lumps',
            description: 'A new, often painless lump or thickening in the breast or underarm area.',
        },
        {
            title: '2. Skin Changes',
            description: 'Dimpling, puckering, or redness of the skin (sometimes looking like an orange peel).',
        },
        {
            title: '3. Nipple Abnormalities',
            description: 'Nipple retraction (turning inward), discharge other than breast milk (especially bloody), or persistent scaling/crusting.',
        },
        {
            title: '4. Size/Shape Changes',
            description: 'Unexplained swelling, shrinkage, or asymmetry in the appearance of the breast(s).',
        },
        {
            title: '5. Persistent Pain',
            description: 'While less common as an early sign, constant pain in a specific area of the breast or nipple should be evaluated.',
        }
    ]

    return (
        <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-background to-blue-50 dark:from-indigo-950/10 dark:to-blue-950/10">
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
                        Back to Preventive Care
                    </Button>

                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-600 text-xs font-black uppercase tracking-widest">
                            <AlertCircle className="w-3 h-3" />
                            Clinical Awareness
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.1]">
                            Breast Cancer <span className="text-secondary-foreground">Symptoms</span>
                        </h1>
                        <p className="max-w-2xl text-lg text-muted-foreground font-medium leading-relaxed italic">
                            Regular self-awareness and screening are critical for identifying changes in breast tissue early.
                        </p>
                    </div>
                </section>

                {/* Structured Content Section */}
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Textual Content */}
                    <section className="space-y-8">
                        <div className="space-y-2 mb-8">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-indigo-700 dark:text-indigo-400">
                                <div className="w-2 h-8 bg-indigo-500 rounded-full" />
                                Symptoms to Monitor
                            </h2>
                        </div>
                        <div className="space-y-10">
                            {symptoms.map((step, idx) => (
                                <div key={idx} className="space-y-3 relative pl-8 border-l-2 border-indigo-500/10">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-indigo-500 shadow-sm" />
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
                            {/* Breast Cancer Symptom Image */}
                            <a href="https://cancerindia.org.in/breast-cancer/#1715844895196-f82fd58d-20c6" target="_blank" rel="noopener noreferrer" className="block group text-center">
                                <Card className="aspect-video relative overflow-hidden rounded-[2rem] border-none shadow-2xl border border-primary/10">
                                    <Image
                                        src="/images/breast.jpeg"
                                        alt="Breast Cancer Symptom Illustration"
                                        fill
                                        className="object-cover animate-in fade-in zoom-in-105 duration-1000"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                                </Card>
                                <p className="mt-4 text-center text-xs font-black text-primary group-hover:underline uppercase tracking-wider">click here for more info</p>
                            </a>

                            {/* Breast Self-Exam Video Guide */}
                            <div className="aspect-video relative overflow-hidden rounded-[2rem] shadow-2xl border border-primary/10 bg-black">
                                <iframe
                                    src="https://www.youtube.com/embed/KyeiZJrWrys"
                                    title="Breast Self-Exam Guide"
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
                        <h3 className="text-3xl font-black tracking-tight">Early detection saves lives</h3>
                        <p className="text-muted-foreground font-medium italic">
                            If you notice any of these changes, please consult a healthcare professional. Most changes are not cancerous, but verification is essential.
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
                    Clinical Excellence &copy; 2026 OVIRA Healthcare
                </p>
            </footer>
        </div>
    )
}
