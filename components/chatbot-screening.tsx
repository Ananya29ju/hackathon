'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    Send,
    Bot,
    User as UserIcon,
    Shield,
    Sparkles,
    MessageSquare,
    Volume2,
    VolumeX,
    ChevronDown,
    RotateCcw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    calculateYoungMenstrualRisk,
    calculateMatureMenstrualRisk,
    calculatePostMenopausalRisk,
    calculateBreastCancerRisk,
    calculateOvarianCancerRisk,
    calculateEndometrialCancerRisk,
    calculateOverallRisks
} from '@/lib/risk-calculator'

interface Message {
    id: string
    sender: 'bot' | 'user'
    text: string
    options?: string[]
    inputType?: 'text' | 'number' | 'none'
    field?: string
}

interface ChatbotScreeningProps {
    onSubmit: (data: any) => void
    assessmentType: 'menstrual' | 'cancer' | 'both'
    isLoggedIn?: boolean
    userRole?: string
}

const CANCER_QUESTIONS = [
    { id: 'breastChange', label: '1. Do you notice any breast lumps or change in shape?', options: ['No', 'Not sure', 'Yes, small change', 'Yes, clear lump/change'] },
    { id: 'nippleDischarge', label: '2. Any nipple discharge, pain, or skin changes?', options: ['No', 'Mild', 'Sometimes', 'Persistent/abnormal'] },
    { id: 'abnormalBleeding', label: '3. Any abnormal vaginal bleeding (between periods or after menopause)?', options: ['No', 'Once', 'Occasionally', 'Frequent'] },
    { id: 'pelvicPain', label: '4. Persistent pelvic or lower abdominal pain?', options: ['No', 'Mild', 'Often', 'Severe/persistent'] },
    { id: 'weightLossFatigue', label: '5. Unexplained weight loss or long-term fatigue?', options: ['No', 'Mild', 'Noticeable', 'Significant'] },
    { id: 'bloatingSwelling', label: '6. Frequent bloating or abdominal swelling?', options: ['No', 'Sometimes', 'Often', 'Persistent'] },
    { id: 'familyHistoryCancer', label: '7. Family history of breast/ovarian/uterine cancer?', options: ['No', 'Distant relative', 'Close family member', 'Multiple cases'] },
    { id: 'hormonalHistory', label: '8. History of irregular periods / PCOS / hormonal issues?', options: ['No', 'Mild', 'Diagnosed', 'Long-term/severe'] },
    { id: 'pastReproductiveIssues', label: '9. Past ovarian cysts, fibroids, abnormal scan/Pap?', options: ['No', 'Once', 'Recurrent', 'Serious/treated'] },
    { id: 'symptomDuration', label: '10. Duration of symptoms?', options: ['None', 'Few weeks', 'Few months', 'Long-term'] }
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

export default function ChatbotScreening({ onSubmit, assessmentType, isLoggedIn, userRole }: ChatbotScreeningProps) {
    const isAsha = userRole === 'asha'
    const [messages, setMessages] = useState<Message[]>([])
    const [formData, setFormData] = useState<any>({})
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1)
    const [currentQuestionSet, setCurrentQuestionSet] = useState<any[]>([])
    const [phase, setPhase] = useState<'info' | 'menstrual' | 'cancer' | 'results'>('info')
    const [isTyping, setIsTyping] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const hasInitialized = useRef(false)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    useEffect(() => {
        if (hasInitialized.current) return
        hasInitialized.current = true

        // Initial message
        addBotMessage("Hi! I'm Ovi, your AI health guide. I'll help you complete your assessment today. It will be just like a conversation.")
        setTimeout(() => {
            if (isAsha) {
                addBotMessage("Since you're an ASHA worker, let's start with the patient's information. What is the patient's name?", [], 'text', 'patientName')
            } else {
                addBotMessage("Let's start with a basic detail. How old are you?", [], 'number', 'age')
            }
        }, 1200)
    }, [])

    const addBotMessage = (text: string, options: string[] = [], inputType: 'text' | 'number' | 'none' = 'none', field?: string) => {
        setIsTyping(true)
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                sender: 'bot',
                text,
                options,
                inputType,
                field
            }])
            setIsTyping(false)
        }, 800)
    }

    const addUserMessage = (text: string) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'user',
            text
        }])
    }

    const handleOptionSelect = (option: string, field?: string) => {
        addUserMessage(option)
        const updatedData = { ...formData, [field || '']: option }
        setFormData(updatedData)

        processNextStep(updatedData)
    }

    const handleInputSubmit = (e: any) => {
        e.preventDefault()
        if (!inputValue.trim()) return

        const currentMsg = [...messages].reverse().find(m => m.sender === 'bot' && m.field)
        if (!currentMsg) return

        addUserMessage(inputValue)
        const updatedData = { ...formData, [currentMsg.field || '']: inputValue }
        setFormData(updatedData)
        setInputValue('')

        processNextStep(updatedData)
    }

    const processNextStep = (data: any) => {
        if (phase === 'info') {
            if (isAsha && !data.patientName) {
                addBotMessage("What is the patient's name?", [], 'text', 'patientName')
            } else if (isAsha && !data.patientPhone) {
                addBotMessage(`And what is ${data.patientName}'s phone number?`, [], 'text', 'patientPhone')
            } else if (!data.age) {
                addBotMessage(isAsha ? `How old is ${data.patientName}?` : "How old are you?", [], 'number', 'age')
            } else if (assessmentType !== 'cancer' && !data.menstrualStage) {
                setPhase('menstrual')
                addBotMessage(isAsha ? "Has their menstrual cycle completely stopped (menopause)?" : "Has your menstrual cycle completely stopped (menopause)?", ["Yes", "No"], 'none', 'periodsStopped')
            } else {
                startCancerPhase(data)
            }
        } else if (phase === 'menstrual') {
            if (data.periodsStopped && !data.menstrualStage) {
                if (data.periodsStopped === 'Yes') {
                    const updated = { ...data, menstrualStage: 'post' }
                    setFormData(updated)
                    setCurrentQuestionSet(MENSTRUAL_QUESTIONS_POST)
                    setCurrentQuestionIndex(0)
                    addBotMessage("I'll ask a few questions about the post-menopause phase. " + MENSTRUAL_QUESTIONS_POST[0].label, MENSTRUAL_QUESTIONS_POST[0].options, 'none', MENSTRUAL_QUESTIONS_POST[0].id)
                } else {
                    const age = parseInt(data.age)
                    const stage = age < 25 ? 'young' : 'mature'
                    const updated = { ...data, menstrualStage: stage }
                    setFormData(updated)
                    const qSet = stage === 'young' ? MENSTRUAL_QUESTIONS_YOUNG : MENSTRUAL_QUESTIONS_MATURE
                    setCurrentQuestionSet(qSet)
                    setCurrentQuestionIndex(0)
                    addBotMessage(`Great. Since ${isAsha ? 'they are' : "you're"} in the ${stage} phase, let's look at the cycle. ` + qSet[0].label, qSet[0].options, 'none', qSet[0].id)
                }
            } else if (currentQuestionIndex < currentQuestionSet.length - 1) {
                const nextIdx = currentQuestionIndex + 1
                setCurrentQuestionIndex(nextIdx)
                addBotMessage(currentQuestionSet[nextIdx].label, currentQuestionSet[nextIdx].options, 'none', currentQuestionSet[nextIdx].id)
            } else {
                if (assessmentType === 'both' || assessmentType === 'cancer') {
                    startCancerPhase(data)
                } else {
                    finishAssessment(data)
                }
            }
        } else if (phase === 'cancer') {
            if (currentQuestionIndex < CANCER_QUESTIONS.length - 1) {
                const nextIdx = currentQuestionIndex + 1
                setCurrentQuestionIndex(nextIdx)
                addBotMessage(CANCER_QUESTIONS[nextIdx].label, CANCER_QUESTIONS[nextIdx].options, 'none', CANCER_QUESTIONS[nextIdx].id)
            } else {
                finishAssessment(data)
            }
        }
    }

    const startCancerPhase = (data: any) => {
        setPhase('cancer')
        setCurrentQuestionSet(CANCER_QUESTIONS)
        setCurrentQuestionIndex(0)
        addBotMessage("Now, let's move to a few medical screening questions. " + CANCER_QUESTIONS[0].label, CANCER_QUESTIONS[0].options, 'none', CANCER_QUESTIONS[0].id)
    }

    const finishAssessment = (data: any) => {
        addBotMessage("All done! I've collected all the necessary information. Analyzing the results now...", [], 'none')
        setTimeout(() => {
            const results = calculateResults(data)
            onSubmit(results)
        }, 1500)
    }

    const calculateResults = (data: any) => {
        const age = parseInt(data.age) || 0
        let menstrualRisk = 0
        if (data.menstrualStage === 'young') menstrualRisk = calculateYoungMenstrualRisk(data)
        else if (data.menstrualStage === 'mature') menstrualRisk = calculateMatureMenstrualRisk(data)
        else if (data.menstrualStage === 'post') menstrualRisk = calculatePostMenopausalRisk(data)

        const abnormalBleeding = data.abnormalBleeding || data.pmBleeding
        const regularPeriods = data.periodRegularity === 'Yes, every month' || data.maturePeriodRegularity === 'Yes, very regular'

        const breastRisk = calculateBreastCancerRisk({
            familyHistoryBreast: data.familyHistoryCancer?.includes('family'),
            familyHistoryOvarian: data.familyHistoryCancer?.includes('family'),
            nulliparity: false,
            lateFirstBirth: false,
            age,
            bmiCategory: 'normal',
            breastChange: data.breastChange,
            nippleDischarge: data.nippleDischarge,
            familyHistoryCancer: data.familyHistoryCancer
        })

        const ovarianRisk = calculateOvarianCancerRisk({
            familyHistoryOvarian: data.familyHistoryCancer?.includes('family'),
            familyHistoryBreast: data.familyHistoryCancer?.includes('family'),
            nulliparity: false,
            age,
            hormoneTherapy: data.pmHrtUsage?.includes('year'),
            irregularMenses: !regularPeriods,
            bloatingSwelling: data.bloatingSwelling,
            pelvicPain: data.pelvicPain || data.pmPelvicPain,
            weightLossFatigue: data.weightLossFatigue || data.pmWeightLossFatigue,
            pastReproductiveIssues: data.pastReproductiveIssues
        })

        const endometrialRisk = calculateEndometrialCancerRisk({
            age,
            bmiCategory: 'normal',
            diabetic: data.pmChronicConditions?.includes('diabetes'),
            nulliparity: false,
            irregularMenses: !regularPeriods,
            abnormalBleeding,
            pelvicPain: data.pelvicPain || data.pmPelvicPain,
            hormonalHistory: data.hormonalHistory
        })

        const overallRisks = calculateOverallRisks(menstrualRisk, breastRisk, ovarianRisk, endometrialRisk)

        return {
            ...data,
            menstrualRisk,
            breastRisk,
            ovarianRisk,
            endometrialRisk,
            overallRisks,
            assessmentType
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto h-[600px] flex flex-col bg-white dark:bg-black/40 rounded-[2.5rem] shadow-2xl border border-primary/10 overflow-hidden backdrop-blur-3xl animate-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="p-6 bg-primary text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-black tracking-tight">Ovi Health Assistant</h3>
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest opacity-80">
                            <Sparkles className="w-3 h-3 text-white" />
                            AI Mode Active
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex gap-3 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                            msg.sender === 'user' ? "ml-auto flex-row-reverse" : ""
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                            msg.sender === 'bot' ? "bg-primary/10 text-primary" : "bg-black/5 text-muted-foreground"
                        )}>
                            {msg.sender === 'bot' ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                        </div>
                        <div className="space-y-3">
                            <div className={cn(
                                "p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                                msg.sender === 'bot'
                                    ? "bg-muted/50 dark:bg-zinc-800 rounded-tl-none border border-primary/5 text-foreground"
                                    : "bg-primary text-white rounded-tr-none"
                            )}>
                                {msg.text}
                            </div>
                            {msg.sender === 'bot' && msg.options && msg.options.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {msg.options.map((opt, i) => (
                                        <Button
                                            key={i}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleOptionSelect(opt, msg.field)}
                                            className="rounded-full text-xs font-bold border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all px-4"
                                        >
                                            {opt}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-muted/50 dark:bg-zinc-800 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center border border-primary/5">
                            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 pt-2 shrink-0 border-t border-primary/5">
                <form onSubmit={handleInputSubmit} className="relative flex items-center">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your answer here..."
                        className="pr-14 h-14 rounded-2xl border-none bg-black/5 dark:bg-white/5 focus-visible:ring-primary/20 font-medium"
                        disabled={!messages[messages.length - 1]?.inputType || messages[messages.length - 1]?.inputType === 'none'}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="absolute right-2 h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105"
                        disabled={!inputValue.trim() || messages[messages.length - 1]?.inputType === 'none'}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
                <p className="mt-3 text-[9px] text-center text-muted-foreground font-black uppercase tracking-widest opacity-50 flex items-center justify-center gap-2">
                    <Shield className="w-3 h-3 text-primary" />
                    AI-Assisted Educational Screening
                </p>
            </div>
        </div>
    )
}
