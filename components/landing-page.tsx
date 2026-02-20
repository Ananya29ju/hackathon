import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, Heart, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
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
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        onStartAssessment={onStartAssessment}
        userName={userName}
        onNavigate={onNavigate}
        isLoggedIn={isLoggedIn}
      />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 pt-8 pb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            <Shield className="w-3 h-3" />
            Your Health, Protected & Understood
          </div>

          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground leading-[1.1]">
            Smart <span className="text-primary italic">Health</span> <br className="hidden md:block" />
            Shield.
          </h2>

          <p className="max-w-xl mx-auto text-lg text-muted-foreground font-medium leading-relaxed">
            Hi {userName}, {greeting}! Let's check in on your health today with our evidence-based, supportive assessment tool.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button
              onClick={() => onStartAssessment('cancer')}
              size="lg"
              className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-bold"
            >
              Start SheShield Screening
              <Shield className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate('heatmap')}
              size="lg"
              className="h-14 px-8 rounded-full border-2"
            >
              Explore Map
            </Button>
          </div>
        </section>

        {/* Dynamic Cards Section */}
        <section className="grid md:grid-cols-3 gap-8">
          <Card className="group p-8 rounded-2xl border bg-muted/30">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight">Purely Private</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your health data is encrypted and remains strictly between you and your records.
            </p>
          </Card>

          <Card className="group p-8 rounded-2xl border bg-muted/30">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight">Evidence-Based</h3>
            <p className="text-muted-foreground leading-relaxed">
              Built on peer-reviewed medical research to provide accurate, reliable insights.
            </p>
          </Card>

          <Card className="group p-8 rounded-2xl border bg-muted/30">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <AlertCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight">Clearly Outlined</h3>
            <p className="text-muted-foreground leading-relaxed">
              No complex jargon. We provide clear results to help you discuss health with your doctor.
            </p>
          </Card>
        </section>

        {/* Specialized Flows */}
        <Card className="rounded-2xl p-8 bg-primary/5 border-none">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-4">
              <h3 className="text-3xl font-bold tracking-tight">Need a quicker check?</h3>
              <p className="text-muted-foreground">
                You can start specifically with your menstrual cycle or go straight to SheShield Screening.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => onStartAssessment('menstrual')}
                  className="rounded-full"
                >
                  Menstrual Check
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => onStartAssessment('cancer')}
                  className="rounded-full"
                >
                  SheShield Screening
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/3 p-4 bg-background rounded-2xl border border-border">
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
      <footer className="border-t border-border/30 py-8 text-center bg-muted/30 mt-auto">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground/40">
          Developed with Care &copy; 2026 OVIRA Healthcare
        </p>
      </footer>
    </div>
  )
}
