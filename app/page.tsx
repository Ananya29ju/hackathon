'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import QuestionnaireForm from '@/components/questionnaire-form'
import ResultsPage from '@/components/results-page'
import LandingPage from '@/components/landing-page'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'questionnaire' | 'results'>('landing')
  const [results, setResults] = useState<any>(null)

  const handleStartAssessment = () => {
    setCurrentPage('questionnaire')
  }

  const handleSubmitQuestionnaire = (data: any) => {
    setResults(data)
    setCurrentPage('results')
  }

  const handleRetake = () => {
    setCurrentPage('questionnaire')
    setResults(null)
  }

  return (
    <main className="min-h-screen bg-background">
      {currentPage === 'landing' && (
        <LandingPage onStartAssessment={handleStartAssessment} />
      )}
      {currentPage === 'questionnaire' && (
        <QuestionnaireForm onSubmit={handleSubmitQuestionnaire} />
      )}
      {currentPage === 'results' && results && (
        <ResultsPage results={results} onRetake={handleRetake} />
      )}
    </main>
  )
}
