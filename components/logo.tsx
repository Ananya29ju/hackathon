'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
    className?: string
    iconOnly?: boolean
    size?: 'sm' | 'md' | 'lg' | 'xl'
    onClick?: () => void
}

export default function Logo({ className, iconOnly = false, size = 'md', onClick }: LogoProps) {
    const sizes = {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
    }

    const textSizes = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-4xl',
        xl: 'text-5xl',
    }

    return (
        <div
            className={cn("flex items-center gap-3 group transition-all duration-300", onClick && "cursor-pointer", className)}
            onClick={onClick}
        >
            <div className={cn("relative flex-shrink-0", sizes[size])}>
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* SVG Icon */}
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10 drop-shadow-lg scale-100 group-hover:scale-110 transition-transform duration-500 ease-out">
                    <defs>
                        <linearGradient id="logo_grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#E11D48" />
                            <stop offset="1" stopColor="#BE185D" />
                        </linearGradient>
                        <filter id="inner_glow" x="0" y="0" width="48" height="48">
                            <feGaussianBlur stdDeviation="1" result="blur" />
                            <feComposite in2="SourceGraphic" operator="arithmetic" k2="-1" k3="1" result="shadow" />
                            <feFlood floodColor="white" floodOpacity="0.4" result="color" />
                            <feComposite in2="shadow" operator="in" result="glow" />
                        </filter>
                    </defs>
                    <circle cx="24" cy="24" r="22" fill="url(#logo_grad)" />
                    <path d="M24 36C24 36 34 30 34 22C34 18 31 15 28 15C26 15 24.5 16.5 24 17.5C23.5 16.5 22 15 20 15C17 15 14 18 14 22C14 30 24 36 24 36Z" fill="white" fillOpacity="0.95" />
                    <circle cx="24" cy="24" r="21" stroke="white" strokeOpacity="0.1" strokeWidth="0.5" />
                </svg>
            </div>

            {!iconOnly && (
                <span className={cn(
                    "font-black tracking-tighter text-foreground group-hover:text-primary transition-colors duration-300",
                    textSizes[size]
                )}>
                    OVIRA
                    <span className="text-primary italic">.</span>
                </span>
            )}
        </div>
    )
}
