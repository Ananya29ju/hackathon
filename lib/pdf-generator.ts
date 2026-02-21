import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Define the type for the autotable plugin on jsPDF
interface jsPDFWithPlugin extends jsPDF {
    autoTable: (options: any) => jsPDF
}

const QUESTION_LABELS: Record<string, string> = {
    age: 'Patient Age',
    height: 'Height (cm)',
    weight: 'Weight (kg)',
    bmi: 'Calculated BMI',
    periodsStopped: 'Has the periods completely stopped?',
    // Cancer
    breastChange: 'Breast lump or change in shape?',
    nippleDischarge: 'Nipple discharge, pain, or skin change?',
    abnormalBleeding: 'Abnormal vaginal bleeding?',
    pelvicPain: 'Persistent pelvic or lower abdominal pain?',
    weightLossFatigue: 'Unexplained weight loss or fatigue?',
    bloatingSwelling: 'Frequent bloating or abdominal swelling?',
    familyHistoryCancer: 'Family history of breast/ovarian/uterine cancer?',
    hormonalHistory: 'History of irregular periods / PCOS?',
    pastReproductiveIssues: 'Past ovarian cysts or fibroids?',
    symptomDuration: 'Duration of symptoms?',
    // Young Menstrual
    menarcheAgeGroup: 'Age periods started?',
    cycleLength: 'Typical cycle length?',
    periodRegularity: 'Are periods regular?',
    bleedingDuration: 'Period duration (days)?',
    bleedingHeaviness: 'Bleeding flow description:',
    crampsSeverity: 'Period cramps severity?',
    weightGain: 'Unusual weight gain/hair growth?',
    facialHairAcne: 'Facial hair or persistent acne?',
    missedPeriodsLong: 'Frequently missed periods?',
    pcodPcosDiagnosis: 'PCOD/PCOS diagnosis?',
    // Mature Menstrual
    maturePeriodRegularity: 'Are periods coming regularly?',
    matureCycleLength: 'Cycle between 21–35 days?',
    matureHeavyBleeding: 'Experience very heavy bleeding?',
    matureDuration: 'Periods last more than 7 days?',
    matureMissedPeriods: 'Miss periods for 2+ months?',
    maturePain: 'Severe menstrual pain?',
    matureWeightGain: 'Unusual weight gain?',
    matureHairAcne: 'Excessive hair/acne?',
    maturePcod: 'Diagnosed with PCOD/PCOS?',
    matureFamilyHistory: 'Family history of cancer?',
    // Post Menopausal
    pmAge: 'Age periods stopped?',
    pmBleeding: 'Bleeding/spotting after menopause?',
    pmPreRegularity: 'Periods irregular before menopause?',
    pmPreHeavyBleeding: 'Heavy bleeding before menopause?',
    pmPelvicPain: 'Current pelvic pain/pressure?',
    pmHrtUsage: 'HRT usage history?',
    pmChronicConditions: 'Diabetes/Obesity/High BP?',
    pmWeightLossFatigue: 'Recent weight loss/fatigue?',
    pmReproductiveDiagnoses: 'Uterine/Ovarian diagnoses?',
    pmFamilyHistory: 'Family history of cancer?',
}

export const generateHealthReport = (
    userName: string,
    results: any,
    config: any,
    score: number,
    category: string
) => {
    const doc = new jsPDF() as jsPDFWithPlugin
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    // Colors
    const primaryColor = [124, 58, 237] // Lavender/Primary
    const accentColor = [225, 29, 72] // Rose

    // Header Section
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.rect(0, 0, 210, 40, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(28)
    doc.text('OVIRA', 20, 25)

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Personalized Health Health Insight Report', 20, 32)

    doc.setTextColor(255, 255, 255)
    doc.text(`Date: ${date}`, 160, 25)

    // User Info Section
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('Assessment Summary', 20, 55)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text(`Patient Name: ${userName}`, 20, 65)
    doc.text(`Assessment Type: ${results.assessmentType === 'both' ? 'Full Health Screening' : results.assessmentType === 'cancer' ? 'SheShield Screening' : 'Menstrual Health Check'}`, 20, 70)
    doc.text(`Calculated Age: ${results.age}`, 20, 75)

    // Risk Level Box
    const riskBoxY = 85
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.setLineWidth(0.5)
    doc.roundedRect(20, riskBoxY, 170, 45, 3, 3, 'S')

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Overall Risk Evaluation', 30, riskBoxY + 10)

    doc.setFontSize(24)
    const categoryColor = category === 'high' ? [225, 29, 72] : category === 'moderate' ? [217, 119, 6] : [5, 150, 105]
    doc.setTextColor(categoryColor[0], categoryColor[1], categoryColor[2])
    doc.text(config.badgeLabel, 30, riskBoxY + 22)

    doc.setFontSize(10)
    doc.setTextColor(60, 60, 60)
    doc.setFont('helvetica', 'italic')
    doc.text(`Risk Score: ${score}/100`, 30, riskBoxY + 30)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    const wrappedMessage = doc.splitTextToSize(config.message, 150)
    doc.text(wrappedMessage, 30, riskBoxY + 38)

    // Doctor's Recommendations
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Professional Recommendations', 20, 145)

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    const wrappedRec = doc.splitTextToSize(config.recommendation, 170)
    doc.text(wrappedRec, 20, 155)

    doc.setFont('helvetica', 'bold')
    doc.text('Action Items:', 20, 175)
    doc.setFont('helvetica', 'normal')
    config.buttons.forEach((btn: any, index: number) => {
        doc.text(`• ${btn.label}`, 25, 182 + (index * 7))
    })

    // Data Table
    doc.addPage()
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Detailed Responses', 20, 20)

    const tableData = Object.entries(results)
        .filter(([key]) => QUESTION_LABELS[key])
        .map(([key, value]) => [QUESTION_LABELS[key], value])

    doc.autoTable({
        startY: 30,
        head: [['Assessment Question', 'User Response']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: primaryColor },
        margin: { left: 20, right: 20 }
    })

    // Footer Disclaimer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text(
            'Disclaimer: This report is generated by an AI screening tool and is NOT a clinical diagnosis. Always consult a qualified physician.',
            105,
            285,
            { align: 'center' }
        )
        doc.text(`Page ${i} of ${pageCount}`, 200, 285, { align: 'right' })
    }

    doc.save(`OVIRA_Health_Report_${userName.replace(/\s+/g, '_')}_${date.replace(/\s+/g, '_')}.pdf`)
}
