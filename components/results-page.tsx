'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Shield,
  Heart,
  Leaf,
  Activity,
  RotateCcw,
  Calendar,
  MapPin,
  FileText,
  Stethoscope,
  AlertCircle
} from 'lucide-react'
import { getRiskCategory } from '@/lib/risk-calculator'
import Speedometer from './ui/speedometer'
import Header from './header'
import { cn } from '@/lib/utils'

interface ResultsPageProps {
  results: any
  onRetake: () => void
  onNavigate: (view: string) => void
  onStartAssessment: (type: 'menstrual' | 'cancer' | 'both') => void
  onContinueToCancer?: () => void
  showCancerPrompt?: boolean
  isLoggedIn?: boolean
  userName?: string
}

const RISK_CONFIG = {
  low: {
    color: "emerald",
    badgeLabel: "Low Risk",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/30",
    message: "Your responses do not indicate significant warning signs at this time.",
    support: "Maintaining regular health check-ups and a balanced lifestyle will help you stay on track.",
    recommendation: "We recommend continuing routine screenings and monitoring any new or unusual symptoms.",
    icon: <Shield className="w-6 h-6 text-emerald-500" />,
    buttons: [
      { label: "Schedule Routine Check-up", icon: <Calendar className="w-4 h-4 text-emerald-400" /> },
      { label: "View Preventive Care Tips", icon: <Heart className="w-4 h-4 text-emerald-400" /> }
    ]
  },
  moderate: {
    color: "amber",
    badgeLabel: "Health Check Recommended",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/30",
    message: "Some of your responses suggest patterns that would benefit from medical evaluation.",
    support: "Early consultation provides clarity, reassurance, and better preventive care.",
    recommendation: "We recommend scheduling a gynecological consultation within the next few weeks for further assessment.",
    icon: <Activity className="w-6 h-6 text-amber-500" />,
    buttons: [
      { label: "Find Nearby Women’s Clinics", icon: <MapPin className="w-4 h-4 text-amber-400" /> },
      { label: "Download Your Report", icon: <FileText className="w-4 h-4 text-amber-400" /> }
    ]
  },
  high: {
    color: "rose",
    badgeLabel: "Professional Consultation Advised",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-900/30",
    message: "Your responses indicate certain symptoms that should be evaluated by a healthcare professional.",
    support: "Many conditions are manageable when identified early. Taking timely action supports better outcomes.",
    recommendation: "Please consider booking a consultation with a qualified gynecologist or oncologist for a detailed examination.",
    icon: <AlertCircle className="w-6 h-6 text-rose-500" />,
    buttons: [
      { label: "Locate Nearby Hospitals", icon: <MapPin className="w-4 h-4 text-rose-400" /> },
      { label: "Contact a Specialist", icon: <Stethoscope className="w-4 h-4 text-rose-400" /> }
    ]
  }
}

