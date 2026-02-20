'use client'

import { useState } from 'react'
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

const MENSTRUAL_QUESTIONS_MATURE = [
  {
    id: 'maturePeriodRegularity',
    label: '1. Are your periods coming regularly every month?',
    options: ['Yes, very regular', 'Slightly irregular', 'Often irregular', 'Frequently missed']
  },
  {
    id: 'matureCycleLength',
    label: '2. Is your cycle usually between 21–35 days?',
    options: ['Yes', 'Less than 21 days', 'More than 35 days', 'Not sure']
  },
  {
    id: 'matureHeavyBleeding',
    label: '3. Do you experience very heavy bleeding?',
    options: ['No', 'Sometimes', 'Often', 'Very heavy with clots']
  },
  {
    id: 'matureDuration',
    label: '4. Do your periods last more than 7 days?',
    options: ['No (2–5 days)', '6–7 days', '8–10 days', 'More than 10 days']
  },
  {
    id: 'matureMissedPeriods',
    label: '5. Do you often miss periods for 2 months or more?',
    options: ['Never', 'Rarely', 'Sometimes', 'Frequently']
  },
  {
    id: 'maturePain',
    label: '6. Do you experience severe menstrual pain?',
    options: ['No pain', 'Mild pain', 'Moderate pain', 'Severe pain affecting routine']
  },
  {
    id: 'matureWeightGain',
    label: '7. Have you noticed unusual weight gain?',
    options: ['No', 'Slight', 'Moderate', 'Significant']
  },
  {
    id: 'matureHairAcne',
    label: '8. Do you have excessive hair growth or severe acne?',
    options: ['No', 'Mild', 'Moderate', 'Severe']
  },
  {
    id: 'maturePcod',
    label: '9. Have you been diagnosed with PCOD/PCOS?',
    options: ['No', 'Suspected', 'Yes (mild)', 'Yes (diagnosed)']
  },
  {
    id: 'matureFamilyHistory',
    label: '10. Family history of breast/ovarian/uterine cancer?',
    options: ['No', 'Yes (distant relative)', 'Yes (close family member)', 'Not sure']
  }
]

const MENSTRUAL_QUESTIONS_POST_MENOPAUSAL = [
  {
    id: 'pmAge',
    label: '1. At what age did your periods completely stop?',
    options: ['Below 45', '45–50', '51–55', 'Above 55']
  },
  {
    id: 'pmBleeding',
    label: '2. Have you had any vaginal bleeding or spotting after menopause?',
    options: ['Never', 'Once', 'Occasionally', 'More than once']
  },
  {
    id: 'pmPreRegularity',
    label: '3. Before menopause, were your periods mostly irregular?',
    options: ['No', 'Slightly irregular', 'Mostly irregular', 'Frequently missed']
  },
  {
    id: 'pmPreHeavyBleeding',
    label: '4. Did you experience very heavy bleeding before menopause?',
    options: ['No', 'Sometimes', 'Often', 'Very heavy with clots']
  },
  {
    id: 'pmPelvicPain',
    label: '5. Do you currently feel persistent pelvic pain or pressure?',
    options: ['Never', 'Occasionally', 'Often', 'Persistent/severe']
  },
  {
    id: 'pmHrtUsage',
    label: '6. Have you used hormone replacement therapy (HRT)?',
    options: ['Never', 'Less than 1 year', '1–5 years', 'More than 5 years']
  },
  {
    id: 'pmChronicConditions',
    label: '7. Do you have diabetes, obesity, or high blood pressure?',
    options: ['None', 'One condition', 'Two conditions', 'More than two']
  },
  {
    id: 'pmWeightLossFatigue',
    label: '8. Have you noticed unexplained weight loss or extreme fatigue recently?',
    options: ['No', 'Mild', 'Moderate', 'Significant']
  },
  {
    id: 'pmReproductiveDiagnoses',
    label: '9. Have you ever been diagnosed with uterine fibroids, ovarian cysts, or endometrial thickening?',
    options: ['No', 'Suspected', 'Yes (past)', 'Yes (currently)']
  },
  {
    id: 'pmFamilyHistory',
    label: '10. Family history of breast/ovarian/uterine cancer?',
    options: ['No', 'Yes (distant relative)', 'Yes (close family member)', 'Not sure']
  }
]

