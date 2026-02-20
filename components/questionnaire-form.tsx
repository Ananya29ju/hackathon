'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  calculateMenstrualRisk,
  calculateBreastCancerRisk,
  calculateOvarianCancerRisk,
  calculateEndometrialCancerRisk,
  calculateOverallRisks,
} from '@/lib/risk-calculator'

interface QuestionnaireFormProps {
  onSubmit: (data: any) => void
}

export default function QuestionnaireForm({ onSubmit }: QuestionnaireFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Demographics
    age: '',
    // Menstrual History
    menarcheAge: '',
    menopauseAge: '',
    cycleRegularity: 'regular',
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

  const totalSteps = 5

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
    const menstrualRisk = calculateMenstrualRisk(
      parseInt(formData.menarcheAge),
      formData.menopauseAge ? parseInt(formData.menopauseAge) : null,
      formData.cycleRegularity as 'regular' | 'irregular'
    )

    const breastRisk = calculateBreastCancerRisk({
      familyHistoryBreast: formData.familyHistoryBreast,
      familyHistoryOvarian: formData.familyHistoryOvarian,
      nulliparity: parseInt(formData.numberOfChildren) === 0,
      lateFirstBirth:
        parseInt(formData.numberOfChildren) > 0 && parseInt(formData.ageFirstBirth) >= 30,
      age: parseInt(formData.age),
      bmiCategory: getBMICategory() as 'normal' | 'overweight' | 'obese',
    })

    const ovarianRisk = calculateOvarianCancerRisk({
      familyHistoryOvarian: formData.familyHistoryOvarian,
      familyHistoryBreast: formData.familyHistoryBreast,
      nulliparity: parseInt(formData.numberOfChildren) === 0,
      age: parseInt(formData.age),
      hormoneTherapy: formData.hormoneTherapy,
      irregularMenses: formData.cycleRegularity === 'irregular',
    })

    const endometrialRisk = calculateEndometrialCancerRisk({
      age: parseInt(formData.age),
      bmiCategory: getBMICategory() as 'normal' | 'overweight' | 'obese',
      diabetic: formData.diabetic,
      nulliparity: parseInt(formData.numberOfChildren) === 0,
      irregularMenses: formData.cycleRegularity === 'irregular',
    })

    const overallRisks = calculateOverallRisks(menstrualRisk, breastRisk, ovarianRisk, endometrialRisk)

    onSubmit({
      ...formData,
      menstrualRisk,
      breastRisk,
      ovarianRisk,
      endometrialRisk,
      overallRisks,
      bmi: calculateBMI()?.toFixed(1),
    })
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.age && parseInt(formData.age) >= 18
      case 2:
        return formData.menarcheAge && formData.cycleRegularity
      case 3:
        return formData.height && formData.weight
      case 4:
        return formData.numberOfChildren !== ''
      case 5:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Health Risk Assessment</h1>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-2 flex gap-1 p-0.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all ${
                    i < step ? 'bg-primary' : 'bg-muted-foreground/20'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {step}/{totalSteps}
            </span>
          </div>
        </div>

        <Card className="p-8">
          {/* Step 1: Demographics */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-6">Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="age" className="text-base font-medium">
                      Age (years)
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min="18"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="Enter your age"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Menstrual History */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">Menstrual History</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="menarche" className="text-base font-medium">
                    Age when menstruation started (years)
                  </Label>
                  <Input
                    id="menarche"
                    type="number"
                    min="8"
                    max="20"
                    value={formData.menarcheAge}
                    onChange={(e) => handleInputChange('menarcheAge', e.target.value)}
                    placeholder="e.g., 12"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="menopause" className="text-base font-medium">
                    Age when menopause started (if applicable)
                  </Label>
                  <Input
                    id="menopause"
                    type="number"
                    min="30"
                    max="70"
                    value={formData.menopauseAge}
                    onChange={(e) => handleInputChange('menopauseAge', e.target.value)}
                    placeholder="Leave blank if not applicable"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">Menstrual Cycle Regularity</Label>
                  <RadioGroup value={formData.cycleRegularity} onValueChange={(value) => handleInputChange('cycleRegularity', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="regular" id="regular" />
                      <Label htmlFor="regular" className="font-normal cursor-pointer">
                        Regular
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="irregular" id="irregular" />
                      <Label htmlFor="irregular" className="font-normal cursor-pointer">
                        Irregular
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Physical Measurements */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">Physical Health</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height" className="text-base font-medium">
                      Height (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      placeholder="e.g., 170"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight" className="text-base font-medium">
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      placeholder="e.g., 65"
                      className="mt-2"
                    />
                  </div>
                </div>
                {formData.height && formData.weight && (
                  <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground flex items-center gap-3">
                      <span>
                        Your BMI: <span className="font-semibold text-foreground">{calculateBMI()?.toFixed(1)}</span>
                      </span>
                      {getBMIStatus() && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm ${getBMIStatus()!.className}`}>
                          {getBMIStatus()!.label}
                        </span>
                      )}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-base font-medium mb-3 block">Do you have diabetes?</Label>
                  <RadioGroup
                    value={formData.diabetic ? 'yes' : 'no'}
                    onValueChange={(value) => handleInputChange('diabetic', value === 'yes')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no-diabetes" />
                      <Label htmlFor="no-diabetes" className="font-normal cursor-pointer">
                        No
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes-diabetes" />
                      <Label htmlFor="yes-diabetes" className="font-normal cursor-pointer">
                        Yes
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Reproductive History */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">Reproductive History</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="children" className="text-base font-medium">
                    Number of children
                  </Label>
                  <Input
                    id="children"
                    type="number"
                    min="0"
                    value={formData.numberOfChildren}
                    onChange={(e) => handleInputChange('numberOfChildren', e.target.value)}
                    className="mt-2"
                  />
                </div>

                {parseInt(formData.numberOfChildren) > 0 && (
                  <div>
                    <Label htmlFor="firstBirth" className="text-base font-medium">
                      Age at first birth
                    </Label>
                    <Input
                      id="firstBirth"
                      type="number"
                      value={formData.ageFirstBirth}
                      onChange={(e) => handleInputChange('ageFirstBirth', e.target.value)}
                      placeholder="e.g., 28"
                      className="mt-2"
                    />
                  </div>
                )}

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Have you used hormone replacement therapy or birth control for long periods?
                  </Label>
                  <RadioGroup
                    value={formData.hormoneTherapy ? 'yes' : 'no'}
                    onValueChange={(value) => handleInputChange('hormoneTherapy', value === 'yes')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no-hormone" />
                      <Label htmlFor="no-hormone" className="font-normal cursor-pointer">
                        No
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes-hormone" />
                      <Label htmlFor="yes-hormone" className="font-normal cursor-pointer">
                        Yes
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Family History */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">Family Medical History</h2>
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Family history of breast cancer
                  </Label>
                  <RadioGroup
                    value={formData.familyHistoryBreast ? 'yes' : 'no'}
                    onValueChange={(value) =>
                      handleInputChange('familyHistoryBreast', value === 'yes')
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no-breast-history" />
                      <Label htmlFor="no-breast-history" className="font-normal cursor-pointer">
                        No
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes-breast-history" />
                      <Label htmlFor="yes-breast-history" className="font-normal cursor-pointer">
                        Yes
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Family history of ovarian cancer
                  </Label>
                  <RadioGroup
                    value={formData.familyHistoryOvarian ? 'yes' : 'no'}
                    onValueChange={(value) =>
                      handleInputChange('familyHistoryOvarian', value === 'yes')
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no-ovarian-history" />
                      <Label htmlFor="no-ovarian-history" className="font-normal cursor-pointer">
                        No
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes-ovarian-history" />
                      <Label htmlFor="yes-ovarian-history" className="font-normal cursor-pointer">
                        Yes
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex-1" />
            {step < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                View Results
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
