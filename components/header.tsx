'use client'

import { Button } from '@/components/ui/button'
import { Heart, User, Calendar, Activity, Map, PlayCircle, LogOut, Menu } from 'lucide-react'
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
    isLoggedIn?: boolean
}

export default function Header({
    onStartAssessment,
    userName = 'User',
    onNavigate,
    showNav = true,
    isLoggedIn = false
}: HeaderProps) {
    const sidebarItems = [
        { icon: User, label: 'Profile', id: 'profile' },
        { icon: Calendar, label: 'Menstrual Health', id: 'menstrual' },
        { icon: Activity, label: 'SheShield Screening', id: 'cancer' },
        { icon: Map, label: 'Heat Map', id: 'heatmap' },
        { icon: PlayCircle, label: 'Educational Videos', id: 'videos' },
        { icon: LogOut, label: 'Logout', id: 'logout' },
    ]

    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 py-4 px-4 md:px-8 shadow-sm">
            <div className="max-w-6xl mx-auto flex justify-between items-center w-full">
                <div className="flex items-center gap-4">
                    {showNav && onNavigate && onStartAssessment && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:bg-primary/10 rounded-full transition-colors">
                                    <Menu className="w-6 h-6 text-primary" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-64 p-2 rounded-2xl shadow-xl border-primary/10">
                                <DropdownMenuLabel className="px-3 py-2 text-sm font-bold text-primary/80 uppercase tracking-widest">Dashboard</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-primary/5" />
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
                                                "flex items-center gap-3 cursor-pointer py-3 px-4 rounded-xl transition-all duration-200 focus:bg-primary/10 focus:text-primary",
                                                item.id === 'logout' && "text-destructive focus:text-destructive focus:bg-destructive/10"
                                            )}
                                        >
                                            <item.icon className="w-5 h-5 opacity-70" />
                                            <span className="font-semibold">{item.label}</span>
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                                <DropdownMenuSeparator className="bg-primary/5" />
                                <div className="p-2">
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/50 border border-secondary">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shadow-inner">
                                            <User className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold truncate text-foreground text-sm">{userName}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Health Profile Active</p>
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
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Heart className="w-6 h-6 text-primary" fill="currentColor" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">
                            OVIRA
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-all p-0 overflow-hidden border border-primary/20">
                                    <div className="flex items-center justify-center h-full w-full text-primary font-black text-lg">
                                        {userName.charAt(0).toUpperCase()}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl border-primary/10">
                                <DropdownMenuLabel className="px-3 py-2">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-bold leading-none">{userName}</p>
                                        <p className="text-xs leading-none text-muted-foreground italic">Health Profile</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-primary/5" />
                                <DropdownMenuItem
                                    onClick={() => onNavigate?.('profile')}
                                    className="flex items-center gap-2 cursor-pointer py-2.5 px-3 rounded-xl focus:bg-primary/10 focus:text-primary"
                                >
                                    <User className="w-4 h-4 opacity-70" />
                                    <span className="font-semibold text-sm">My Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onNavigate?.('logout')}
                                    className="flex items-center gap-2 cursor-pointer py-2.5 px-3 rounded-xl text-destructive focus:text-destructive focus:bg-destructive/10"
                                >
                                    <LogOut className="w-4 h-4 opacity-70" />
                                    <span className="font-semibold text-sm">Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login">
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white px-6 font-bold transition-all"
                            >
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
            <div className="max-w-6xl mx-auto px-4 md:px-8 mt-2">
                <p className="text-[10px] md:text-xs font-bold text-center text-muted-foreground/60 uppercase tracking-widest bg-muted/30 py-1.5 rounded-full border border-border/20">
                    Important: Our tools are educational. Always consult a healthcare professional for clinical diagnosis.
                </p>
            </div>
        </header>
    )
}
