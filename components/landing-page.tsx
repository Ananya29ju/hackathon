import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, Heart, Shield, User, Calendar, Activity, Map, PlayCircle, LogOut, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface LandingPageProps {
  onStartAssessment: (type: 'menstrual' | 'cancer' | 'both') => void
  userName?: string
  onNavigate: (view: string) => void
}

export default function LandingPage({ onStartAssessment, userName = 'Ananya', onNavigate }: LandingPageProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return 'Good morning'
    if (hour >= 12 && hour < 17) return 'Good afternoon'
    if (hour >= 17 && hour < 21) return 'Good evening'
    return 'Good night'
  }

  const greeting = getGreeting()

  const sidebarItems = [
    { icon: User, label: 'Profile', id: 'profile' },
    { icon: Calendar, label: 'Menstrual Health', id: 'menstrual' },
    { icon: Activity, label: 'Cancer Validation', id: 'cancer' },
    { icon: Map, label: 'Heat Map', id: 'heatmap' },
    { icon: PlayCircle, label: 'Educational Videos', id: 'videos' },
    { icon: LogOut, label: 'Logout', id: 'logout' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-primary text-primary-foreground py-4 px-4 md:px-8 border-b">
          <div className="max-w-4xl mx-auto flex justify-between items-center w-full">
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                    <Menu className="w-6 h-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>My Dashboard</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {sidebarItems.map((item) => (
                    <DropdownMenuItem
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'menstrual' || item.id === 'cancer') {
                          onStartAssessment(item.id as 'menstrual' | 'cancer')
                        } else {
                          onNavigate(item.id)
                        }
                      }}
                      className={cn(
                        "flex items-center gap-3 cursor-pointer",
                        item.id === 'logout' && "text-destructive focus:text-destructive"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-3 h-3 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate text-foreground">{userName}</p>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Heart className="w-8 h-8" />
                  OVIRA
                </h1>
                <p className="text-primary-foreground/80 mt-1">Health Risk Assessment</p>
              </div>
            </div>

            <div>
              <Link href="/login">
                <Button size="sm" className="bg-transparent border border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
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

            {/* Personalized Greeting */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Hi, {greeting} <span className="text-primary">{userName}</span>!
              </h2>
              <p className="text-muted-foreground mt-1">Welcome back to your health dashboard.</p>
            </div>

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

            {/* CTA Buttons */}
            <div className="flex flex-col items-center gap-4 pt-6">
              <Button
                onClick={() => onStartAssessment('both')}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
              >
                Start Full Assessment
              </Button>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => onStartAssessment('menstrual')}
                  className="font-medium"
                >
                  Menstrual Cycle
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onStartAssessment('cancer')}
                  className="font-medium"
                >
                  Cancer Validation
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-muted/30 border-t border-border py-6 px-4 text-center text-sm text-muted-foreground mt-auto">
          <p>
            This tool is for educational purposes only. Always consult with a healthcare provider for medical advice.
          </p>
        </footer>
      </div>
    </div>
  )
}
