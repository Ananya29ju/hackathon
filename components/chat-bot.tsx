'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    MessageCircle,
    X,
    Send,
    Bot,
    User,
    Heart,
    Shield,
    AlertCircle,
    ExternalLink,
    ChevronDown,
    Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
    id: string
    text: string
    sender: 'user' | 'bot'
    timestamp: Date
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi! I'm Ovi, your OVIRA health assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ])
    const [isTyping, setIsTyping] = useState(false)
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight
            }
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    const handleSend = async () => {
        if (!inputValue.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue('')
        setIsTyping(true)

        // Mock bot response logic
        setTimeout(() => {
            const botResponse = getBotResponse(inputValue)
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: botResponse,
                sender: 'bot',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, botMessage])
            setIsTyping(false)
        }, 1000)
    }

    const getBotResponse = (input: string): string => {
        const query = input.toLowerCase()

        if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
            return "Hello! I'm Ovi, your personalized health guide. How are you feeling today? You can ask me about symptoms, screenings, or how to use the OVIRA dashboard."
        }

        if (query.includes('cancer') || query.includes('screening') || query.includes('sheshield')) {
            return "Our SheShield screening initiative focuses on early detection of breast, ovarian, and endometrial health risks. It's designed to be gentle and supportive. Would you like me to guide you to the assessment page?"
        }

        if (query.includes('breast') && (query.includes('lump') || query.includes('pain') || query.includes('change'))) {
            return "If you notice a lump, persistent pain, or changes in breast shape, we recommend taking the Breast Cancer Screening assessment and consulting a doctor. Early awareness is the most powerful tool for your health."
        }

        if (query.includes('ovarian') && (query.includes('bloat') || query.includes('pain') || query.includes('weight'))) {
            return "Ovarian health concerns often present as persistent bloating or pelvic pain. Our Ovarian Assessment looks at these factors along with your family history to provide a clear risk index."
        }

        if (query.includes('menstrual') || query.includes('period') || query.includes('pcos') || query.includes('pcod') || query.includes('cycle')) {
            return "Menstrual cycles are a 'fifth vital sign' for women. If yours are irregular, heavy, or painful, you should try our Menstrual Validation tool. It provides insights into hormonal stability and potential PCOD risks."
        }

        if (query.includes('algorithm') || query.includes('score') || query.includes('calculate') || query.includes('how it works')) {
            return "I use a weighted point-based algorithm rooted in clinical research. It analyzes your family history, symptoms, and age to categorize your risk as Low, Moderate, High, or Critical. It's designed to empower you with evidence-based data."
        }

        if (query.includes('preventive') || query.includes('wellness') || query.includes('diet') || query.includes('tips') || query.includes('hub')) {
            return "The Wellness Hub is your space for preventive care! It includes curated advice on nutrition (like protein-rich diets), hygiene, and lifestyle changes to keep your reproductive health in check."
        }

        if (query.includes('asha') || query.includes('worker') || query.includes('community') || query.includes('village')) {
            return "OVIRA is a bridge for ASHA workers. By using the app, you provide anonymized data that helps community health workers identify trends and high-risk clusters in your area through our Heat Map."
        }

        if (query.includes('map') || query.includes('heatmap') || query.includes('location')) {
            return "The Health Map is a live monitoring tool for ASHA workers. It visualizes risk density across different regions while keeping individual identities strictly private through encryption."
        }

        if (query.includes('doctor') || query.includes('medical') || query.includes('help') || query.includes('emergency')) {
            return "Important: I am an educational assistant, not a doctor. If you're in pain or have urgent concerns, please visit a clinic immediately. You can generate a PDF report from your assessment to help your doctor understand your symptoms better."
        }

        if (query.includes('report') || query.includes('pdf') || query.includes('save')) {
            return "You can generate a detailed PDF report after completing any assessment. Just look for the 'Download Report' button on the results page!"
        }

        if (query.includes('who') || query.includes('created') || query.includes('ovira')) {
            return "OVIRA was created by a dedicated team of health advocates and developers to empower women with accessible, smart health screening tools. We're on a mission to make preventive care a standard for everyone."
        }

        return "That's an interesting question. While I'm still learning, I can definitely help you with screenings, health tips, and navigating your dashboard. Would you like to start a health assessment?"
    }

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <Card className="mb-4 w-[350px] md:w-[400px] h-[500px] md:h-[600px] flex flex-col overflow-hidden shadow-2xl border-none glass-card bg-white/90 dark:bg-black/90 backdrop-blur-2xl animate-in slide-in-from-bottom-5 duration-500 rounded-[2.5rem]">
                    {/* Header */}
                    <div className="p-6 bg-gradient-to-r from-primary to-primary/80 text-white flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black tracking-tight">Ovi Assistant</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-[10px] uppercase font-black tracking-widest opacity-80">Online & Ready</span>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-white/20 rounded-full h-10 w-10"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Messages Area */}
                    <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
                        <div className="space-y-6">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex gap-3 max-w-[85%]",
                                        msg.sender === 'user' ? "ml-auto flex-row-reverse" : ""
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                        msg.sender === 'bot' ? "bg-primary/10 text-primary" : "bg-black/5 text-muted-foreground"
                                    )}>
                                        {msg.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                    </div>
                                    <div className={cn(
                                        "p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                                        msg.sender === 'bot'
                                            ? "bg-white dark:bg-zinc-800 rounded-tl-none border border-primary/5 text-foreground"
                                            : "bg-primary text-white rounded-tr-none"
                                    )}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center border border-primary/5">
                                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Quick Suggestions */}
                    {!isTyping && messages.length < 5 && (
                        <div className="px-6 pb-2 pt-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
                            {[
                                { text: "Cancer Screening", icon: Shield },
                                { text: "Menstrual Health", icon: Sparkles },
                                { text: "How it works", icon: Bot }
                            ].map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setInputValue(opt.text)
                                        // Trigger send manually or just fill input
                                    }}
                                    className="whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 hover:bg-primary/10 text-primary text-xs font-black transition-all border border-primary/10"
                                >
                                    <opt.icon className="w-3 h-3" />
                                    {opt.text}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-6 pt-2 shrink-0">
                        <div className="relative flex items-center">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your health question..."
                                className="pr-14 h-14 rounded-2xl border-none bg-black/5 dark:bg-white/5 focus-visible:ring-primary/20 font-medium"
                            />
                            <Button
                                onClick={handleSend}
                                size="icon"
                                className="absolute right-2 h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105"
                                disabled={!inputValue.trim()}
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="mt-3 text-[9px] text-center text-muted-foreground font-black uppercase tracking-widest opacity-50">
                            AI-Assisted Educational Guidance
                        </p>
                    </div>
                </Card>
            )}

            {/* Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="lg"
                className={cn(
                    "h-16 w-16 md:h-20 md:w-20 rounded-[2rem] shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95",
                    isOpen
                        ? "bg-white dark:bg-zinc-800 text-primary border-4 border-primary/20"
                        : "bg-primary text-white shadow-primary/30"
                )}
            >
                {isOpen ? (
                    <ChevronDown className="w-8 h-8 md:w-10 md:h-10 animate-in fade-in zoom-in duration-300" />
                ) : (
                    <div className="relative">
                        <MessageCircle className="w-8 h-8 md:w-10 md:h-10 fill-current animate-in fade-in zoom-in duration-300" />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-white/20"></span>
                        </span>
                    </div>
                )}
            </Button>
        </div>
    )
}
