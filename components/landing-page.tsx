import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, Heart, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Header from './header'

interface LandingPageProps {
  onStartAssessment: (type: 'menstrual' | 'cancer' | 'both') => void
  userName?: string
  isLoggedIn?: boolean
  onNavigate: (view: string) => void
}

export default function LandingPage({ onStartAssessment, userName = 'Ananya', isLoggedIn = false, onNavigate }: LandingPageProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return 'Good morning'
    if (hour >= 12 && hour < 17) return 'Good afternoon'
    if (hour >= 17 && hour < 21) return 'Good evening'
    return 'Good night'
  }

  const greeting = getGreeting()

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-50 via-background to-lavender-50 dark:from-pink-950/10 dark:to-lavender-950/10">
      <Header
        onStartAssessment={onStartAssessment}
        userName={userName}
        onNavigate={onNavigate}
      />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 pt-8 pb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2">
            <Shield className="w-3 h-3" />
            Your Health, Protected & Understood
          </div>

          <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.1]">
            Experience a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-lavender-600">Calmer</span> <br className="hidden md:block" />
            Health Journey.
          </h2>

          <p className="max-w-xl mx-auto text-lg text-muted-foreground font-medium leading-relaxed italic">
            Hi {userName}, {greeting}! Let's check in on your health today with our evidence-based, supportive assessment tool.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button
              onClick={() => onStartAssessment('both')}
              size="lg"
              className="h-14 px-10 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all"
            >
              Start Full Assessment
              <Shield className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate('heatmap')}
              size="lg"
              className="h-14 px-10 rounded-full border-2 border-primary/20 text-primary font-bold hover:bg-primary/5 transition-all"
            >
              Explore Heat Map
            </Button>
          </div>
        </section>

        {/* Dynamic Cards Section */}
        <section className="grid md:grid-cols-3 gap-6">
          <Card className="group p-8 rounded-[2rem] border-pink-100 bg-white/50 backdrop-blur-sm dark:bg-black/20 dark:border-pink-900/30 hover:shadow-2xl hover:shadow-pink-200/50 transition-all duration-500 hover:-translate-y-2">
            <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/40 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
              <Shield className="w-7 h-7 text-pink-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Purely Private</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Your health data is encrypted and remains strictly between you and your records.
            </p>
          </Card>

          <Card className="group p-8 rounded-[2rem] border-lavender-100 bg-white/50 backdrop-blur-sm dark:bg-black/20 dark:border-lavender-900/30 hover:shadow-2xl hover:shadow-lavender-200/50 transition-all duration-500 hover:-translate-y-2">
            <div className="w-14 h-14 bg-lavender-100 dark:bg-lavender-900/40 rounded-2xl flex items-center justify-center mb-6 group-hover:-rotate-12 transition-transform">
              <Heart className="w-7 h-7 text-lavender-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Evidence-Based</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Built on peer-reviewed medical research to provide accurate, reliable insights.
            </p>
          </Card>

          <Card className="group p-8 rounded-[2rem] border-peach-100 bg-white/50 backdrop-blur-sm dark:bg-black/20 dark:border-peach-900/30 hover:shadow-2xl hover:shadow-peach-200/50 transition-all duration-500 hover:-translate-y-2">
            <div className="w-14 h-14 bg-peach-100 dark:bg-peach-900/40 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <AlertCircle className="w-7 h-7 text-peach-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Clearly Outlined</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              No complex jargon. We provide clear results to help you discuss health with your doctor.
            </p>
          </Card>
        </section>

        {/* Specialized Flows */}
        <Card className="rounded-[2.5rem] p-1 bg-gradient-to-br from-primary/20 via-transparent to-lavender-200/20 border-none shadow-none">
          <div className="bg-background rounded-[2.4rem] p-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-4">
              <h3 className="text-3xl font-black tracking-tight">Need a quicker check?</h3>
              <p className="text-muted-foreground font-medium italic">
                You can start specifically with your menstrual cycle or go straight to cancer validation.
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => onStartAssessment('menstrual')}
                  className="rounded-full px-6 py-6 h-auto font-bold bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300 hover:bg-pink-200"
                >
                  Menstrual Check
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => onStartAssessment('cancer')}
                  className="rounded-full px-6 py-6 h-auto font-bold bg-lavender-100 dark:bg-lavender-950 text-lavender-600 dark:text-lavender-300 hover:bg-lavender-200"
                >
                  Cancer Validation
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/3 p-4 bg-muted/30 rounded-[2rem] border border-border/40">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Important: Our tools are educational. Always consult a healthcare professional for clinical diagnosis.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 text-center bg-white/30 backdrop-blur-sm mt-auto">
        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-muted-foreground/40">
          Developed with Care &copy; 2026 OVIRA Healthcare
        </p>
      </footer>
    </div>
  )
}
