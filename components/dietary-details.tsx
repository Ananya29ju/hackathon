'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft, Heart, Image as ImageIcon, Video, PlayCircle, Apple } from 'lucide-react'
import Image from 'next/image'
import Header from './header'

interface DietaryDetailsProps {
    onNavigate: (view: string) => void
    onStartAssessment: (type: 'menstrual' | 'cancer' | 'both') => void
    userName?: string
}

export default function DietaryDetails({ onNavigate, onStartAssessment, userName = 'Ananya' }: DietaryDetailsProps) {
    const includeItems = [
        {
            title: 'Iron',
            description: 'Spinach, lentils, and lean meats help replace iron lost through bleeding.',
        },
        {
            title: 'Magnesium',
            description: 'Dark chocolate (70%+ cocoa), bananas, and nuts help relax muscles and ease cramps.',
        },
        {
            title: 'Hydration',
            description: 'Drink 2.7+ litres of water daily to reduce bloating and dehydration headaches.',
        },
        {
            title: 'Healthy Fats',
            description: 'Salmon and flaxseeds contain Omega-3s, which lower inflammation and pain.',
        }
    ]

    const avoidItems = [
        {
            title: 'Salty & Processed Foods',
            description: 'These cause water retention and make bloating worse.',
        },
        {
            title: 'Caffeine',
            description: 'Can increase anxiety and breast tenderness; try herbal teas like chamomile instead.',
        },
        {
            title: 'Sugar',
            description: 'Prevents blood sugar crashes that trigger mood swings.',
        }
    ]

    return (
        <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-50 via-background to-emerald-50 dark:from-green-950/10 dark:to-emerald-950/10">
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-600 text-xs font-black uppercase tracking-widest">
                            <Apple className="w-3 h-3" />
                            Nutritional Balance
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.1]">
                            Dietary <span className="text-secondary-foreground">Recommendations</span>
                        </h1>
                        <p className="max-w-2xl text-lg text-muted-foreground font-medium leading-relaxed italic">
                            What you eat influences how your body handles hormonal shifts and physical symptoms.
                        </p>
                    </div>
                </section>

                {/* Structured Content Section */}
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Textual Content */}
                    <div className="space-y-12">
                        {/* Include Section */}
                        <section className="space-y-8">
                            <div className="space-y-2 mb-8">
                                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-green-700 dark:text-green-400">
                                    <div className="w-2 h-8 bg-green-500 rounded-full" />
                                    Items to Include
                                </h2>
                            </div>
                            <div className="space-y-10">
                                {includeItems.map((item, idx) => (
                                    <div key={idx} className="space-y-3 relative pl-8 border-l-2 border-green-500/10">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-green-500 shadow-sm" />
                                        <h3 className="text-xl font-black tracking-tight text-foreground">{item.title}</h3>
                                        <p className="text-muted-foreground font-medium leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Avoid/Limit Section */}
                        <section className="space-y-8">
                            <div className="space-y-2 mb-8">
                                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-orange-700 dark:text-orange-400">
                                    <div className="w-2 h-8 bg-orange-500 rounded-full" />
                                    Avoid or Limit
                                </h2>
                            </div>
                            <div className="space-y-10">
                                {avoidItems.map((item, idx) => (
                                    <div key={idx} className="space-y-3 relative pl-8 border-l-2 border-orange-500/10">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-orange-500 shadow-sm" />
                                        <h3 className="text-xl font-black tracking-tight text-foreground">{item.title}</h3>
                                        <p className="text-muted-foreground font-medium leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right: Media Placeholders */}
                    <section className="space-y-8 sticky top-32">
                        <div className="space-y-12">
                            {/* Image Placeholder Replacement */}
                            <div className="aspect-video relative overflow-hidden rounded-[2rem] shadow-2xl border border-primary/10">
                                <Image
                                    src="/images/dietary-hero.png"
                                    alt="Healthy vs Junk Food Comparison"
                                    fill
                                    className="object-cover animate-in fade-in zoom-in-105 duration-1000"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                            </div>

                            {/* Nutritional Video Guide */}
                            <div className="aspect-video relative overflow-hidden rounded-[2rem] shadow-2xl border border-primary/10 bg-black">
                                <iframe
                                    src="https://www.youtube.com/embed/E-8gvJlkY8c"
                                    title="Hormonal Health Nutrition Video"
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
                        <h3 className="text-3xl font-black tracking-tight">Nourish your body correctly</h3>
                        <p className="text-muted-foreground font-medium italic">
                            Small dietary changes can lead to significant improvements in energy and comfort. Start with one change today.
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
                    Nourishment through Knowledge &copy; 2026 OVIRA Healthcare
                </p>
            </footer>
        </div>
    )
}