export default function ResultsPage({
  results,
  onRetake,
  onNavigate,
  onStartAssessment,
  onContinueToCancer,
  showCancerPrompt,
  isLoggedIn = false,
  userName = 'User'
}: ResultsPageProps) {
  const isMenstrualOnly = results.assessmentType === 'menstrual'

  // Overall score/category logic
  const primaryRiskKey = results.overallRisks?.primaryRisk
  const score = isMenstrualOnly
    ? (results.menstrualRisk || 0)
    : (results.overallRisks?.risks?.[primaryRiskKey]?.score || 0)

  const category = getRiskCategory(score)
  const config = RISK_CONFIG[category]

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-lavender-50 via-white to-pink-50 dark:from-lavender-950/20 dark:via-background dark:to-pink-950/20 selection:bg-rose-100">
      <Header
        onNavigate={onNavigate}
        onStartAssessment={onStartAssessment}
        showNav={true}
        isLoggedIn={isLoggedIn}
        userName={userName}
      />

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-12 flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground transition-all">
            Your Health Insight Summary
          </h1>
          <div className="space-y-1">
            <p className="text-muted-foreground font-medium italic">
              Important: Our tools are educational. Always consult a healthcare professional for clinical diagnosis.
            </p>
            <p className="text-primary/60 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 bg-primary/5 py-2 px-4 rounded-full w-fit mx-auto border border-primary/10">
              <Activity className="w-3 h-3" />
              AI-Generated Analysis: Use as educational guidance only
            </p>
          </div>
        </div>

        {/* Central Result Card */}
        <Card className="w-full relative overflow-hidden p-8 md:p-14 rounded-[4rem] border-none shadow-2xl shadow-primary/5 bg-white/90 dark:bg-black/60 backdrop-blur-2xl animate-in zoom-in-95 duration-700">
          <div className="absolute -top-12 -right-12 p-8 opacity-5 pointer-events-none rotate-12">
            <Shield className="w-64 h-64 text-primary" fill="currentColor" />
          </div>

          <div className="relative flex flex-col items-center space-y-10 text-center">
            {/* Dynamic Speedometer - Only one as requested */}
            <div className="w-full flex justify-center py-4">
              <Speedometer
                value={score}
                riskCategory={category}
                size="lg"
                label="Overall Health Index"
              />
            </div>

            {/* Risk Badge */}
            <div className={cn(
              "inline-flex items-center gap-2 px-10 py-4 rounded-full font-black text-lg md:text-xl border transition-all duration-500 shadow-sm",
              config.badgeClass
            )}>
              <div className="animate-pulse">
                {config.icon}
              </div>
              {config.badgeLabel}
            </div>

            {/* Messages */}
            <div className="space-y-6 max-w-xl">
              <p className="text-2xl md:text-3xl font-black text-foreground tracking-tight leading-tight">
                {config.message}
              </p>

              <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                {config.support}
              </p>

              <div className="p-8 rounded-[2.5rem] bg-secondary/30 border border-secondary/50 text-foreground/80 font-semibold italic text-base">
                <span className="block text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Professional Guidance</span>
                "{config.recommendation}"
              </div>
            </div>

            {/* Dynamic Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pt-6">
              {config.buttons.map((btn, idx) => (
                <Button
                  key={idx}
                  variant={idx === 0 ? "default" : "secondary"}
                  className={cn(
                    "h-18 rounded-full text-lg font-black gap-3 shadow-lg hover:scale-[1.02] transition-all",
                    idx === 0 ? "bg-primary hover:bg-primary/90 text-white" : "bg-white dark:bg-white/10 dark:text-white"
                  )}
                >
                  {btn.icon}
                  {btn.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Supporting Secondary Actions */}
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center pt-8">
          {showCancerPrompt && onContinueToCancer && (
            <Button
              onClick={onContinueToCancer}
              className="group h-14 px-10 rounded-2xl gap-2 bg-lavender-100/50 hover:bg-lavender-100 text-lavender-700 font-bold transition-all border border-lavender-200"
            >
              Continue to SheShield Screening
              <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Button>
          )}

          <Button
            onClick={onRetake}
            variant="ghost"
            className="h-14 px-8 rounded-2xl gap-2 font-bold text-muted-foreground hover:bg-primary/5 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Assessment
          </Button>
        </div>

        {/* Calming Icons Flow */}
        <div className="flex justify-center gap-12 text-muted-foreground/30 py-4">
          <Leaf className="w-8 h-8" />
          <Heart className="w-8 h-8" />
          <Shield className="w-8 h-8" />
        </div>

        {/* Footer Reassurance */}
        <footer className="text-center py-8 max-w-md">
          <p className="text-sm font-bold tracking-wide text-foreground/40 leading-relaxed uppercase space-x-1">
            <span className="text-primary font-black">OVIRA</span>
            <span>supports early awareness and preventive care. You are taking a positive step toward your health.</span>
          </p>
        </footer>
      </main>
    </div>
  )
}
