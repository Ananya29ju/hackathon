'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  calculateMenstrualRisk,
  calculateBreastCancerRisk,
  calculateOvarianCancerRisk,
  calculateEndometrialCancerRisk,
  calculateOverallRisks,
  calculateYoungMenstrualRisk,
  calculateMatureMenstrualRisk,
  calculatePostMenopausalRisk,
} from '@/lib/risk-calculator'
import Header from './header'

const CANCER_QUESTIONS = [
  {
    id: 'breastChange',
    label: '1. Breast lump or change in shape?',
    options: ['No', 'Not sure', 'Yes, small change', 'Yes, clear lump/change']
  },
  {
    id: 'nippleDischarge',
    label: '2. Nipple discharge, pain, or skin change?',
    options: ['No', 'Mild', 'Sometimes', 'Persistent/abnormal']
  },
  {
    id: 'abnormalBleeding',
    label: '3. Abnormal vaginal bleeding (between periods / after menopause)?',
    options: ['No', 'Once', 'Occasionally', 'Frequent']
  },
  {
    id: 'pelvicPain',
    label: '4. Persistent pelvic or lower abdominal pain?',
    options: ['No', 'Mild', 'Often', 'Severe/persistent']
  },
  {
    id: 'weightLossFatigue',
    label: '5. Unexplained weight loss or long‑term fatigue?',
    options: ['No', 'Mild', 'Noticeable', 'Significant']
  },
  {
    id: 'bloatingSwelling',
    label: '6. Frequent bloating or abdominal swelling?',
    options: ['No', 'Sometimes', 'Often', 'Persistent']
  },
  {
    id: 'familyHistoryCancer',
    label: '7. Family history of breast/ovarian/uterine cancer?',
    options: ['No', 'Distant relative', 'Close family member', 'Multiple cases']
  },
  {
    id: 'hormonalHistory',
    label: '8. History of irregular periods / PCOS / hormonal issues?',
    options: ['No', 'Mild', 'Diagnosed', 'Long‑term/severe']
  },
  {
    id: 'pastReproductiveIssues',
    label: '9. Past ovarian cysts, fibroids, abnormal scan/Pap?',
    options: ['No', 'Once', 'Recurrent', 'Serious/treated']
  },
  {
    id: 'symptomDuration',
    label: '10. Duration of symptoms?',
    options: ['None', 'Few weeks', 'Few months', 'Long‑term']
  }
]

const MENSTRUAL_QUESTIONS_YOUNG = [
  { id: 'menarcheAgeGroup', label: '1. At what age did your periods start?', options: ['Below 10', '10–12', '13–15', 'Above 15', 'Not started yet'] },
  { id: 'cycleLength', label: '2. Typical length of your menstrual cycle?', options: ['21–35 days (regular)', 'Less than 21 days', 'More than 35 days', 'Irregular / varies every month'] },
  { id: 'periodRegularity', label: '3. Are your periods regular?', options: ['Yes, every month', 'Sometimes delayed', 'Often irregular', 'Frequently missed'] },
  { id: 'bleedingDuration', label: '4. How many days does your period usually last?', options: ['2–3 days', '4–5 days (normal)', '6–7 days', 'More than 7 days'] },
  { id: 'bleedingHeaviness', label: '5. Describe your bleeding flow:', options: ['Light', 'Normal', 'Heavy', 'Very heavy with clots'] },
  { id: 'crampsSeverity', label: '6. How severe are your period cramps?', options: ['No pain', 'Mild pain', 'Moderate pain', 'Severe pain affecting routine'] },
  { id: 'weightGain', label: '7. Noticeable weight gain or hair growth?', options: ['No', 'Slight', 'Moderate', 'Significant'] },
  { id: 'facialHairAcne', label: '8. Facial hair or persistent acne?', options: ['No', 'Mild', 'Moderate', 'Severe'] },
  { id: 'missedPeriodsLong', label: '9. Frequently missed periods for several months?', options: ['Never', 'Rarely', 'Sometimes', 'Frequently'] },
  { id: 'pcodPcosDiagnosis', label: '10. PCOD/PCOS diagnosis?', options: ['No', 'Suspected but not confirmed', 'Yes, mild', 'Yes, diagnosed'] }
]