const MENSTRUAL_QUESTIONS_YOUNG = [
  {
    id: 'menarcheAgeGroup',
    label: '1. At what age did your periods start?',
    options: ['Below 10', '10–12', '13–15', 'Above 15', 'Not started yet']
  },
  {
    id: 'cycleLength',
    label: '2. How long is your menstrual cycle?',
    options: ['21–35 days (regular)', 'Less than 21 days', 'More than 35 days', 'Irregular / varies every month']
  },
  {
    id: 'periodRegularity',
    label: '3. Are your periods regular?',
    options: ['Yes, every month', 'Sometimes delayed', 'Often irregular', 'Frequently missed']
  },
  {
    id: 'bleedingDuration',
    label: '4. How many days does bleeding last?',
    options: ['2–3 days', '4–5 days (normal)', '6–7 days', 'More than 7 days']
  },
  {
    id: 'bleedingHeaviness',
    label: '5. How heavy is your bleeding?',
    options: ['Light', 'Normal', 'Heavy', 'Very heavy with clots']
  },
  {
    id: 'crampsSeverity',
    label: '6. Do you experience severe cramps or symptoms?',
    options: ['No pain', 'Mild pain', 'Moderate pain', 'Severe pain affecting routine']
  },
  {
    id: 'weightGain',
    label: '7. Have you noticed weight gain or difficulty losing weight?',
    options: ['No', 'Slight', 'Moderate', 'Significant']
  },
  {
    id: 'facialHairAcne',
    label: '8. Do you have excess facial/body hair or severe acne?',
    options: ['No', 'Mild', 'Moderate', 'Severe']
  },
  {
    id: 'missedPeriodsLong',
    label: '9. Do you miss periods for 2–3 months or more?',
    options: ['Never', 'Rarely', 'Sometimes', 'Frequently']
  },
  {
    id: 'pcodPcosDiagnosis',
    label: '10. Have you been diagnosed with PCOD/PCOS before?',
    options: ['No', 'Suspected but not confirmed', 'Yes, mild', 'Yes, diagnosed']
  }
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
    // Demographics
    age: '',
    // Menstrual History
    menarcheAge: '',
    menopauseAge: '',
    cycleRegularity: 'regular',
    // Detailed Menstrual (8-40)
    menarcheAgeGroup: '',
    cycleLength: '',
    periodRegularity: '',
    bleedingDuration: '',
    bleedingHeaviness: '',
    crampsSeverity: '',
    weightGain: '',
    facialHairAcne: '',
    missedPeriodsLong: '',
    pcodPcosDiagnosis: '',
    // Mature Menstrual (40+)
    periodsStopped: '',
    maturePeriodRegularity: '',
    matureCycleLength: '',
    matureHeavyBleeding: '',
    matureDuration: '',
    matureMissedPeriods: '',
    maturePain: '',
    matureWeightGain: '',
    matureHairAcne: '',
    maturePcod: '',
    matureFamilyHistory: '',
    // Post-Menopausal (40+ & Periods Stopped)
    pmAge: '',
    pmBleeding: '',
    pmPreRegularity: '',
    pmPreHeavyBleeding: '',
    pmPelvicPain: '',
    pmHrtUsage: '',
    pmChronicConditions: '',
    pmWeightLossFatigue: '',
    pmReproductiveDiagnoses: '',
    pmFamilyHistory: '',
    // Medical History
    diabetic: false,
    // BMI
    height: '',
    weight: '',
    // Reproductive History
    numberOfChildren: '0',
    ageFirstBirth: '',
    // Family History
    familyHistoryBreast: false,
    familyHistoryOvarian: false,
    // Hormone Therapy
    hormoneTherapy: false,
  })

  const ageNum = parseInt(formData.age) || 0
  const isMenstrual = assessmentType === 'menstrual'
  const isCancer = assessmentType === 'cancer'

  const isYoungFlow = isMenstrual && ageNum >= 8 && ageNum <= 40
  const isMatureFlow = isMenstrual && ageNum > 40
  const periodsStopped = formData.periodsStopped === 'Yes'
  const periodsNotStopped = formData.periodsStopped === 'No'
  const isMatureActiveFlow = isMatureFlow && periodsNotStopped
  const isPostMenopausalFlow = isMatureFlow && periodsStopped

  // Step counts for the menstrual portion
  const menstrualStepCount = isYoungFlow
    ? 4
    : isMatureFlow
      ? (isMatureActiveFlow || isPostMenopausalFlow ? 5 : 2)
      : 2

  const totalSteps = isMenstrual ? menstrualStepCount : 5

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

  const getBMIStatus = () => {
    const category = getBMICategory()
    if (!category) return null
    switch (category) {
      case 'underweight':
        return { label: 'Underweight ', className: 'text-red-700 bg-red-100' }
      case 'normal':
        return { label: 'Normal', className: 'text-green-700 bg-green-100' }
      case 'overweight':
        return { label: 'Overweight', className: 'text-orange-700 bg-orange-100' }
      case 'obese':
        return { label: 'Obese', className: 'text-red-800 bg-red-200' }
      default:
        return null
    }
  }

  const handleSubmit = () => {
    let menstrualRisk = 0

    if (isYoungFlow) {
      menstrualRisk = calculateYoungMenstrualRisk(formData)
    } else if (isMatureActiveFlow) {
      menstrualRisk = calculateMatureMenstrualRisk(formData)
    } else if (isPostMenopausalFlow) {
      menstrualRisk = calculatePostMenopausalRisk(formData)
    } else {
      menstrualRisk = calculateMenstrualRisk(
        parseInt(formData.menarcheAge) || 0,
        formData.menopauseAge ? parseInt(formData.menopauseAge) : null,
        formData.cycleRegularity as 'regular' | 'irregular'
      )
    }

    const breastRisk = calculateBreastCancerRisk({
      familyHistoryBreast: formData.familyHistoryBreast,
      familyHistoryOvarian: formData.familyHistoryOvarian,
      nulliparity: parseInt(formData.numberOfChildren) === 0,
      lateFirstBirth:
        parseInt(formData.numberOfChildren) > 0 && parseInt(formData.ageFirstBirth) >= 30,
      age: ageNum,
      bmiCategory: getBMICategory() as 'normal' | 'overweight' | 'obese',
    })

    const isIrregular = isYoungFlow
      ? (formData.periodRegularity === 'Often irregular' || formData.periodRegularity === 'Frequently missed')
      : isMatureActiveFlow
        ? (formData.maturePeriodRegularity === 'Often irregular' || formData.maturePeriodRegularity === 'Frequently missed')
        : isPostMenopausalFlow
          ? (formData.pmPreRegularity === 'Mostly irregular' || formData.pmPreRegularity === 'Frequently missed')
          : (formData.cycleRegularity === 'irregular')

    const ovarianRisk = calculateOvarianCancerRisk({
      familyHistoryOvarian: formData.familyHistoryOvarian,
      familyHistoryBreast: formData.familyHistoryBreast,
      nulliparity: parseInt(formData.numberOfChildren) === 0,
      age: ageNum,
      hormoneTherapy: formData.hormoneTherapy,
      irregularMenses: isIrregular,
    })

    const endometrialRisk = calculateEndometrialCancerRisk({
      age: ageNum,
      bmiCategory: getBMICategory() as 'normal' | 'overweight' | 'obese',
      diabetic: formData.diabetic,
      nulliparity: parseInt(formData.numberOfChildren) === 0,
      irregularMenses: isIrregular,
    })

    const overallRisks = calculateOverallRisks(menstrualRisk, breastRisk, ovarianRisk, endometrialRisk)

    onSubmit({
      ...formData,
      menstrualRisk,
      breastRisk,
      ovarianRisk,
      endometrialRisk,
      overallRisks,
      isYoungFlow,
      bmi: calculateBMI()?.toFixed(1),
    })
  }

  const canProceed = () => {
    // Phase 1: Demographics
    if (step === 1) return formData.age && parseInt(formData.age) >= 8

    // Unified flow per assessment module
    if (isMenstrual) {
      if (step === 2) {
        if (isYoungFlow) return !!(formData.menarcheAgeGroup && formData.cycleLength && formData.periodRegularity)
        if (isMatureFlow) return !!formData.periodsStopped
        return !!(formData.menarcheAge && formData.cycleRegularity)
      }
      if (step === 3) {
        if (isYoungFlow) return !!(formData.bleedingDuration && formData.bleedingHeaviness && formData.crampsSeverity)
        if (isMatureActiveFlow) return !!(formData.maturePeriodRegularity && formData.matureCycleLength && formData.matureHeavyBleeding)
        if (isPostMenopausalFlow) return !!(formData.pmAge && formData.pmBleeding && formData.pmPreRegularity)
      }
      if (step === 4) {
        if (isYoungFlow) return !!(formData.weightGain && formData.facialHairAcne && formData.missedPeriodsLong && formData.pcodPcosDiagnosis)
        if (isMatureActiveFlow) return !!(formData.matureDuration && formData.matureMissedPeriods && formData.maturePain)
        if (isPostMenopausalFlow) return !!(formData.pmPreHeavyBleeding && formData.pmPelvicPain && formData.pmHrtUsage)
      }
      if (step === 5) {
        if (isMatureActiveFlow) return !!(formData.matureWeightGain && formData.matureHairAcne && formData.maturePcod && formData.matureFamilyHistory)
        if (isPostMenopausalFlow) return !!(formData.pmChronicConditions && formData.pmWeightLossFatigue && formData.pmReproductiveDiagnoses && formData.pmFamilyHistory)
      }
      return true
    }

    if (isCancer) {
      if (step === 2) return true // Title step or just next
      if (step === 3) return !!(formData.height && formData.weight)
      if (step === 4) return formData.numberOfChildren !== ''
      if (step === 5) return true
    }

    return false
  }

  const renderQuestion = (q: typeof MENSTRUAL_QUESTIONS_YOUNG[0]) => (
    <div key={q.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Label className="text-lg font-bold text-foreground/80 leading-tight block">{q.label}</Label>
      <RadioGroup
        value={(formData as any)[q.id]}
        onValueChange={(value) => handleInputChange(q.id, value)}
        className="grid grid-cols-1 gap-3"
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

  const renderCustomQuestion = (q: { id: string; label: string; options: string[] }) => (
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
                      ? 'Cancer Check'
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
            {/* Step 1: Demographics */}
            {step === 1 && (
              <div className="space-y-10">
                <div className="space-y-8 text-center md:text-left">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-foreground/80 tracking-tight">Tell us about you</h2>
                    <p className="text-muted-foreground font-medium italic">We use your age to tailor the assessment questions.</p>
                  </div>

                  <div className="space-y-4 max-w-md mx-auto md:mx-0">
                    <Label htmlFor="age" className="text-lg font-bold text-foreground/70 block">
                      How old are you today?
                    </Label>
                    <div className="relative group">
                      <Input
                        id="age"
                        type="number"
                        min="8"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        placeholder="e.g. 24"
                        className="h-16 rounded-[1.5rem] border-2 border-muted/30 bg-white/50 dark:bg-black/20 focus:border-primary focus:ring-0 text-xl font-bold transition-all px-6 group-hover:border-primary/30"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-sm uppercase tracking-widest pointer-events-none opacity-40 group-focus-within:opacity-100 transition-opacity">Years</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Menstrual History Overview */}
            {step === 2 && (
              <div className="space-y-10">
                {isYoungFlow ? (
                  <>
                    <div className="space-y-2 mb-4">
                      <h2 className="text-3xl font-black text-foreground/80 tracking-tight">Cycle Overview</h2>
                      <p className="text-muted-foreground font-medium italic">General health indicators for your current life stage.</p>
                    </div>
                    <div className="space-y-12">
                      {MENSTRUAL_QUESTIONS_YOUNG.slice(0, 3).map(renderQuestion)}
                    </div>
                  </>
                ) : isMatureFlow ? (
                  <>
                    <h2 className="text-3xl font-black text-foreground/80 tracking-tight mb-8">Period Status</h2>
                    {renderCustomQuestion({
                      id: 'periodsStopped',
                      label: 'Have your periods completely stopped?',
                      options: ['Yes', 'No']
                    })}
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-black text-foreground/80 tracking-tight mb-8">Menstrual History</h2>
                    <div className="space-y-10">
                      <div className="space-y-4">
                        <Label htmlFor="menarche" className="text-lg font-bold text-foreground/70 block">
                          At what age did your menstruation start?
                        </Label>
                        <Input
                          id="menarche"
                          type="number"
                          min="8"
                          max="20"
                          value={formData.menarcheAge}
                          onChange={(e) => handleInputChange('menarcheAge', e.target.value)}
                          placeholder="e.g. 12"
                          className="h-16 rounded-[1.5rem] border-2 border-muted/30 bg-white/50 dark:bg-black/20 focus:border-primary focus:ring-0 text-xl font-bold transition-all px-6"
                        />
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="menopause" className="text-lg font-bold text-foreground/70 block">
                          Age at menopause (if applicable)
                        </Label>
                        <Input
                          id="menopause"
                          type="number"
                          min="30"
                          max="70"
                          value={formData.menopauseAge}
                          onChange={(e) => handleInputChange('menopauseAge', e.target.value)}
                          placeholder="Keep blank if not reached"
                          className="h-16 rounded-[1.5rem] border-2 border-muted/30 bg-white/50 dark:bg-black/20 focus:border-primary focus:ring-0 text-xl font-bold transition-all px-6"
                        />
                      </div>

                      <div className="space-y-6">
                        <Label className="text-lg font-bold text-foreground/70 block px-1">Cycle Regularity Status</Label>
                        <RadioGroup
                          value={formData.cycleRegularity}
                          onValueChange={(value) => handleInputChange('cycleRegularity', value)}
                          className="grid grid-cols-2 gap-4"
                        >
                          {['regular', 'irregular'].map((reg) => (
                            <div
                              key={reg}
                              className={cn(
                                "flex items-center space-x-4 rounded-2xl p-5 border-2 transition-all cursor-pointer shadow-sm hover:shadow-md",
                                formData.cycleRegularity === reg
                                  ? "border-primary bg-primary/5 shadow-primary/10"
                                  : "border-muted/40 hover:border-primary/20 hover:bg-muted/30"
                              )}
                              onClick={() => handleInputChange('cycleRegularity', reg)}
                            >
                              <RadioGroupItem value={reg} id={reg} className="w-5 h-5 border-2 border-primary/40" />
                              <Label htmlFor={reg} className="font-black capitalize cursor-pointer text-sm tracking-tight">{reg}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Modular Step Rendering */}
            {(() => {
              if (step <= 2 && isMenstrual) return null; // Already handled by Step 1 & 2 blocks or specifically below

              // Menstrual Modules (Phase 2, 3, 4, 5)
              if (isMenstrual) {
                if (step === 3) {
                  return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {isYoungFlow ? (
                        <>
                          <h2 className="text-3xl font-black text-foreground/80 tracking-tight">Bleeding & Symptoms</h2>
                          {MENSTRUAL_QUESTIONS_YOUNG.slice(3, 6).map(renderQuestion)}
                        </>
                      ) : isMatureActiveFlow ? (
                        <>
                          <h2 className="text-3xl font-black text-foreground/80 tracking-tight">Period Regularity</h2>
                          <div className="space-y-10">
                            {MENSTRUAL_QUESTIONS_MATURE.slice(0, 3).map((q) => renderCustomQuestion(q))}
                          </div>
                        </>
                      ) : isPostMenopausalFlow ? (
                        <>
                          <h2 className="text-3xl font-black text-foreground/80 tracking-tight">Post-Menopause Status</h2>
                          <div className="space-y-10">
                            {MENSTRUAL_QUESTIONS_POST_MENOPAUSAL.slice(0, 3).map((q) => renderCustomQuestion(q))}
                          </div>
                        </>
                      ) : null}
                    </div>
                  );
                }
                if (step === 4) {
                  return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {isYoungFlow ? (
                        <>
                          <h2 className="text-3xl font-black text-foreground/80 tracking-tight">Overall Symptoms & Diagnosis</h2>
                          <div className="space-y-10">
                            {MENSTRUAL_QUESTIONS_YOUNG.slice(6).map(renderQuestion)}
                          </div>
                        </>
                      ) : isMatureActiveFlow ? (
                        <>
                          <h2 className="text-3xl font-black text-foreground/80 tracking-tight">Bleeding & Pain</h2>
                          <div className="space-y-10">
                            {MENSTRUAL_QUESTIONS_MATURE.slice(3, 6).map((q) => renderCustomQuestion(q))}
                          </div>
                        </>
                      ) : isPostMenopausalFlow ? (
                        <>
                          <h2 className="text-3xl font-black text-foreground/80 tracking-tight">Symptoms & Medical History</h2>
                          <div className="space-y-10">
                            {MENSTRUAL_QUESTIONS_POST_MENOPAUSAL.slice(3, 6).map((q) => renderCustomQuestion(q))}
                          </div>
                        </>
                      ) : null}
                    </div>
                  );
                }
                if (step === 5) {
                  return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {isMatureActiveFlow ? (
                        <>
                          <h2 className="text-3xl font-black text-foreground/80 tracking-tight">Symptoms & Family History</h2>
                          <div className="space-y-10">
                            {MENSTRUAL_QUESTIONS_MATURE.slice(6).map((q) => renderCustomQuestion(q))}
                          </div>
                        </>
                      ) : isPostMenopausalFlow ? (
                        <>
                          <h2 className="text-3xl font-black text-foreground/80 tracking-tight">Health & Family History</h2>
                          <div className="space-y-10">
                            {MENSTRUAL_QUESTIONS_POST_MENOPAUSAL.slice(6).map((q) => renderCustomQuestion(q))}
                          </div>
                        </>
                      ) : null}
                    </div>
                  );
                }
              }

              // Cancer Validation Module (Steps 2-5 when isCancer is true)
              if (isCancer) {
                if (step === 2) {
                  return (
                    <div className="space-y-8 text-center py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/5">
                        <Shield className="w-10 h-10 text-primary" />
                      </div>
                      <div className="space-y-4">
                        <h2 className="text-4xl font-black text-foreground tracking-tighter">Oncology Validation</h2>
                        <p className="text-muted-foreground text-lg max-w-sm mx-auto font-medium italic">
                          "Now, let's explore your physical stats and family background to build a comprehensive risk profile."
                        </p>
                      </div>
                      <div className="pt-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-secondary-foreground text-[10px] font-black uppercase tracking-widest border border-secondary">
                          Module 2: Clinical Factors
                        </div>
                      </div>
                    </div>
                  )
                }
                if (step === 3) {
                  const isDiabetic = formData.diabetic;
                  return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-black text-foreground/80 tracking-tight">Physical Vitality</h2>
                        <p className="text-muted-foreground font-medium italic">Your body measurements help calculate metabolic risk factors.</p>
                      </div>

                      <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label htmlFor="height-c" className="text-lg font-bold text-foreground/70">Height (cm)</Label>
                            <Input id="height-c" type="number" value={formData.height} onChange={(e) => handleInputChange('height', e.target.value)} placeholder="170" className="h-14 rounded-2xl border-2 border-muted/30 focus:border-primary px-6 font-bold" />
                          </div>
                          <div className="space-y-3">
                            <Label htmlFor="weight-c" className="text-lg font-bold text-foreground/70">Weight (kg)</Label>
                            <Input id="weight-c" type="number" value={formData.weight} onChange={(e) => handleInputChange('weight', e.target.value)} placeholder="65" className="h-14 rounded-2xl border-2 border-muted/30 focus:border-primary px-6 font-bold" />
                          </div>
                        </div>

                        {formData.height && formData.weight && (
                          <div className="bg-primary/5 border border-primary/10 p-6 rounded-[2rem] flex items-center justify-between shadow-inner">
                            <span className="text-sm font-black uppercase tracking-widest text-primary/60">Body Mass Index</span>
                            <span className="text-3xl font-black text-primary drop-shadow-sm">{calculateBMI()?.toFixed(1)}</span>
                          </div>
                        )}

                        <div className="space-y-4">
                          <Label className="text-lg font-bold text-foreground/70 block px-1">Have you been diagnosed with diabetes?</Label>
                          <RadioGroup
                            value={formData.diabetic ? 'yes' : 'no'}
                            onValueChange={(value) => handleInputChange('diabetic', value === 'yes')}
                            className="grid grid-cols-2 gap-4"
                          >
                            {['no', 'yes'].map((opt) => (
                              <div
                                key={opt}
                                className={cn(
                                  "flex items-center space-x-4 rounded-2xl p-5 border-2 transition-all cursor-pointer shadow-sm hover:shadow-md",
                                  (opt === 'yes' ? isDiabetic : !isDiabetic)
                                    ? "border-primary bg-primary/5 shadow-primary/10"
                                    : "border-muted/40 hover:border-primary/20 hover:bg-muted/30"
                                )}
                                onClick={() => handleInputChange('diabetic', opt === 'yes')}
                              >
                                <RadioGroupItem value={opt} id={`db-${opt}`} className="w-5 h-5 border-2 border-primary/40" />
                                <Label htmlFor={`db-${opt}`} className="font-black capitalize cursor-pointer text-sm tracking-tight">{opt}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  );
                }
                if (step === 4) {
                  const hasHRT = formData.hormoneTherapy;
                  return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-black text-foreground/80 tracking-tight">Reproductive Journey</h2>
                        <p className="text-muted-foreground font-medium italic">Hormonal history is a key factor in oncology risk assessment.</p>
                      </div>

                      <div className="space-y-8">
                        <div className="space-y-4">
                          <Label htmlFor="children-c" className="text-lg font-bold text-foreground/70 block">How many biological children do you have?</Label>
                          <Input id="children-c" type="number" min="0" value={formData.numberOfChildren} onChange={(e) => handleInputChange('numberOfChildren', e.target.value)} className="h-16 rounded-[1.5rem] border-2 border-muted/30 focus:border-primary px-8 text-xl font-bold" />
                        </div>

                        {parseInt(formData.numberOfChildren) > 0 && (
                          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                            <Label htmlFor="firstBirth-c" className="text-lg font-bold text-foreground/70 block">Age at first biological birth</Label>
                            <Input id="firstBirth-c" type="number" value={formData.ageFirstBirth} onChange={(e) => handleInputChange('ageFirstBirth', e.target.value)} placeholder="e.g. 28" className="h-16 rounded-[1.5rem] border-2 border-muted/30 focus:border-primary px-8 text-xl font-bold" />
                          </div>
                        )}

                        <div className="space-y-4">
                          <Label className="text-lg font-bold text-foreground/70 block px-1">Have you used Hormone Replacement Therapy (HRT)?</Label>
                          <RadioGroup
                            value={formData.hormoneTherapy ? 'yes' : 'no'}
                            onValueChange={(value) => handleInputChange('hormoneTherapy', value === 'yes')}
                            className="grid grid-cols-2 gap-4"
                          >
                            {['no', 'yes'].map((opt) => (
                              <div
                                key={opt}
                                className={cn(
                                  "flex items-center space-x-4 rounded-2xl p-5 border-2 transition-all cursor-pointer shadow-sm hover:shadow-md",
                                  (opt === 'yes' ? hasHRT : !hasHRT)
                                    ? "border-primary bg-primary/5 shadow-primary/10"
                                    : "border-muted/40 hover:border-primary/20 hover:bg-muted/30"
                                )}
                                onClick={() => handleInputChange('hormoneTherapy', opt === 'yes')}
                              >
                                <RadioGroupItem value={opt} id={`hrt-${opt}`} className="w-5 h-5 border-2 border-primary/40" />
                                <Label htmlFor={`hrt-${opt}`} className="font-black capitalize cursor-pointer text-sm tracking-tight">{opt}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  );
                }
                if (step === 5) {
                  const fhBreast = formData.familyHistoryBreast;
                  const fhOvarian = formData.familyHistoryOvarian;
                  return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-black text-foreground/80 tracking-tight">Family Legacy</h2>
                        <p className="text-muted-foreground font-medium italic">Genetics can play a role in health patterns over generations.</p>
                      </div>

                      <div className="space-y-8">
                        <div className="space-y-4">
                          <Label className="text-lg font-bold text-foreground/70 block px-1">Is there a family history of breast cancer?</Label>
                          <RadioGroup
                            value={fhBreast ? 'yes' : 'no'}
                            onValueChange={(value) => handleInputChange('familyHistoryBreast', value === 'yes')}
                            className="grid grid-cols-2 gap-4"
                          >
                            {['no', 'yes'].map((opt) => (
                              <div
                                key={opt}
                                className={cn(
                                  "flex items-center space-x-4 rounded-2xl p-5 border-2 transition-all cursor-pointer shadow-sm hover:shadow-md",
                                  (opt === 'yes' ? fhBreast : !fhBreast)
                                    ? "border-primary bg-primary/5 shadow-primary/10"
                                    : "border-muted/40 hover:border-primary/20 hover:bg-muted/30"
                                )}
                                onClick={() => handleInputChange('familyHistoryBreast', opt === 'yes')}
                              >
                                <RadioGroupItem value={opt} id={`fbr-${opt}`} className="w-5 h-5 border-2 border-primary/40" />
                                <Label htmlFor={`fbr-${opt}`} className="font-black capitalize cursor-pointer text-sm tracking-tight">{opt}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="space-y-4">
                          <Label className="text-lg font-bold text-foreground/70 block px-1">Is there a family history of ovarian cancer?</Label>
                          <RadioGroup
                            value={fhOvarian ? 'yes' : 'no'}
                            onValueChange={(value) => handleInputChange('familyHistoryOvarian', value === 'yes')}
                            className="grid grid-cols-2 gap-4"
                          >
                            {['no', 'yes'].map((opt) => (
                              <div
                                key={opt}
                                className={cn(
                                  "flex items-center space-x-4 rounded-2xl p-5 border-2 transition-all cursor-pointer shadow-sm hover:shadow-md",
                                  (opt === 'yes' ? fhOvarian : !fhOvarian)
                                    ? "border-primary bg-primary/5 shadow-primary/10"
                                    : "border-muted/40 hover:border-primary/20 hover:bg-muted/30"
                                )}
                                onClick={() => handleInputChange('familyHistoryOvarian', opt === 'yes')}
                              >
                                <RadioGroupItem value={opt} id={`fov-${opt}`} className="w-5 h-5 border-2 border-primary/40" />
                                <Label htmlFor={`fov-${opt}`} className="font-black capitalize cursor-pointer text-sm tracking-tight">{opt}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  );
                }
              }

              return null;
            })()}

            {/* Navigation */}
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
