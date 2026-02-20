'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft, Shield } from 'lucide-react'
import QuestionnaireForm from '@/components/questionnaire-form'
import ResultsPage from '@/components/results-page'
import LandingPage from '@/components/landing-page'
import Header from '@/components/header'
import ProfileView from '@/components/profile-view'
import HeatMap from '@/components/heat-map'
import { useUser, signOut } from '@/lib/auth'
import supabase from '@/lib/supabaseClient'

export default function Home() {
  const { user, loading } = useUser()
  const [currentPage, setCurrentPage] = useState<'landing' | 'questionnaire' | 'results' | 'profile' | 'heatmap' | 'videos'>('landing')
  const [assessmentType, setAssessmentType] = useState<'menstrual' | 'cancer' | 'both'>('menstrual')
  const [originalAssessmentType, setOriginalAssessmentType] = useState<'menstrual' | 'cancer' | 'both'>('menstrual')
  const [lastFormData, setLastFormData] = useState<any>(null)
  const [results, setResults] = useState<any>(null)

  const handleStartAssessment = (type: 'menstrual' | 'cancer' | 'both') => {
    setOriginalAssessmentType(type)
    // Always start with menstrual if 'both' is selected
    setAssessmentType(type === 'both' ? 'menstrual' : type)
    setCurrentPage('questionnaire')
  }

  const handleSubmitQuestionnaire = async (data: any) => {
    setLastFormData(data)
    setResults({ ...data, assessmentType })
    setCurrentPage('results')

    if (user) {
      // Try to get location
      let latitude = null
      let longitude = null

      if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
              enableHighAccuracy: true
            })
          })
          latitude = position.coords.latitude
          longitude = position.coords.longitude
        } catch (geoErr) {
          console.warn('Geolocation failed or denied:', geoErr)
        }
      }

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
          primary_risk: data.overallRisks?.primaryRisk,
          latitude,
          longitude
        })
      } catch (err) {
        console.error('Error saving assessment:', err)
      }
    }
  }

  const handleContinueToCancer = () => {
    setAssessmentType('cancer')
    setCurrentPage('questionnaire')
    // We don't reset results yet, but QuestionnaireForm will start with lastFormData
  }

  const handleRetake = () => {
    setCurrentPage('landing')
    setResults(null)
    setLastFormData(null)
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

      {currentPage === 'profile' && (
        <ProfileView
          onNavigate={handleNavigate}
          onStartAssessment={handleStartAssessment}
        />
      )}

      {(currentPage === 'heatmap' || currentPage === 'videos') && (
        <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-background via-lavender-50/10 to-pink-50/10">
          <Header
            onNavigate={handleNavigate}
            onStartAssessment={handleStartAssessment}
            userName={user?.user_metadata?.name || user?.email || 'User'}
            isLoggedIn={!!user}
          />
          <div className="p-8 md:p-12 flex-1 flex flex-col items-center">
            <div className="w-full max-w-4xl space-y-8">
              <Button
                variant="ghost"
                onClick={() => setCurrentPage('landing')}
                className="group gap-2 text-muted-foreground hover:text-primary transition-colors font-bold"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </Button>

              <div className="space-y-12">
                <div className="space-y-4">
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-primary/60">
                    {currentPage === 'heatmap' ? 'Live Monitoring' : 'Coming Soon'}
                  </p>
                  <h1 className="text-5xl font-black tracking-tighter text-foreground capitalize">
                    {currentPage.replace('-', ' ')}
                  </h1>
                </div>

                {currentPage === 'heatmap' ? (
                  <HeatMap />
                ) : (
                  <Card className="p-16 md:p-24 text-center rounded-[3rem] border-none shadow-2xl shadow-primary/5 bg-white/50 dark:bg-black/40 backdrop-blur-xl border-dashed border-2 border-primary/20">
                    <div className="max-w-md mx-auto space-y-6">
                      <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto shadow-lg shadow-primary/5">
                        <Shield className="w-10 h-10 text-primary animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-foreground">Premium Experience Under Construction</h3>
                        <p className="text-muted-foreground font-medium">We're crafting a beautiful and personalized space for your {currentPage}. Stay tuned for something special.</p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'questionnaire' && (
        <QuestionnaireForm
          assessmentType={assessmentType}
          onSubmit={handleSubmitQuestionnaire}
          onNavigate={handleNavigate}
          onStartAssessment={handleStartAssessment}
          initialData={lastFormData}
          isLoggedIn={!!user}
          userName={user?.user_metadata?.name || user?.email || 'User'}
        />
      )}
      {currentPage === 'results' && results && (
        <ResultsPage
          results={results}
          onRetake={handleRetake}
          onNavigate={handleNavigate}
          onStartAssessment={handleStartAssessment}
          onContinueToCancer={handleContinueToCancer}
          showCancerPrompt={originalAssessmentType === 'both' && assessmentType === 'menstrual'}
          isLoggedIn={!!user}
          userName={user?.user_metadata?.name || user?.email || 'User'}
        />
      )}
    </main>
  )
}