const MENSTRUAL_QUESTIONS_MATURE = [
  { id: 'maturePeriodRegularity', label: '1. Are your periods coming regularly every month?', options: ['Yes, very regular', 'Slightly irregular', 'Often irregular', 'Frequently missed'] },
  { id: 'matureCycleLength', label: '2. Is your cycle usually between 21–35 days?', options: ['Yes', 'Less than 21 days', 'More than 35 days', 'Not sure'] },
  { id: 'matureHeavyBleeding', label: '3. Do you experience very heavy bleeding?', options: ['No', 'Sometimes', 'Often', 'Very heavy with clots'] },
  { id: 'matureDuration', label: '4. Do your periods last more than 7 days?', options: ['No (2–5 days)', '6–7 days', '8–10 days', 'More than 10 days'] },
  { id: 'matureMissedPeriods', label: '5. Do you often miss periods for 2 months or more?', options: ['Never', 'Rarely', 'Sometimes', 'Frequently'] },
  { id: 'maturePain', label: '6. Do you experience severe menstrual pain?', options: ['No pain', 'Mild pain', 'Moderate pain', 'Severe pain affecting routine'] },
  { id: 'matureWeightGain', label: '7. Have you noticed unusual weight gain?', options: ['No', 'Slight', 'Moderate', 'Significant'] },
  { id: 'matureHairAcne', label: '8. Do you have excessive hair growth or severe acne?', options: ['No', 'Mild', 'Moderate', 'Severe'] },
  { id: 'maturePcod', label: '9. Have you been diagnosed with PCOD/PCOS?', options: ['No', 'Suspected', 'Yes (mild)', 'Yes (diagnosed)'] },
  { id: 'matureFamilyHistory', label: '10. Family history of breast/ovarian/uterine cancer?', options: ['No', 'Yes (distant relative)', 'Yes (close family member)', 'Not sure'] }
]

const MENSTRUAL_QUESTIONS_POST = [
  { id: 'pmAge', label: '1. At what age did your periods completely stop?', options: ['Below 45', '45–50', '51–55', 'Above 55'] },
  { id: 'pmBleeding', label: '2. Have you had any vaginal bleeding or spotting after menopause?', options: ['Never', 'Once', 'Occasionally', 'More than once'] },
  { id: 'pmPreRegularity', label: '3. Before menopause, were your periods mostly irregular?', options: ['No', 'Slightly irregular', 'Mostly irregular', 'Frequently missed'] },
  { id: 'pmPreHeavyBleeding', label: '4. Did you experience very heavy bleeding before menopause?', options: ['No', 'Sometimes', 'Often', 'Very heavy with clots'] },
  { id: 'pmPelvicPain', label: '5. Do you currently feel persistent pelvic pain or pressure?', options: ['Never', 'Occasionally', 'Often', 'Persistent/severe'] },
  { id: 'pmHrtUsage', label: '6. Have you used hormone replacement therapy (HRT)?', options: ['Never', 'Less than 1 year', '1–5 years', 'More than 5 years'] },
  { id: 'pmChronicConditions', label: '7. Do you have diabetes, obesity, or high blood pressure?', options: ['None', 'One condition', 'Two conditions', 'More than two'] },
  { id: 'pmWeightLossFatigue', label: '8. Have you noticed unexplained weight loss or extreme fatigue recently?', options: ['No', 'Mild', 'Moderate', 'Significant'] },
  { id: 'pmReproductiveDiagnoses', label: '9. Have you ever been diagnosed with uterine fibroids, ovarian cysts, or endometrial thickening?', options: ['No', 'Suspected', 'Yes (past)', 'Yes (currently)'] },
  { id: 'pmFamilyHistory', label: '10. Family history of breast/ovarian/uterine cancer?', options: ['No', 'Yes (distant relative)', 'Yes (close family member)', 'Not sure'] }
]

interface QuestionnaireFormProps {
  onSubmit: (data: any) => void
  assessmentType: 'menstrual' | 'cancer' | 'both'
  onNavigate: (view: string) => void
  onStartAssessment: (type: 'menstrual' | 'cancer' | 'both') => void
  initialData?: any
  isLoggedIn?: boolean
  userName?: string
}

