'use client'

import { Button } from '@/components/ui/button'
import { Heart, User, Calendar, Activity, Map, PlayCircle, LogOut, Menu, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface HeaderProps {
    onStartAssessment?: (type: 'menstrual' | 'cancer' | 'both') => void
    userName?: string
    onNavigate?: (view: string) => void
    showNav?: boolean
    progress?: number // 0 to 100
}

export default function Header({
    onStartAssessment,
    userName = 'Ananya',
    onNavigate,
    showNav = true,
    progress
}: HeaderProps) {
    const sidebarItems = [
        { icon: User, label: 'Profile', id: 'profile' },
        { icon: Shield, label: 'Wellness Hub', id: 'preventive-care' },
        { icon: Calendar, label: 'Menstrual Health', id: 'menstrual' },
        { icon: Activity, label: 'Cancer Validation', id: 'cancer' },
        { icon: Map, label: 'Heat Map', id: 'heatmap' },
        { icon: PlayCircle, label: 'Educational Videos', id: 'videos' },
        { icon: LogOut, label: 'Logout', id: 'logout' },
    ]

    return (
        <header className="sticky top-0 z-50 bg-glass py-4 px-4 md:px-8 shadow-sm">
            <div className="max-w-6xl mx-auto flex justify-between items-center w-full relative">
                <div className="flex items-center gap-4">
                    {showNav && onNavigate && onStartAssessment && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="group/menu hover:bg-primary/10 rounded-full transition-all">
                                    <Menu className="w-6 h-6 text-primary group-hover/menu:rotate-90 transition-transform duration-300" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-64 p-2 rounded-2xl shadow-xl border-primary/10 bg-glass">
                                <DropdownMenuLabel className="px-3 py-2 text-sm font-black text-primary uppercase tracking-widest">Dashboard Navigation</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-primary/10" />
                                <div className="space-y-1">
                                    {sidebarItems.map((item) => (
                                        <DropdownMenuItem
                                            key={item.id}
                                            onClick={() => {
                                                if (item.id === 'menstrual' || item.id === 'cancer') {
                                                    onStartAssessment(item.id as 'menstrual' | 'cancer')
                                                } else {
                                                    onNavigate(item.id)
                                                }
                                            }}
                                            className={cn(
                                                "flex items-center gap-3 cursor-pointer py-3.5 px-4 rounded-xl transition-all duration-300 focus:bg-primary focus:text-white group",
                                                item.id === 'logout' && "text-destructive focus:text-destructive focus:bg-destructive/10"
                                            )}
                                        >
                                            <item.icon className="w-5 h-5 opacity-70 group-focus:scale-110 transition-transform" />
                                            <span className="font-bold">{item.label}</span>
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                                <DropdownMenuSeparator className="bg-primary/10" />
                                <div className="p-2">
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/10">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shadow-inner">
                                            <User className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black truncate text-foreground text-sm leading-none mb-1">{userName}</p>
                                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">Session Active</p>
                                        </div>
                                    </div>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <div
                        className="cursor-pointer group flex items-center gap-2"
                        onClick={() => onNavigate?.('landing')}
                    >
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                            <Heart className="w-6 h-6 text-primary" fill="currentColor" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">
                            OVIRA
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {onNavigate && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigate('preventive-care')}
                            className="hidden md:flex items-center gap-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5 px-4 font-black transition-all"
                        >
                            <Shield className="w-4 h-4" />
                            Preventive
                        </Button>
                    )}
                    <Link href="/login">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white px-6 font-black transition-all active:scale-95"
                        >
                            Login
                        </Button>
                    </Link>
                </div>

                {/* Progress Bar */}
                {progress !== undefined && (
                    <div className="absolute -bottom-4 left-0 w-full h-1 bg-primary/10">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-lavender-500 transition-all duration-700 ease-in-out relative shadow-[0_0_10px_oklch(0.7_0.14_0)]"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute top-0 right-0 h-full w-4 bg-white/40 blur-sm" />
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}
