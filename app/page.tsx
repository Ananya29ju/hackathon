'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import QuestionnaireForm from '@/components/questionnaire-form'
import ResultsPage from '@/components/results-page'
import LandingPage from '@/components/landing-page'
import { useUser, signOut } from '@/lib/auth'
import supabase from '@/lib/supabaseClient'

export default function Home() {
  const { user, loading } = useUser()
  const [currentPage, setCurrentPage] = useState<'landing' | 'questionnaire' | 'results' | 'profile' | 'heatmap' | 'videos'>('landing')
  const [assessmentType, setAssessmentType] = useState<'menstrual' | 'cancer' | 'both'>('both')
  const [results, setResults] = useState<any>(null)

  const handleStartAssessment = (type: 'menstrual' | 'cancer' | 'both') => {
    setAssessmentType(type)
    setCurrentPage('questionnaire')
  }

  const handleSubmitQuestionnaire = async (data: any) => {
    setResults({ ...data, assessmentType })
    setCurrentPage('results')

    if (user) {
      try {
        await supabase.from('assessments').insert({
          user_id: user.id,
          age: parseInt(data.age),
          height: data.height ? parseFloat(data.height) : null,
          weight: data.weight ? parseFloat(data.weight) : null,
          bmi: data.bmi ? parseFloat(data.bmi) : null,
          diabetic: data.diabetic,
          menarche_age: data.menarcheAge ? parseInt(data.menarcheAge) : null,
          cycle_regularity: data.cycleRegularity,
          number_of_children: data.numberOfChildren ? parseInt(data.numberOfChildren) : 0,
          age_first_birth: data.ageFirstBirth ? parseInt(data.ageFirstBirth) : null,
          hormone_therapy: data.hormoneTherapy,
          family_history_breast: data.familyHistoryBreast,
          family_history_ovarian: data.familyHistoryOvarian,
          breast_risk_score: data.breastRisk?.score,
          ovarian_risk_score: data.ovarianRisk?.score,
          endometrial_risk_score: data.endometrialRisk?.score,
          primary_risk: data.overallRisks?.primaryRisk
        })
      } catch (err) {
        console.error('Error saving assessment:', err)
      }
    }
  }

  const handleRetake = () => {
    setCurrentPage('landing')
    setResults(null)
  }

  const handleNavigate = async (view: string) => {
    if (view === 'logout') {
      await signOut()
      window.location.reload()
      return
    }
    setCurrentPage(view as any)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {currentPage === 'landing' && (
        <LandingPage
          onStartAssessment={handleStartAssessment}
          userName={user?.user_metadata?.name || user?.email || 'User'}
          isLoggedIn={!!user}
          onNavigate={handleNavigate}
        />
      )}

      {(currentPage === 'profile' || currentPage === 'heatmap' || currentPage === 'videos') && (
        <div className="p-8">
          <Button variant="ghost" onClick={() => setCurrentPage('landing')} className="mb-6">
            ← Back to Dashboard
          </Button>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold capitalize mb-4">{currentPage.replace('-', ' ')}</h1>
            <Card className="p-12 text-center border-dashed">
              <p className="text-muted-foreground">This section for {currentPage} is currently under development.</p>
            </Card>
          </div>
        </div>
      )}

      {currentPage === 'questionnaire' && (
        <QuestionnaireForm assessmentType={assessmentType} onSubmit={handleSubmitQuestionnaire} />
      )}
      {currentPage === 'results' && results && (
        <ResultsPage results={results} onRetake={handleRetake} />
      )}
    </main>
  )
}