export default function QuestionnaireForm({
  onSubmit,
  assessmentType,
  onNavigate,
  onStartAssessment,
  initialData,
  isLoggedIn = false,
  userName = 'User'
}: QuestionnaireFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState(initialData || {
    age: '',
    height: '165',
    weight: '60',
    menstrualStage: '',
    periodsStopped: '',
    breastChange: '',
    nippleDischarge: '',
    abnormalBleeding: '',
    pelvicPain: '',
    weightLossFatigue: '',
    bloatingSwelling: '',
    familyHistoryCancer: '',
    hormonalHistory: '',
    pastReproductiveIssues: '',
    symptomDuration: '',
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [step])

  // Reset step to 1 whenever assessmentType changes (via dashboard clicks)
  useEffect(() => {
    setStep(1)
  }, [assessmentType])

  const isMenstrual = assessmentType === 'menstrual' || assessmentType === 'both'
  const isCancer = assessmentType === 'cancer' || assessmentType === 'both'

  const ageVal = parseInt(formData.age) || 0
  const isUnder40 = ageVal > 0 && ageVal < 40
  const isOver40 = ageVal >= 40

  const getMenstrualQuestions = () => {
    if (isUnder40) return MENSTRUAL_QUESTIONS_YOUNG
    if (isOver40) {
      if (formData.periodsStopped === 'Yes') return MENSTRUAL_QUESTIONS_POST
      if (formData.periodsStopped === 'No') return MENSTRUAL_QUESTIONS_MATURE
    }
    return []
  }

  const menstrualQuestions = getMenstrualQuestions()
  const menstrualSteps = isMenstrual ? (isOver40 ? 3 : 2) : 0
  const totalSteps = 1 + menstrualSteps + (isCancer ? 2 : 0)

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const calculateBMI = () => {
    if (!formData.height || !formData.weight) return null
    const heightM = parseFloat(formData.height) / 100
    const bmi = parseFloat(formData.weight) / (heightM * heightM)
    return bmi
  }

  const getBMICategory = () => {
    const bmi = calculateBMI()
    if (bmi == null || isNaN(bmi)) return null
    if (bmi < 18.5) return 'underweight'
    if (bmi < 25) return 'normal'
    if (bmi < 30) return 'overweight'
    return 'obese'
  }

  const handleSubmit = () => {
    let mRisk = 0
    if (isMenstrual) {
      if (isUnder40) mRisk = calculateYoungMenstrualRisk(formData)
      else if (isOver40) {
        if (formData.periodsStopped === 'No') mRisk = calculateMatureMenstrualRisk(formData)
        else mRisk = calculatePostMenopausalRisk(formData)
      }
    }

    const breastRisk = calculateBreastCancerRisk({
      familyHistoryBreast: formData.familyHistoryCancer === 'Close family member' || formData.familyHistoryCancer === 'Multiple cases',
      familyHistoryOvarian: formData.familyHistoryCancer === 'Multiple cases',
      nulliparity: false,
      lateFirstBirth: false,
      age: ageVal || 25,
      bmiCategory: (getBMICategory() as any) || 'normal',
      breastChange: formData.breastChange,
      nippleDischarge: formData.nippleDischarge,
      familyHistoryCancer: formData.familyHistoryCancer,
    })

    const ovarianRisk = calculateOvarianCancerRisk({
      familyHistoryOvarian: formData.familyHistoryCancer === 'Close family member' || formData.familyHistoryCancer === 'Multiple cases',
      familyHistoryBreast: formData.familyHistoryCancer === 'Multiple cases',
      nulliparity: false,
      age: ageVal || 25,
      hormoneTherapy: formData.hormonalHistory === 'Diagnosed' || formData.hormonalHistory === 'Long‑term/severe',
      irregularMenses: formData.hormonalHistory !== 'No' && formData.hormonalHistory !== '',
      bloatingSwelling: formData.bloatingSwelling,
      pelvicPain: formData.pelvicPain,
      weightLossFatigue: formData.weightLossFatigue,
      pastReproductiveIssues: formData.pastReproductiveIssues,
    })

    const endometrialRisk = calculateEndometrialCancerRisk({
      age: ageVal || 25,
      bmiCategory: (getBMICategory() as any) || 'normal',
      diabetic: false,
      nulliparity: false,
      irregularMenses: formData.hormonalHistory !== 'No' && formData.hormonalHistory !== '',
      abnormalBleeding: formData.abnormalBleeding,
      pelvicPain: formData.pelvicPain,
      hormonalHistory: formData.hormonalHistory,
    })

    const overallRisks = calculateOverallRisks(mRisk, breastRisk, ovarianRisk, endometrialRisk)

    onSubmit({
      ...formData,
      menstrualRisk: mRisk,
      breastRisk: breastRisk.score,
      ovarianRisk: ovarianRisk.score,
      endometrialRisk: endometrialRisk.score,
      overallRisks,
      bmi: calculateBMI(),
      assessmentType: assessmentType === 'both' ? 'both' : (isCancer ? 'cancer' : 'menstrual')
    })
  }

  const canProceed = () => {
    if (step === 1) return !!formData.age && ageVal >= 8

    if (isMenstrual && step > 1 && step <= (1 + menstrualSteps)) {
      const menstrualSubStep = step - 1
      if (isUnder40) {
        if (menstrualSubStep === 1) return menstrualQuestions.slice(0, 5).every(q => !!(formData as any)[q.id])
        if (menstrualSubStep === 2) return menstrualQuestions.slice(5).every(q => !!(formData as any)[q.id])
      } else if (isOver40) {
        if (menstrualSubStep === 1) return !!formData.periodsStopped
        if (menstrualSubStep === 2) return menstrualQuestions.slice(0, 5).every(q => !!(formData as any)[q.id])
        if (menstrualSubStep === 3) return menstrualQuestions.slice(5).every(q => !!(formData as any)[q.id])
      } else {
        // If age is typed but invalid somehow (e.g. 0)
        return false
      }
    }

    const cancerStepBase = 1 + menstrualSteps
    if (isCancer && step > cancerStepBase) {
      const cancerSubStep = step - cancerStepBase
      if (cancerSubStep === 1) return CANCER_QUESTIONS.slice(0, 5).every(q => !!(formData as any)[q.id])
      if (cancerSubStep === 2) return CANCER_QUESTIONS.slice(5).every(q => !!(formData as any)[q.id])
    }
    return false
  }

  const renderQuestion = (q: { id: string; label: string; options: string[] }) => (
    <div key={q.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Label className="text-lg font-bold text-foreground/80 leading-tight block">{q.label}</Label>
      <RadioGroup
        value={(formData as any)[q.id]}
        onValueChange={(value) => handleInputChange(q.id, value)}
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        {q.options.map((option) => {
          const isSelected = (formData as any)[q.id] === option;
          return (
            <div
              key={option}
              className={cn(
                "flex items-center space-x-3 rounded-2xl p-4 border-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md",
                isSelected
                  ? "border-primary bg-primary/5 shadow-primary/10"
                  : "border-muted/40 hover:border-primary/20 hover:bg-muted/30"
              )}
              onClick={() => handleInputChange(q.id, option)}
            >
              <RadioGroupItem value={option} id={`${q.id}-${option}`} className="w-5 h-5 border-2 border-primary/40 data-[state=checked]:border-primary" />
              <Label htmlFor={`${q.id}-${option}`} className="font-semibold text-sm cursor-pointer flex-1 py-1">
                {option}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  )

  const menstrualActive = isMenstrual && step > 1 && step <= (1 + menstrualSteps)
  const cancerActive = isCancer && step > (1 + menstrualSteps)

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-background via-lavender-50/10 to-pink-50/10 selection:bg-primary/20">
      <Header
        onNavigate={onNavigate}
        onStartAssessment={onStartAssessment}
        showNav={true}
        isLoggedIn={isLoggedIn}
        userName={userName}
      />
      <div className="flex-1 flex flex-col items-center p-6 md:p-12">
        <div className="w-full max-w-2xl space-y-10">
          {/* Progress Header */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-primary/60">Step {step} of {totalSteps}</p>
                <h1 className="text-4xl font-black tracking-tighter text-foreground">
                  {assessmentType === 'menstrual'
                    ? 'Cycle Health'
                    : assessmentType === 'cancer'
                      ? 'SheShield Screening'
                      : 'Full Health Review'
                  }
                </h1>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black text-primary/10 select-none tabular-nums">{Math.round((step / totalSteps) * 100)}%</span>
              </div>
            </div>

            <div className="h-3 w-full bg-muted/40 rounded-full overflow-hidden flex gap-1 p-0.5 shadow-inner">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-full rounded-full transition-all duration-700 ease-in-out",
                    i < step ? "bg-primary flex-[2] shadow-[0_0_15px_rgba(var(--primary),0.3)]" : "bg-muted-foreground/10 flex-1"
                  )}
                />
              ))}
            </div>
          </div>

          <Card className="p-8 md:p-12 rounded-[3rem] border-none shadow-2xl shadow-primary/5 bg-white/90 dark:bg-black/60 backdrop-blur-2xl animate-in zoom-in-95 duration-500">
            {step === 1 && (
              <div className="space-y-10">
                <div className="space-y-8 text-center md:text-left">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-foreground/80 tracking-tight">Basic Information</h2>
                    <p className="text-muted-foreground font-medium italic">Your age helps define the most relevant health questions.</p>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-lg font-bold text-foreground/70 block">How old are you?</Label>
                    <Input
                      type="number"
                      min="8"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className={cn(
                        "h-16 rounded-[1.5rem] border-2 px-6 text-xl font-bold transition-all",
                        formData.age && ageVal < 8
                          ? "border-rose-400 bg-rose-50/50 text-rose-600 focus:border-rose-500"
                          : "border-muted/30 focus:border-primary"
                      )}
                      placeholder="e.g. 42"
                      autoFocus
                    />
                    {formData.age && ageVal < 8 && (
                      <p className="text-rose-500 text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                        <Shield className="w-4 h-4" />
                        Please enter an age of 8 or above
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {menstrualActive && (
              <div className="space-y-10">
                {isUnder40 && (
                  <div className="space-y-10">
                    <h2 className="text-3xl font-black text-foreground/80 tracking-tight">{step === 2 ? 'Cycle Analysis' : 'Hormonal Indicators'}</h2>
                    <div className="space-y-10">
                      {(step - 1) === 1
                        ? menstrualQuestions.slice(0, 5).map((q) => renderQuestion(q))
                        : menstrualQuestions.slice(5).map((q) => renderQuestion(q))
                      }
                    </div>
                  </div>
                )}
                {isOver40 && (
                  <div className="space-y-10">
                    {(step - 1) === 1 && (
                      <div className="space-y-10">
                        <h2 className="text-3xl font-black text-foreground/80 tracking-tight">Period Status</h2>
                        {renderQuestion({
                          id: 'periodsStopped',
                          label: 'Has the periods completely stopped?',
                          options: ['Yes', 'No']
                        })}
                      </div>
                    )}
                    {(step - 1) > 1 && (
                      <div className="space-y-10">
                        <h2 className="text-3xl font-black text-foreground/80 tracking-tight">{(step - 1) === 2 ? 'Cycle Analysis' : 'Hormonal Indicators'}</h2>
                        <div className="space-y-10">
                          {(step - 1) === 2
                            ? menstrualQuestions.slice(0, 5).map((q) => renderQuestion(q))
                            : menstrualQuestions.slice(5).map((q) => renderQuestion(q))
                          }
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {cancerActive && (
              <div className="space-y-10">
                <h2 className="text-3xl font-black text-foreground/80 tracking-tight">{(step - 1 - menstrualSteps) === 1 ? 'Clinical Symptoms' : 'Personal Patterns'}</h2>
                <div className="space-y-10">
                  {(step - 1 - menstrualSteps) === 1
                    ? CANCER_QUESTIONS.slice(0, 5).map((q) => renderQuestion(q))
                    : CANCER_QUESTIONS.slice(5).map((q) => renderQuestion(q))
                  }
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-12 pt-8 border-t-2 border-primary/10">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={step === 1}
                className="h-14 px-8 rounded-2xl gap-2 font-bold hover:bg-primary/5 text-muted-foreground transition-all disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </Button>
              <div className="flex-1" />
              {step < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="h-14 px-10 rounded-2xl gap-2 bg-primary hover:bg-primary/90 text-white font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="h-14 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                  id="submit-assessment"
                >
                  Analyze My Results
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
