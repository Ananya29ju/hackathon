// Menstrual risk scoring (0-100)
export function calculateMenstrualRisk(
  menarcheAge: number,
  menopauseAge: number | null,
  cycleRegularity: 'regular' | 'irregular'
): number {
  let score = 0

  // Earlier menarche increases risk (2 points per year below 12)
  if (menarcheAge < 12) {
    score += (12 - menarcheAge) * 2
  }

  // Later menopause increases risk (0.5 points per year above 50)
  if (menopauseAge && menopauseAge > 50) {
    score += (menopauseAge - 50) * 0.5
  }

  // Irregular cycles increase risk
  if (cycleRegularity === 'irregular') {
    score += 8
  }

  return Math.min(score, 25) // Cap at 25
}

// Breast cancer risk scoring
export function calculateBreastCancerRisk(factors: {
  familyHistoryBreast: boolean
  familyHistoryOvarian: boolean
  nulliparity: boolean
  lateFirstBirth: boolean
  age: number
  bmiCategory: 'normal' | 'overweight' | 'obese'
}): { score: number; percentage: string } {
  let score = 10 // Base score

  if (factors.familyHistoryBreast) score += 25
  if (factors.familyHistoryOvarian) score += 10
  if (factors.nulliparity) score += 10
  if (factors.lateFirstBirth) score += 8
  if (factors.age >= 50) score += 15
  if (factors.bmiCategory === 'overweight') score += 5
  if (factors.bmiCategory === 'obese') score += 12

  const capped = Math.min(score, 100)
  const percentage = ((capped / 100) * 30).toFixed(1) // Convert to percentage scale

  return { score: capped, percentage }
}

// Ovarian cancer risk scoring
export function calculateOvarianCancerRisk(factors: {
  familyHistoryOvarian: boolean
  familyHistoryBreast: boolean
  nulliparity: boolean
  age: number
  hormoneTherapy: boolean
  irregularMenses: boolean
}): { score: number; percentage: string } {
  let score = 8 // Base score

  if (factors.familyHistoryOvarian) score += 35
  if (factors.familyHistoryBreast) score += 15
  if (factors.nulliparity) score += 12
  if (factors.age >= 45) score += 18
  if (factors.hormoneTherapy) score += 8
  if (factors.irregularMenses) score += 10

  const capped = Math.min(score, 100)
  const percentage = ((capped / 100) * 25).toFixed(1) // Convert to percentage scale

  return { score: capped, percentage }
}

// Endometrial cancer risk scoring
export function calculateEndometrialCancerRisk(factors: {
  age: number
  bmiCategory: 'normal' | 'overweight' | 'obese'
  diabetic: boolean
  nulliparity: boolean
  irregularMenses: boolean
}): { score: number; percentage: string } {
  let score = 10 // Base score

  if (factors.age >= 50) score += 20
  if (factors.bmiCategory === 'overweight') score += 10
  if (factors.bmiCategory === 'obese') score += 25
  if (factors.diabetic) score += 15
  if (factors.nulliparity) score += 8
  if (factors.irregularMenses) score += 12

  const capped = Math.min(score, 100)
  const percentage = ((capped / 100) * 20).toFixed(1) // Convert to percentage scale

  return { score: capped, percentage }
}

// Calculate overall risk levels
export function calculateOverallRisks(
  menstrualRisk: number,
  breastRisk: { score: number; percentage: string },
  ovarianRisk: { score: number; percentage: string },
  endometrialRisk: { score: number; percentage: string }
) {
  // Combine menstrual risk with cancer risks
  const menstrualWeight = 0.15
  const breastWeight = 0.35
  const ovarianWeight = 0.35
  const endometrialWeight = 0.15

  const adjustedBreast =
    (breastRisk.score / 100) * 100 + menstrualRisk * menstrualWeight
  const adjustedOvarian =
    (ovarianRisk.score / 100) * 100 + menstrualRisk * menstrualWeight
  const adjustedEndometrial =
    (endometrialRisk.score / 100) * 100 + menstrualRisk * menstrualWeight

  // Determine primary risk (highest)
  const risks = {
    breast: { name: 'Breast Cancer', score: Math.min(adjustedBreast, 100) },
    ovarian: { name: 'Ovarian Cancer', score: Math.min(adjustedOvarian, 100) },
    endometrial: { name: 'Endometrial Cancer', score: Math.min(adjustedEndometrial, 100) },
  }

  // Find primary risk
  const primaryRisk = Object.entries(risks).reduce((prev, current) =>
    current[1].score > prev[1].score ? current : prev
  )[0] as 'breast' | 'ovarian' | 'endometrial'

  return { risks, primaryRisk }
}

export function getRiskCategory(score: number): 'low' | 'moderate' | 'high' {
  if (score < 20) return 'low'
  if (score < 50) return 'moderate'
  return 'high'
}

export function getRiskColor(category: 'low' | 'moderate' | 'high'): string {
  switch (category) {
    case 'low':
      return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900'
    case 'moderate':
      return 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900'
    case 'high':
      return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900'
  }
}

export function getRiskTextColor(category: 'low' | 'moderate' | 'high'): string {
  switch (category) {
    case 'low':
      return 'text-green-900 dark:text-green-200'
    case 'moderate':
      return 'text-amber-900 dark:text-amber-200'
    case 'high':
      return 'text-red-900 dark:text-red-200'
  }
}
