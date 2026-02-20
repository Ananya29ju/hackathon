'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, Heart, RotateCcw } from 'lucide-react'
import { getRiskCategory, getRiskColor, getRiskTextColor } from '@/lib/risk-calculator'

interface ResultsPageProps {
  results: any
  onRetake: () => void
}

export default function ResultsPage({ results, onRetake }: ResultsPageProps) {
  const primaryRisk = results.overallRisks.primaryRisk
  const primaryRiskData = results.overallRisks.risks[primaryRisk]
  const primaryCategory = getRiskCategory(primaryRiskData.score)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-4 md:px-8 border-b">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Heart className="w-6 h-6" />
            Your Assessment Results
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Safety Notice */}
        <Card className="mb-8 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/30">
          <div className="p-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
                  Important: Consult Your Healthcare Provider
                </h2>
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  These results are educational tools only. Please schedule an appointment with your doctor to discuss your personal risk factors and appropriate screening recommendations.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Primary Risk Alert */}
        <Card
          className={`mb-8 border-2 p-8 ${getRiskColor(primaryCategory)} border-current`}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Primary Risk Assessment</h2>
            <p className={`text-lg font-semibold mb-4 ${getRiskTextColor(primaryCategory)}`}>
              {primaryRiskData.name}
            </p>
            <div className="inline-block bg-white/50 dark:bg-black/20 rounded-lg p-6 mb-4">
              <div className={`text-5xl font-bold mb-2 ${getRiskTextColor(primaryCategory)}`}>
                {primaryRiskData.score.toFixed(0)}
              </div>
              <p className={`text-sm font-medium ${getRiskTextColor(primaryCategory)}`}>
                Risk Score (0-100)
              </p>
            </div>
            <p className={`text-base font-semibold ${getRiskTextColor(primaryCategory)}`}>
              {primaryCategory.charAt(0).toUpperCase() + primaryCategory.slice(1)} Risk
            </p>
            {primaryCategory === 'low' && (
              <p className="text-sm mt-4 text-green-700 dark:text-green-300">
                Your assessment suggests a low risk profile. Continue regular screening with your healthcare provider.
              </p>
            )}
            {primaryCategory === 'moderate' && (
              <p className="text-sm mt-4 text-amber-700 dark:text-amber-300">
                Your assessment suggests a moderate risk profile. Discuss screening options with your healthcare provider.
              </p>
            )}
            {primaryCategory === 'high' && (
              <p className="text-sm mt-4 text-red-700 dark:text-red-300">
                Your assessment suggests a high risk profile. Schedule a consultation with your healthcare provider soon.
              </p>
            )}
          </div>
        </Card>

        {/* All Three Cancer Risks */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {Object.entries(results.overallRisks.risks).map(([key, risk]: [string, any]) => {
            const category = getRiskCategory(risk.score)
            return (
              <Card
                key={key}
                className={`p-6 border-2 ${getRiskColor(category)} border-current`}
              >
                <h3 className="font-semibold text-lg mb-4">{risk.name}</h3>
                <div className="mb-4">
                  {/* Risk Score Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Risk Score
                      </span>
                      <span className={`font-bold ${getRiskTextColor(category)}`}>
                        {risk.score.toFixed(0)}/100
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${
                          category === 'low'
                            ? 'bg-green-500'
                            : category === 'moderate'
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(risk.score, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
                <p
                  className={`text-sm font-medium ${getRiskTextColor(category)}`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)} Risk
                </p>
              </Card>
            )
          })}
        </div>

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
                      {results.menarcheAge} years
                    </span>
                  </div>
                  {results.menopauseAge && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Menopause Age</span>
                      <span className="font-medium text-foreground">
                        {results.menopauseAge} years
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cycle Regularity</span>
                    <span className="font-medium text-foreground">
                      {results.cycleRegularity.charAt(0).toUpperCase() +
                        results.cycleRegularity.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
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
        <div className="flex gap-4 justify-center">
          <Button
            onClick={onRetake}
            variant="outline"
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Assessment
          </Button>
        </div>
      </div>
    </div>
  )
}
