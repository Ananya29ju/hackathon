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
<<<<<<< HEAD
    progress?: number // 0 to 100
=======
    isLoggedIn?: boolean
>>>>>>> origin/main
}

export default function Header({
    onStartAssessment,
    userName = 'User',
    onNavigate,
    showNav = true,
<<<<<<< HEAD
    progress
=======
    isLoggedIn = false
>>>>>>> origin/main
}: HeaderProps) {
    const sidebarItems = [
        { icon: User, label: 'Profile', id: 'profile' },
        { icon: Shield, label: 'Wellness Hub', id: 'preventive-care' },
        { icon: Calendar, label: 'Menstrual Health', id: 'menstrual' },
        { icon: Activity, label: 'SheShield Screening', id: 'cancer' },
        { icon: Map, label: 'Heat Map', id: 'heatmap' },
        { icon: PlayCircle, label: 'Educational Videos', id: 'videos' },
        { icon: LogOut, label: 'Logout', id: 'logout' },
    ]

    return (
<<<<<<< HEAD
        <header className="sticky top-0 z-50 bg-glass py-4 px-4 md:px-8 shadow-sm">
            <div className="max-w-6xl mx-auto flex justify-between items-center w-full relative">
=======
        <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-primary/5 py-4 px-4 md:px-8 shadow-sm transition-all duration-500">
            <div className="max-w-6xl mx-auto flex justify-between items-center w-full">
>>>>>>> origin/main
                <div className="flex items-center gap-4">
                    {showNav && onNavigate && onStartAssessment && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
<<<<<<< HEAD
                                <Button variant="ghost" size="icon" className="group/menu hover:bg-primary/10 rounded-full transition-all">
                                    <Menu className="w-6 h-6 text-primary group-hover/menu:rotate-90 transition-transform duration-300" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-64 p-2 rounded-2xl shadow-xl border-primary/10 bg-glass">
                                <DropdownMenuLabel className="px-3 py-2 text-sm font-black text-primary uppercase tracking-widest">Dashboard Navigation</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-primary/10" />
                                <div className="space-y-1">
=======
                                <Button variant="ghost" size="icon" className="hover:bg-primary/20 rounded-full transition-all duration-300 hover:rotate-90">
                                    <Menu className="w-6 h-6 text-primary" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-64 p-2 rounded-[2rem] shadow-2xl border-none glass-card bg-white/80 dark:bg-black/80 backdrop-blur-2xl">
                                <DropdownMenuLabel className="px-4 py-3 text-xs font-black text-primary/60 uppercase tracking-[0.2em]">Dashboard Navigator</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-primary/5" />
                                <div className="space-y-1 mt-2">
>>>>>>> origin/main
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
<<<<<<< HEAD
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
=======
                                                "flex items-center gap-3 cursor-pointer py-3.5 px-4 rounded-2xl transition-all duration-300 focus:bg-primary/10 focus:text-primary hover:translate-x-1",
                                                item.id === 'logout' && "text-destructive focus:text-destructive focus:bg-destructive/10"
                                            )}
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center group-focus:bg-primary/20 transition-colors">
                                                <item.icon className="w-4 h-4 opacity-70" />
                                            </div>
                                            <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                                <DropdownMenuSeparator className="bg-primary/5" />
                                <div className="p-2 mt-2">
                                    <div className="flex items-center gap-3 px-4 py-4 rounded-3xl bg-primary/5 border border-primary/10">
>>>>>>> origin/main
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shadow-inner">
                                            <User className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
<<<<<<< HEAD
                                            <p className="font-black truncate text-foreground text-sm leading-none mb-1">{userName}</p>
                                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">Session Active</p>
=======
                                            <p className="font-black truncate text-foreground text-sm tracking-tight">{userName}</p>
                                            <p className="text-[9px] text-primary/60 font-black uppercase tracking-widest">Health Profile Active</p>
>>>>>>> origin/main
                                        </div>
                                    </div>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <div
                        className="cursor-pointer group flex items-center gap-3"
                        onClick={() => onNavigate?.('landing')}
                    >
<<<<<<< HEAD
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
=======
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-lg shadow-primary/10">
>>>>>>> origin/main
                            <Heart className="w-6 h-6 text-primary" fill="currentColor" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-all duration-300">
                            OVIRA
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
<<<<<<< HEAD
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
=======
                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-11 w-11 rounded-full bg-primary/10 hover:bg-primary/20 hover:scale-105 transition-all p-0 overflow-hidden border-2 border-primary/20 shadow-md">
                                    <div className="flex items-center justify-center h-full w-full text-primary font-black text-lg">
                                        {userName.charAt(0).toUpperCase()}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 p-2 rounded-[2rem] shadow-2xl border-none glass-card bg-white/80 dark:bg-black/80 backdrop-blur-2xl">
                                <DropdownMenuLabel className="px-4 py-3">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-black leading-none">{userName}</p>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-primary/60 italic">Personal Dashboard</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-primary/5" />
                                <DropdownMenuItem
                                    onClick={() => onNavigate?.('profile')}
                                    className="flex items-center gap-3 cursor-pointer py-3.5 px-4 rounded-2xl focus:bg-primary/10 focus:text-primary hover:translate-x-1 transition-all"
                                >
                                    <User className="w-4 h-4 opacity-70" />
                                    <span className="font-bold text-sm">Vital Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onNavigate?.('logout')}
                                    className="flex items-center gap-3 cursor-pointer py-3.5 px-4 rounded-2xl text-destructive focus:text-destructive focus:bg-destructive/10 hover:translate-x-1 transition-all"
                                >
                                    <LogOut className="w-4 h-4 opacity-70" />
                                    <span className="font-bold text-sm">Secure Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login">
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full border-primary/30 text-primary hover:bg-primary hover:text-white px-8 h-10 font-black transition-all shadow-sm hover:shadow-primary/20"
                            >
                                Login
                            </Button>
                        </Link>
                    )}
>>>>>>> origin/main
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
            <div className="max-w-6xl mx-auto px-4 md:px-8 mt-3">
                <p className="text-[9px] font-black text-center text-primary/40 uppercase tracking-[0.3em] bg-primary/5 py-2 rounded-full border border-primary/10">
                    Educational Excellence • Consult Your Physician
                </p>
            </div>
        </header>
    )
}
