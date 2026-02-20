'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
<<<<<<< HEAD
import { AlertCircle, Heart, RotateCcw, Calendar, Activity, Shield, Copy, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { getRiskCategory, getRiskColor, getRiskTextColor } from '@/lib/risk-calculator'
=======
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
>>>>>>> origin/main
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

PRIMARY ANALYSIS: ${isMenstrualOnly ? 'Hormonal Stability' : primaryRiskData.name}
Risk Category: ${primaryCategory.toUpperCase()}
Risk Score: ${isMenstrualOnly ? menstrualScore : primaryRiskData.score}/100

KEY MARKERS:
- Menarche Age: ${results.menarcheAgeGroup || results.menarcheAge || 'N/A'}
- Cycle Status: ${results.cycleLength || results.maturePeriodRegularity || results.cycleRegularity || 'N/A'}
- Family History: ${results.familyHistoryBreast ? 'Breast Cancer (Yes)' : 'Breast Cancer (No)'}, ${results.familyHistoryOvarian ? 'Ovarian Cancer (Yes)' : 'Ovarian Cancer (No)'}

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

            {/* Dynamic Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
              {config.buttons.map((btn, idx) => (
                <Button
                  key={idx}
                  variant={idx === 0 ? "default" : "secondary"}
                  className={cn(
                    "h-20 rounded-[2rem] text-lg font-black gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all",
                    idx === 0 ? "bg-primary hover:bg-primary/90 text-white shadow-primary/20" : "bg-white/80 dark:bg-white/10 dark:text-white"
                  )}
                >
                  {(btn as any).icon}
                  {(btn as any).label}
                </Button>
              ))}
            </div>
<<<<<<< HEAD
          </Card>
        )}

        {/* Assessment Details */}
        <Card className="p-8 mb-8 relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Assessment Summary</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySummary}
              className="gap-2 rounded-full border-primary/20 text-primary hover:bg-primary/5 transition-all"
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy for Doctor'}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Personal Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Age</span>
                    <span className="font-medium text-foreground">{results.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">BMI</span>
                    <span className="font-medium text-foreground">{results.bmi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Diabetes</span>
                    <span className="font-medium text-foreground">
                      {results.diabetic ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Menstrual History</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Menarche Age</span>
                    <span className="font-medium text-foreground">
                      {results.menarcheAgeGroup || results.menarcheAge || 'N/A'} {results.menarcheAge ? 'years' : ''}
                    </span>
                  </div>
                  {(results.menopauseAge || results.pmAge) && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Menopause Status</span>
                      <span className="font-medium text-foreground">
                        {results.pmAge ? `Post (${results.pmAge})` : `${results.menopauseAge} years`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cycle Status</span>
                    <span className="font-medium text-foreground">
                      {results.cycleLength || results.maturePeriodRegularity || results.cycleRegularity || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {!isMenstrualOnly && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Reproductive History</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Number of Children</span>
                      <span className="font-medium text-foreground">
                        {results.numberOfChildren}
                      </span>
                    </div>
                    {results.ageFirstBirth && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">First Birth Age</span>
                        <span className="font-medium text-foreground">
                          {results.ageFirstBirth} years
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hormone Therapy</span>
                      <span className="font-medium text-foreground">
                        {results.hormoneTherapy ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {!isMenstrualOnly && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Family History</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Breast Cancer</span>
                      <span className="font-medium text-foreground">
                        {results.familyHistoryBreast ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ovarian Cancer</span>
                      <span className="font-medium text-foreground">
                        {results.familyHistoryOvarian ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
=======
>>>>>>> origin/main
          </div>
        </Card>

        {/* Supporting Secondary Actions */}
        <div className="flex flex-col gap-6 items-center justify-center pt-8 animate-in fade-in duration-1000 delay-1000">
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
