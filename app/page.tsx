'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import QuestionnaireForm from '@/components/questionnaire-form'
import ResultsPage from '@/components/results-page'
import LandingPage from '@/components/landing-page'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'questionnaire' | 'results' | 'profile' | 'heatmap' | 'videos'>('landing')
  const [assessmentType, setAssessmentType] = useState<'menstrual' | 'cancer' | 'both'>('both')
  const [results, setResults] = useState<any>(null)
  const [user] = useState({ name: 'Ananya' })

  const handleStartAssessment = (type: 'menstrual' | 'cancer' | 'both') => {
    setAssessmentType(type)
    setCurrentPage('questionnaire')
  }

  const handleSubmitQuestionnaire = (data: any) => {
    setResults({ ...data, assessmentType })
    setCurrentPage('results')
  }

  const handleRetake = () => {
    setCurrentPage('landing')
    setResults(null)
  }

  const handleNavigate = (view: string) => {
    if (view === 'logout') {
      window.location.reload() // Simple logout simulation
      return
    }
    setCurrentPage(view as any)
  }

  return (
    <main className="min-h-screen bg-background">
      {currentPage === 'landing' && (
        <LandingPage
          onStartAssessment={handleStartAssessment}
          userName={user.name}
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
