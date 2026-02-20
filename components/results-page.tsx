'use client'
import { useState } from 'react'

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
  AlertCircle,
  Copy,
  CheckCircle2,
  ChevronLeft
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
  },
  critical: {
    color: "rose",
    badgeLabel: "Urgent Attention Needed",
    badgeClass: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-900/50",
    message: "Your responses indicate multiple symptoms that require immediate clinical evaluation.",
    support: "Taking prompt action is the most important step. Many conditions are highly treatable when addressed quickly.",
    recommendation: "Please contact a healthcare professional or visit a women's health clinic immediately for a comprehensive examination.",
    icon: <AlertCircle className="w-8 h-8 text-rose-600" />,
    buttons: [
      { label: "Find Urgent Care", icon: <MapPin className="w-4 h-4 text-rose-500" /> },
      { label: "Contact Oncology Specialist", icon: <Stethoscope className="w-4 h-4 text-rose-500" /> }
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

  const [copied, setCopied] = useState(false)

  const handleCopySummary = () => {
    const summary = `
HEALTH ASSESSMENT SUMMARY (Educational Only)
Date: ${new Date().toLocaleDateString()}
Profile: ${results.age} yrs, BMI: ${results.bmi}

PRIMARY ANALYSIS: ${isMenstrualOnly ? 'Hormonal Stability' : (results.overallRisks?.risks?.[primaryRiskKey]?.name || 'N/A')}
Risk Category: ${category.toUpperCase()}
Risk Score: ${score}/100

NOTES: These results were generated using a digital self-assessment tool and are intended for clinical discussion.
    `.trim()

    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/30 via-background to-primary/5 selection:bg-primary/20">
      <Header
        onNavigate={onNavigate}
        onStartAssessment={onStartAssessment}
        showNav={true}
        isLoggedIn={isLoggedIn}
        userName={userName}
      />

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-12 flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center space-y-6 max-w-2xl animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground transition-all">
            Your Health Insight Summary
          </h1>
          <div className="space-y-3">
            <p className="text-muted-foreground font-medium italic text-lg">
              Important: Our tools are educational. Always consult a healthcare professional for clinical diagnosis.
            </p>
            <p className="text-primary/60 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 bg-primary/5 py-2.5 px-6 rounded-full w-fit mx-auto border border-primary/10 shadow-sm">
              <Activity className="w-3.5 h-3.5" />
              AI-Generated Analysis: Use as educational guidance only
            </p>
          </div>
        </div>

        {/* Central Result Card */}
        <Card className="w-full relative overflow-hidden p-8 md:p-14 rounded-[4rem] border-none shadow-2xl shadow-primary/5 bg-white/60 dark:bg-black/40 backdrop-blur-3xl animate-in zoom-in-95 duration-1000">
          <div className="absolute -top-12 -right-12 p-8 opacity-5 pointer-events-none rotate-12">
            <Shield className="w-64 h-64 text-primary" fill="currentColor" />
          </div>

          <div className="relative flex flex-col items-center space-y-12 text-center">
            {/* Dynamic Speedometer - Only one as requested */}
            {results.assessmentType === 'both' ? (
              <div className="w-full flex flex-col md:flex-row items-center justify-center gap-12 py-10 scale-[0.85] md:scale-100 transition-all">
                <div className="space-y-4">
                  <p className="text-xs font-black uppercase tracking-widest text-primary/60 text-center">Menstrual Health</p>
                  <Speedometer
                    value={results.menstrualRisk || 0}
                    riskCategory={getRiskCategory(results.menstrualRisk || 0)}
                    size="md"
                    label="Menstrual Index"
                  />
                </div>
                <div className="w-px h-32 bg-primary/10 hidden md:block" />
                <div className="space-y-4">
                  <p className="text-xs font-black uppercase tracking-widest text-primary/60 text-center">Medical Screening</p>
                  <Speedometer
                    value={results.overallRisks?.risks?.[primaryRiskKey]?.score || 0}
                    riskCategory={getRiskCategory(results.overallRisks?.risks?.[primaryRiskKey]?.score || 0)}
                    size="md"
                    label="Medical Risk Index"
                  />
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-center py-4 transform scale-105 transition-transform duration-700 hover:scale-110">
                <Speedometer
                  value={score}
                  riskCategory={category}
                  size="lg"
                  label={isMenstrualOnly ? "Menstrual Profile" : "Medical Risk Index"}
                />
              </div>
            )}

            {/* Risk Badge */}
            <div className={cn(
              "inline-flex items-center gap-3 px-10 py-5 rounded-full font-black text-xl md:text-2xl border transition-all duration-700 shadow-lg",
              config.badgeClass,
              "hover:shadow-xl hover:-translate-y-0.5"
            )}>
              <div className="animate-pulse">
                {config.icon}
              </div>
              {config.badgeLabel}
            </div>

            {/* Messages */}
            <div className="space-y-8 max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
              <p className="text-2xl md:text-4xl font-black text-foreground tracking-tight leading-tight">
                {config.message}
              </p>

              <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                {config.support}
              </p>

              <div className="p-10 rounded-[3rem] bg-secondary border border-secondary/50 text-secondary-foreground font-bold italic text-lg shadow-inner">
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-secondary-foreground/60 mb-4">Professional Guidance</span>
                "{config.recommendation}"
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
              {config.buttons.map((btn, idx) => (
                <Button
                  key={idx}
                  onClick={() => {
                    if (btn.label.includes("Preventive Care")) {
                      onNavigate('preventive-care')
                    } else if (btn.label.includes("Nearby") || btn.label.includes("Hospital") || btn.label.includes("Specialist") || btn.label.includes("Clinics")) {
                      window.open(`https://www.google.com/maps/search/${encodeURIComponent(btn.label)}`, '_blank')
                    }
                  }}
                  variant={idx === 0 ? "default" : "secondary"}
                  className={cn(
                    "h-20 rounded-[2rem] text-lg font-black gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all",
                    idx === 0 ? "bg-primary hover:bg-primary/90 text-white shadow-primary/20" : "bg-white/80 dark:bg-white/10 dark:text-white"
                  )}
                >
                  {btn.icon}
                  {btn.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-8 items-center justify-center pt-8 animate-in fade-in duration-1000 delay-1000">
          <Button
            onClick={handleCopySummary}
            variant="outline"
            className={cn(
              "h-16 px-10 rounded-[2rem] gap-3 font-black transition-all hover:scale-105 border-2",
              copied ? "border-emerald-500 text-emerald-600 bg-emerald-50" : "border-primary/20 text-primary hover:bg-primary/5"
            )}
          >
            {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? "Copied to Clipboard!" : "Copy Summary for Doctor"}
          </Button>

          {showCancerPrompt && onContinueToCancer && (
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-xl font-bold text-foreground">
                Would you like to perform a SheShield Screening as well?
              </p>
              <Button
                onClick={onContinueToCancer}
                className="group h-16 px-10 rounded-[2rem] gap-3 bg-primary text-white font-black transition-all shadow-lg shadow-primary/20 hover:scale-105"
              >
                Yes, Start SheShield Scanning
                <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => onNavigate('preventive-care')}
              variant="outline"
              className="h-16 px-10 rounded-[2rem] gap-3 font-black text-accent-foreground border-accent/20 hover:bg-accent/5 transition-all hover:scale-105"
            >
              <Heart className="w-5 h-5 text-accent" />
              Visit Wellness Hub
            </Button>
            <Button
              onClick={() => onNavigate('heatmap')}
              variant="outline"
              className="h-16 px-10 rounded-[2rem] gap-3 font-black text-primary border-primary/20 hover:bg-primary/5 transition-all hover:scale-105"
            >
              <MapPin className="w-5 h-5" />
              Explore Health Map
            </Button>
            <Button
              onClick={onRetake}
              variant="ghost"
              className="h-16 px-10 rounded-[2rem] gap-3 font-black text-muted-foreground hover:bg-primary/5 transition-all hover:scale-105"
            >
              <RotateCcw className="w-5 h-5" />
              Retake Assessment
            </Button>
          </div>
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
