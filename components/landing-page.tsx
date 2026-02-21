import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, Heart, Shield, Activity, ChevronRight, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import Header from './header'

interface LandingPageProps {
  onStartAssessment: (type: 'menstrual' | 'cancer' | 'both') => void
  userName?: string
  isLoggedIn?: boolean
  onNavigate: (view: string) => void
  userRole?: string
}

export default function LandingPage({ onStartAssessment, userName = 'Ananya', isLoggedIn = false, onNavigate, userRole }: LandingPageProps) {
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
        userRole={userRole}
      />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 pt-8 pb-4 animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest shadow-sm">
            <Shield className="w-3 h-3" />
            Your Health, Protected & Understood
          </div>

          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground leading-[1.1]">
            Smart <span className="text-primary italic">Health</span> <br className="hidden md:block" />
            Shield.
          </h2>

          <p className="max-w-xl mx-auto text-lg text-muted-foreground font-medium leading-relaxed">
            Hi {userName}, {greeting}! {userRole === 'asha'
              ? "Ready to assist the community? Let's conduct a health assessment for a patient today."
              : "Let's check in on your health today with our evidence-based, supportive assessment tool."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 max-w-3xl mx-auto">
            <Button
              onClick={() => onStartAssessment('menstrual')}
              size="lg"
              className="h-16 px-6 rounded-2xl bg-secondary text-secondary-foreground hover:bg-secondary/90 font-black shadow-lg shadow-secondary/10 flex flex-col items-center justify-center gap-1 group transition-all"
            >
              <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-xs uppercase tracking-widest">Menstrual Validation</span>
            </Button>

            <Button
              onClick={() => onStartAssessment('cancer')}
              size="lg"
              className="h-16 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-lg shadow-primary/20 flex flex-col items-center justify-center gap-1 group transition-all"
            >
              <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-xs uppercase tracking-widest">She Shield</span>
            </Button>

            <Button
              onClick={() => onNavigate(userRole === 'asha' ? 'asha-patients' : 'preventive-care')}
              size="lg"
              variant="outline"
              className="h-16 px-6 rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90 font-black shadow-lg shadow-accent/10 flex flex-col items-center justify-center gap-1 group transition-all"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform text-primary" />
              <span className="text-xs uppercase tracking-widest">{userRole === 'asha' ? 'Patient Registry' : 'Wellness Hub'}</span>
            </Button>
          </div>
        </section>

        {/* Revitalized dynamic Cards Section */}
        <section className="grid md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <Card className="group relative overflow-hidden p-10 rounded-[2.5rem] border-none shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-white/80 to-primary/10 dark:from-black/40 dark:to-primary/5 backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150 group-hover:bg-primary/10" />
            <div className="relative space-y-6">
              <div className="w-16 h-16 bg-primary/10 rounded-[1.25rem] flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-inner">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black tracking-tight text-foreground transition-colors group-hover:text-primary">Purely Private</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  Your health data is encrypted and remains strictly between you and your records.
                </p>
              </div>
            </div>
          </Card>

          <Card className="group relative overflow-hidden p-10 rounded-[2.5rem] border-none shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-white/80 to-secondary/10 dark:from-black/40 dark:to-secondary/5 backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150 group-hover:bg-secondary/20" />
            <div className="relative space-y-6">
              <div className="w-16 h-16 bg-secondary/20 rounded-[1.25rem] flex items-center justify-center group-hover:-rotate-12 group-hover:scale-110 transition-all duration-500 shadow-inner">
                <Heart className="w-8 h-8 text-secondary-foreground" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black tracking-tight text-foreground transition-colors group-hover:text-secondary-foreground">Evidence-Based</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  Built on peer-reviewed medical research to provide accurate, reliable insights.
                </p>
              </div>
            </div>
          </Card>

          <Card className="group relative overflow-hidden p-10 rounded-[2.5rem] border-none shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-white/80 to-accent/10 dark:from-black/40 dark:to-accent/5 backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150 group-hover:bg-accent/20" />
            <div className="relative space-y-6">
              <div className="w-16 h-16 bg-accent/20 rounded-[1.25rem] flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-inner">
                <AlertCircle className="w-8 h-8 text-accent-foreground" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black tracking-tight text-foreground transition-colors group-hover:text-accent-foreground">Clearly Outlined</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  No complex jargon. We provide clear results to help you discuss health with your doctor.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Specialized Flows */}
        <div className="space-y-8">
          {userRole === 'asha' && (
            <Card className="rounded-[2.5rem] p-8 bg-primary text-white border-none shadow-xl shadow-primary/20 overflow-hidden relative group cursor-pointer" onClick={() => onNavigate('asha-patients')}>
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Activity className="w-48 h-48" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-widest">
                    ASHA Exclusive
                  </div>
                  <h3 className="text-4xl font-black tracking-tighter">Your Patient Command Center</h3>
                  <p className="text-primary-foreground/80 font-medium max-w-xl">
                    View your registry, track high-risk community members, and manage your follow-ups in one beautiful workspace.
                  </p>
                  <Button variant="secondary" className="rounded-full px-8 h-12 font-bold group">
                    Open Registry
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <Card className="rounded-[2.5rem] p-8 bg-primary/5 border-none">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 space-y-4">
                <h3 className="text-3xl font-bold tracking-tight">Wellness Hub & Initiatives</h3>
                <p className="text-muted-foreground font-medium">
                  Explore our community initiatives and educational resources to empower your health journey.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    variant="secondary"
                    onClick={() => onNavigate('preventive-care')}
                    className="rounded-full font-bold h-11 px-6"
                  >
                    Explore Wellness Hub
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('heatmap')}
                    className="rounded-full font-bold h-11 px-6 border-primary/20 hover:bg-primary/5"
                  >
                    View Risk Heatmap
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
        </div>

        {/* Initiative Sections */}
        <section className="py-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 w-full">
          <Card className="rounded-[2.5rem] overflow-hidden border-none shadow-xl glass-card bg-white/60 dark:bg-black/60 backdrop-blur-2xl">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                    Community Initiative
                  </div>
                  <h2 className="text-3xl font-black tracking-tighter text-foreground leading-tight">
                    SheShield Screening 💗🛡️
                  </h2>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground font-semibold leading-relaxed">
                    A gentle women’s health screening that helps identify early risk signs related to breast, ovarian, and reproductive health.
                  </p>
                </div>
              </div>
              <div className="lg:w-2/5 relative bg-primary/5 min-h-[300px]">
                <img
                  src="/images/asha.png"
                  alt="SheShield Initiative"
                  className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Menstrual Wellness Section - Medium Sized */}
        <section className="py-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400 w-full px-4">
          <Card className="rounded-[2.5rem] overflow-hidden border-none shadow-xl glass-card bg-white/60 dark:bg-black/60 backdrop-blur-2xl transition-all duration-500 hover:shadow-secondary/5">
            <div className="flex flex-col lg:flex-row">
              {/* Content Side (Left) */}
              <div className="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-[10px] font-black uppercase tracking-widest">
                    Cycle Wellness
                  </div>
                  <h2 className="text-3xl font-black tracking-tighter text-foreground leading-tight">
                    Menstrual Validation 🩸✨
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-secondary shrink-0 shadow-[0_0_8px_rgba(var(--secondary),0.4)]" />
                    <p className="text-sm text-muted-foreground font-semibold leading-relaxed">
                      Menstrual health reflects the overall well‑being of a woman’s reproductive system. Regular cycles, manageable flow, and minimal discomfort usually indicate healthy hormonal balance.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-secondary shrink-0 shadow-[0_0_8px_rgba(var(--secondary),0.4)]" />
                    <p className="text-sm text-muted-foreground font-semibold leading-relaxed">
                      Tracking your cycle helps identify changes early and supports timely care.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-secondary shrink-0 shadow-[0_0_8px_rgba(var(--secondary),0.4)]" />
                    <p className="text-sm text-muted-foreground font-semibold leading-relaxed">
                      Maintaining good nutrition, hygiene, and stress balance plays an important role in healthy menstruation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Side (Right) */}
              <div className="lg:w-2/5 relative bg-secondary/5 min-h-[300px]">
                <img
                  src="/images/mens.png"
                  alt="Menstrual Wellness"
                  className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                />
              </div>
            </div>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border/30 py-8 text-center bg-muted/30 mt-auto">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground/40">
          Developed with Care &copy; 2026 OVIRA Healthcare
        </p>
      </footer>
    </div>
  )
}
