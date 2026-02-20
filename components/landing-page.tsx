import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, Heart, Shield } from 'lucide-react'
import Link from 'next/link'

interface LandingPageProps {
  onStartAssessment: () => void
}

export default function LandingPage({ onStartAssessment }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="w-8 h-8" />
            OVIRA
            </h1>
            <p className="text-primary-foreground/80 mt-1">Health Risk Assessment</p>
          </div>

          <div>
            <Link href="/login">
              <Button size="sm" className="bg-transparent border border-primary text-primary-foreground">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          {/* Safety Disclaimer */}
          <Card className="mb-8 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/30">
            <div className="p-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
                    Important Medical Disclaimer
                  </h2>
                  <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                    This assessment tool is for educational purposes only and should not be used as a substitute for professional medical advice. Please consult with a healthcare provider for personalized risk assessment and medical recommendations.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Main Information */}
          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-3 text-balance">
                Understand Your Cancer Risk
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                OVIRA is an evidence-based health assessment tool that helps you understand your risk for ovarian, breast, and endometrial cancers based on personal and family health factors.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <Card className="p-6">
                <Shield className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Confidential</h3>
                <p className="text-sm text-muted-foreground">
                  Your health information is private and secure.
                </p>
              </Card>

              <Card className="p-6">
                <Heart className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Evidence-Based</h3>
                <p className="text-sm text-muted-foreground">
                  Assessment based on established medical research.
                </p>
              </Card>

              <Card className="p-6">
                <AlertCircle className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Informative</h3>
                <p className="text-sm text-muted-foreground">
                  Clear results to help you make informed health decisions with your doctor.
                </p>
              </Card>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={onStartAssessment}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
            >
              Start Risk Assessment
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border py-6 px-4 text-center text-sm text-muted-foreground mt-12">
        <p>
          This tool is for educational purposes only. Always consult with a healthcare provider for medical advice.
        </p>
      </footer>
    </div>
  )
}
