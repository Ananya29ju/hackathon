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

export function calculateYoungMenstrualRisk(data: any): number {
  let score = 0

  const m = {
    menarche: { 'Below 10': 3, '10–12': 0, '13–15': 0, 'Above 15': 2, 'Not started yet': 5 },
    length: { '21–35 days (regular)': 0, 'Less than 21 days': 3, 'More than 35 days': 3, 'Irregular / varies every month': 5 },
    regularity: { 'Yes, every month': 0, 'Sometimes delayed': 2, 'Often irregular': 4, 'Frequently missed': 5 },
    duration: { '2–3 days': 1, '4–5 days (normal)': 0, '6–7 days': 2, 'More than 7 days': 4 },
    heaviness: { 'Light': 0, 'Normal': 0, 'Heavy': 3, 'Very heavy with clots': 5 },
    cramps: { 'No pain': 0, 'Mild pain': 1, 'Moderate pain': 3, 'Severe pain affecting routine': 5 },
    weight: { 'No': 0, 'Slight': 1, 'Moderate': 3, 'Significant': 4 },
    hair: { 'No': 0, 'Mild': 1, 'Moderate': 3, 'Severe': 5 },
    missed: { 'Never': 0, 'Rarely': 1, 'Sometimes': 3, 'Frequently': 5 },
    pcod: { 'No': 0, 'Suspected but not confirmed': 4, 'Yes, mild': 7, 'Yes, diagnosed': 10 }
  }

  score += (m.menarche as any)[data.menarcheAgeGroup] || 0
  score += (m.length as any)[data.cycleLength] || 0
  score += (m.regularity as any)[data.periodRegularity] || 0
  score += (m.duration as any)[data.bleedingDuration] || 0
  score += (m.heaviness as any)[data.bleedingHeaviness] || 0
  score += (m.cramps as any)[data.crampsSeverity] || 0
  score += (m.weight as any)[data.weightGain] || 0
  score += (m.hair as any)[data.facialHairAcne] || 0
  score += (m.missed as any)[data.missedPeriodsLong] || 0
  score += (m.pcod as any)[data.pcodPcosDiagnosis] || 0

  return Math.min(score, 50) // Cap at 50 for this detailed assessment
}

export function calculateMatureMenstrualRisk(data: any): number {
  let score = 0

  const m = {
    regularity: { 'Yes, very regular': 0, 'Slightly irregular': 3, 'Often irregular': 6, 'Frequently missed': 10 },
    length: { 'Yes': 0, 'Less than 21 days': 4, 'More than 35 days': 4, 'Not sure': 2 },
    heavy: { 'No': 0, 'Sometimes': 3, 'Often': 6, 'Very heavy with clots': 10 },
    duration: { 'No (2–5 days)': 0, '6–7 days': 3, '8–10 days': 6, 'More than 10 days': 10 },
    missed: { 'Never': 0, 'Rarely': 2, 'Sometimes': 5, 'Frequently': 8 },
    pain: { 'No pain': 0, 'Mild pain': 2, 'Moderate pain': 5, 'Severe pain affecting routine': 10 },
    weight: { 'No': 0, 'Slight': 2, 'Moderate': 5, 'Significant': 8 },
    hair: { 'No': 0, 'Mild': 2, 'Moderate': 5, 'Severe': 8 },
    pcod: { 'No': 0, 'Suspected': 4, 'Yes (mild)': 7, 'Yes (diagnosed)': 10 },
    family: { 'No': 0, 'Yes (distant relative)': 5, 'Yes (close family member)': 10, 'Not sure': 3 }
  }

  score += (m.regularity as any)[data.maturePeriodRegularity] || 0
  score += (m.length as any)[data.matureCycleLength] || 0
  score += (m.heavy as any)[data.matureHeavyBleeding] || 0
  score += (m.duration as any)[data.matureDuration] || 0
  score += (m.missed as any)[data.matureMissedPeriods] || 0
  score += (m.pain as any)[data.maturePain] || 0
  score += (m.weight as any)[data.matureWeightGain] || 0
  score += (m.hair as any)[data.matureHairAcne] || 0
  score += (m.pcod as any)[data.maturePcod] || 0
  score += (m.family as any)[data.matureFamilyHistory] || 0

  return Math.min(score, 60) // Slightly higher cap for mature assessment
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
