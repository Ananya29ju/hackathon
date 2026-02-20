'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, Heart, RotateCcw, Calendar, Activity, Shield } from 'lucide-react'
import { getRiskCategory, getRiskColor, getRiskTextColor } from '@/lib/risk-calculator'
import Speedometer from './ui/speedometer'
import Header from './header'

interface ResultsPageProps {
  results: any
  onRetake: () => void
  onNavigate: (view: string) => void
  onStartAssessment: (type: 'menstrual' | 'cancer' | 'both') => void
  onContinueToCancer?: () => void
  showCancerPrompt?: boolean
}

export default function ResultsPage({
  results,
  onRetake,
  onNavigate,
  onStartAssessment,
  onContinueToCancer,
  showCancerPrompt
}: ResultsPageProps) {
  const isMenstrualOnly = results.assessmentType === 'menstrual'
  const primaryRisk = results.overallRisks.primaryRisk
  const primaryRiskData = results.overallRisks.risks[primaryRisk]

  // Scoring for menstrual only
  const menstrualScore = results.menstrualRisk
  const menstrualCategory = menstrualScore < 20 ? 'low' : menstrualScore < 50 ? 'moderate' : 'high'
  const primaryCategory = isMenstrualOnly ? menstrualCategory : getRiskCategory(primaryRiskData.score)

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-lavender-50 via-background to-pink-50 dark:from-lavender-950/10 dark:to-pink-950/10">
      <Header
        onNavigate={onNavigate}
        onStartAssessment={onStartAssessment}
        showNav={true}
      />

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        {/* Safety Notice */}
        <Card className="rounded-3xl border-none bg-accent/30 backdrop-blur-sm p-6 shadow-none">
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center text-accent-foreground">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-accent-foreground uppercase tracking-widest">Medical Note</h2>
              <p className="text-sm text-foreground/70 leading-relaxed font-medium">
                These results are educational tools. Please discuss them with your doctor for a professional evaluation.
              </p>
            </div>
          </div>
        </Card>

        {/* Primary Risk/Analysis Alert */}
        <Card className="relative overflow-hidden p-10 rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 bg-white/80 dark:bg-black/40 backdrop-blur-xl">
          <div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-5 pointer-events-none">
            <Heart className="w-32 h-32 text-primary" fill="currentColor" />
          </div>

          <div className="relative text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                {isMenstrualOnly ? 'Stability Analysis' : 'Risk Assessment'}
              </h2>
              <h1 className="text-4xl font-black tracking-tighter text-foreground">
                {isMenstrualOnly ? 'Hormonal & Cycle Stability' : primaryRiskData.name}
              </h1>
            </div>

            <div className="py-2">
              <Speedometer
                value={isMenstrualOnly ? menstrualScore : primaryRiskData.score}
                riskCategory={primaryCategory}
                label={isMenstrualOnly ? 'Stability Index' : 'Risk Index'}
                size="lg"
              />
            </div>

            <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full font-bold text-lg border-2 ${getRiskColor(primaryCategory)} ${getRiskTextColor(primaryCategory)}`}>
              {primaryCategory.charAt(0).toUpperCase() + primaryCategory.slice(1)} {isMenstrualOnly ? 'Risk of Irregularity' : 'Risk Profile'}
            </div>

            <p className="max-w-lg mx-auto text-muted-foreground font-medium leading-relaxed italic">
              {primaryCategory === 'low' && (
                isMenstrualOnly
                  ? '"Your cycle indicators appear healthy and regular. Continue monitoring and following up with regular checkups."'
                  : '"Your assessment suggests a low risk profile. Continue regular screening with your healthcare provider."'
              )}
              {primaryCategory === 'moderate' && (
                isMenstrualOnly
                  ? '"There are some indicators of menstrual irregularity. Consider tracking your cycle more closely and discussing with your doctor."'
                  : '"Your assessment suggests a moderate risk profile. Discuss screening options with your healthcare provider."'
              )}
              {primaryCategory === 'high' && (
                isMenstrualOnly
                  ? '"Multiple factors suggest potential cycle health concerns. We recommend consulting with an OB-GYN for a detailed evaluation."'
                  : '"Your assessment suggests a high risk profile. Schedule a consultation with your healthcare provider soon."'
              )}
            </p>
          </div>
        </Card>

        {/* Associated Cancer Risks */}
        {!isMenstrualOnly && (
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(results.overallRisks.risks).map(([key, risk]: [string, any]) => {
              const category = getRiskCategory(risk.score)
              return (
                <Card
                  key={key}
                  className="group p-8 rounded-[2rem] border-none bg-white/50 backdrop-blur-sm dark:bg-black/20 hover:shadow-xl transition-all duration-500"
                >
                  <h3 className="font-bold text-lg mb-6 tracking-tight text-center">{risk.name}</h3>
                  <div className="mb-6 flex items-center justify-center">
                    <Speedometer
                      value={risk.score}
                      riskCategory={category}
                      size="sm"
                    />
                  </div>
                  <div className={`text-center py-2 px-4 rounded-full text-xs font-black uppercase tracking-widest border ${getRiskColor(category)} ${getRiskTextColor(category)}`}>
                    {category} Risk
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {isMenstrualOnly && (
          <Card className="p-10 rounded-[2.5rem] border-pink-100 bg-pink-50/50 dark:bg-pink-950/10 dark:border-pink-900 shadow-none">
            <h3 className="text-2xl font-black mb-8 text-pink-900 dark:text-pink-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-200 dark:bg-pink-900 flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-500" />
              </div>
              Menstrual Health Markers
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { label: 'Menarche Age', value: `${results.menarcheAgeGroup || results.menarcheAge || 'N/A'} ${results.menarcheAge ? 'yr' : ''}`, icon: Calendar },
                { label: 'Cycle Status', value: results.cycleLength || results.maturePeriodRegularity || results.cycleRegularity || 'N/A', icon: Activity },
                { label: 'Menopause', value: results.periodsStopped === 'Yes' ? `Post (${results.pmAge || '45+'})` : 'Pre-menopausal', icon: Shield }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white rounded-3xl dark:bg-black/40 border border-pink-100/50 dark:border-pink-900/20 shadow-sm group hover:scale-105 transition-transform duration-300">
                  <div className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center mb-4 text-pink-400 group-hover:bg-primary group-hover:text-white transition-colors">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-pink-600/50 dark:text-pink-400/50 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-xl font-black text-pink-900 dark:text-pink-100 italic">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Assessment Details */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Assessment Summary</h2>

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
          </div>
        </Card>

        {/* Recommendations */}
        <Card className="p-8 mb-8 border-primary/20 bg-primary/5 dark:bg-primary/10">
          <h2 className="text-2xl font-bold text-foreground mb-6">Next Steps</h2>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <div className="text-primary font-bold text-lg flex-shrink-0">1</div>
              <div>
                <p className="font-semibold text-foreground">Schedule an Appointment</p>
                <p className="text-sm text-muted-foreground">
                  Contact your healthcare provider to discuss these results and your personalized risk profile.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="text-primary font-bold text-lg flex-shrink-0">2</div>
              <div>
                <p className="font-semibold text-foreground">Discuss Screening Options</p>
                <p className="text-sm text-muted-foreground">
                  Your doctor can recommend appropriate screening tests and surveillance strategies based on your risk level.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="text-primary font-bold text-lg flex-shrink-0">3</div>
              <div>
                <p className="font-semibold text-foreground">Consider Preventive Measures</p>
                <p className="text-sm text-muted-foreground">
                  Discuss lifestyle modifications and preventive options with your healthcare team.
                </p>
              </div>
            </li>
          </ul>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {showCancerPrompt && onContinueToCancer && (
            <Button
              onClick={onContinueToCancer}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 h-auto text-lg font-bold shadow-lg hover:scale-105 transition-all"
            >
              Check with Cancer Validation →
            </Button>
          )}
          <Button
            onClick={onRetake}
            variant="outline"
            className="gap-2 h-auto py-3"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Assessment
          </Button>
        </div>
      </div>
    </div>
  )
}
