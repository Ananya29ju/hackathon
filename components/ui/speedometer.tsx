'use client'

import React, { useEffect, useState } from 'react'

interface SpeedometerProps {
    value: number
    max?: number
    label?: string
    riskCategory?: 'low' | 'moderate' | 'high'
    size?: 'sm' | 'md' | 'lg'
}

export default function Speedometer({
    value,
    max = 100,
    label,
    riskCategory,
    size = 'md'
}: SpeedometerProps) {
    const [displayValue, setDisplayValue] = useState(0)
    const [isCalculated, setIsCalculated] = useState(false)

    useEffect(() => {
        // Initial scanning animation
        let count = 0
        const duration = 2000 // 2 seconds for scanning
        const intervalTime = 40
        const steps = duration / intervalTime

        const interval = setInterval(() => {
            count++
            if (count < steps) {
                // High-frequency jitter during "analysis"
                const jitter = Math.sin(count * 0.5) * 15 + 50
                setDisplayValue(Math.max(0, Math.min(100, jitter + (Math.random() - 0.5) * 30)))
            } else {
                clearInterval(interval)
                // Transition to final value
                let current = displayValue
                const final = value
                const step = (final - current) / 10
                let i = 0
                const finishInterval = setInterval(() => {
                    if (i < 10) {
                        setDisplayValue(prev => prev + step)
                        i++
                    } else {
                        clearInterval(finishInterval)
                        setDisplayValue(final)
                        setIsCalculated(true)
                    }
                }, 30)
            }
        }, intervalTime)

        return () => clearInterval(interval)
    }, [value])

    const percentage = Math.min(Math.max(displayValue / max, 0), 1)
    const rotation = percentage * 180 - 90

    const getColor = () => {
        if (!isCalculated) return '#8b5cf6' // violet-500 during scanning
        if (riskCategory === 'low') return '#10b981'
        if (riskCategory === 'moderate') return '#f59e0b'
        if (riskCategory === 'high') return '#ef4444'
        return '#ec4899'
    }

    const arcColor = getColor()

    const dimensions = {
        sm: { container: 'w-48 h-36', svg: '200 130', numerical: 'text-3xl' },
        md: { container: 'w-72 h-56', svg: '200 130', numerical: 'text-5xl' },
        lg: { container: 'w-80 h-64', svg: '200 130', numerical: 'text-6xl' },
    }[size]

    return (
        <div className={`relative flex flex-col items-center justify-center mx-auto ${dimensions.container}`}>
            <svg viewBox={dimensions.svg} className="w-full h-full overflow-visible drop-shadow-2xl">
                <defs>
                    <filter id={`glow-${size}`}>
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <linearGradient id={`gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={arcColor} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={arcColor} stopOpacity="1" />
                    </linearGradient>
                </defs>

                {/* Shadow Arc */}
                <path
                    d="M 30 110 A 70 70 0 0 1 170 110"
                    fill="none"
                    stroke="black"
                    strokeWidth="12"
                    strokeLinecap="round"
                    className="opacity-10"
                    transform="translate(0, 2)"
                />

                {/* Background Arc */}
                <path
                    d="M 30 110 A 70 70 0 0 1 170 110"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    className="text-muted/10"
                />

                {/* Progress Arc */}
                <path
                    d="M 30 110 A 70 70 0 0 1 170 110"
                    fill="none"
                    stroke={arcColor}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${percentage * 220} 220`}
                    className="transition-all duration-75 ease-out"
                    filter={`url(#glow-${size})`}
                />

                {/* Ticks */}
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => {
                    const tickRot = (tick / 100) * 180 - 180
                    const isMajor = tick % 20 === 0
                    const x1 = 100 + 72 * Math.cos((tickRot * Math.PI) / 180)
                    const y1 = 110 + 72 * Math.sin((tickRot * Math.PI) / 180)
                    const x2 = 100 + (isMajor ? 85 : 78) * Math.cos((tickRot * Math.PI) / 180)
                    const y2 = 110 + (isMajor ? 85 : 78) * Math.sin((tickRot * Math.PI) / 180)
                    const tx = 100 + 95 * Math.cos((tickRot * Math.PI) / 180)
                    const ty = 110 + 95 * Math.sin((tickRot * Math.PI) / 180)

                    const isActive = isCalculated && displayValue >= tick

                    return (
                        <g key={tick}>
                            <line
                                x1={x1} y1={y1} x2={x2} y2={y2}
                                stroke={isActive ? arcColor : "currentColor"}
                                strokeWidth={isMajor ? "2" : "1"}
                                className={isActive ? "opacity-90" : "text-muted-foreground/30"}
                            />
                            {isMajor && (
                                <text
                                    x={tx} y={ty}
                                    textAnchor="middle"
                                    fontSize="8"
                                    className={`font-black tracking-tighter transition-colors duration-500 ${isActive ? "" : "fill-muted-foreground/40"}`}
                                    style={{ fill: isActive ? arcColor : undefined }}
                                >
                                    {tick}
                                </text>
                            )}
                        </g>
                    )
                })}

                <circle cx="100" cy="110" r="10" className="fill-background" />

                {/* Rotating Needle */}
                <g
                    className="transition-all duration-75 ease-out"
                    style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '100px 110px' }}
                >
                    <path
                        d="M 100 110 L 97 110 L 100 35 L 103 110 Z"
                        fill={arcColor}
                        className="drop-shadow-[0_0_12px_rgba(0,0,0,0.4)]"
                    />
                    <circle cx="100" cy="110" r="6" fill={arcColor} stroke="white" strokeWidth="1" />
                    <circle cx="100" cy="110" r="2" fill="white" />
                </g>
            </svg>

            <div className="absolute bottom-4 flex flex-col items-center">
                <div className={`${dimensions.numerical} font-black tracking-tighter text-foreground drop-shadow-md flex items-end gap-1 transition-all`}>
                    {isCalculated ? Math.round(displayValue) : Math.round(displayValue)}
                    {size !== 'sm' && <span className="text-sm text-muted-foreground font-bold mb-2">%</span>}
                </div>
                {label && size !== 'sm' && (
                    <div className="px-3 py-1 rounded-full bg-primary/10 text-[9px] uppercase tracking-[0.25em] text-primary font-black border border-primary/20 -mt-1 shadow-inner">
                        {isCalculated ? label : 'Analyzing...'}
                    </div>
                )}
            </div>
        </div>
    )
}
