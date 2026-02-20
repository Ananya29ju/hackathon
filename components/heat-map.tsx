'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { MapPin, Shield, Loader2, AlertCircle } from 'lucide-react'
import supabase from '@/lib/supabaseClient'
import { getRiskCategory } from '@/lib/risk-calculator'

interface AssessmentPoint {
    latitude: number
    longitude: number
    primary_risk: string
    breast_risk_score: number
    ovarian_risk_score: number
    endometrial_risk_score: number
    created_at: string
}

export default function HeatMap() {
    const [points, setPoints] = useState<AssessmentPoint[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchPoints() {
            try {
                const { data, error } = await supabase
                    .from('assessments')
                    .select('latitude, longitude, primary_risk, breast_risk_score, ovarian_risk_score, endometrial_risk_score, created_at')
                    .not('latitude', 'is', null)
                    .not('longitude', 'is', null)

                if (error) throw error
                setPoints(data || [])
            } catch (err) {
                console.error('Error fetching heatmap data:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchPoints()
    }, [])

    const getPointCategory = (p: AssessmentPoint): 'low' | 'moderate' | 'high' => {
        // Handle legacy/test data where primary_risk is directly the level
        const risk = p.primary_risk?.toLowerCase()
        if (risk === 'high' || risk === 'moderate' || risk === 'low') return risk as any

        // Calculate based on scores
        let score = 0
        if (risk === 'breast') score = p.breast_risk_score || 0
        else if (risk === 'ovarian') score = p.ovarian_risk_score || 0
        else if (risk === 'endometrial') score = p.endometrial_risk_score || 0

        return getRiskCategory(score)
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium italic">Loading regional health data...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid md:grid-cols-4 gap-4">
                <Card className="p-6 bg-primary/5 border-none rounded-[1.5rem] flex flex-col items-center justify-center text-center space-y-2">
                    <span className="text-4xl font-black text-primary">{points.length}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary/60">Data Points</span>
                </Card>
                <Card className="p-6 bg-pink-500/5 border-none rounded-[1.5rem] flex flex-col items-center justify-center text-center space-y-2">
                    <span className="text-4xl font-black text-pink-600">
                        {points.filter(p => getPointCategory(p) === 'high').length}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-pink-600/60">High Risk Areas</span>
                </Card>
                <Card className="p-6 bg-amber-500/5 border-none rounded-[1.5rem] flex flex-col items-center justify-center text-center space-y-2">
                    <span className="text-4xl font-black text-amber-600">
                        {points.filter(p => getPointCategory(p) === 'moderate').length}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-600/60">Moderate Risk</span>
                </Card>
                <Card className="p-6 bg-green-500/5 border-none rounded-[1.5rem] flex flex-col items-center justify-center text-center space-y-2">
                    <span className="text-4xl font-black text-green-600">
                        {points.filter(p => getPointCategory(p) === 'low').length}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-green-600/60">Healthy Zones</span>
                </Card>
            </div>

            <Card className="relative overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white/50 dark:bg-black/40 backdrop-blur-xl h-[500px] flex items-center justify-center">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

                {/* Placeholder for real map initialization */}
                <div className="text-center space-y-6 p-8 relative z-10">
                    <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-foreground">Regional Health Map</h3>
                        <p className="text-muted-foreground font-medium max-w-md mx-auto italic">
                            Mapping {points.length} assessment results across coordinates.
                            Install a map provider like Leaflet or Google Maps to visualize detailed clusters.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        {points.slice(0, 5).map((point, i) => {
                            const category = getPointCategory(point)
                            return (
                                <div key={i} className="px-4 py-2 rounded-full bg-white/80 dark:bg-black/80 border border-primary/10 shadow-sm flex items-center gap-2 text-xs font-bold">
                                    <div className={`w-2 h-2 rounded-full ${category === 'high' ? 'bg-red-500' :
                                        category === 'moderate' ? 'bg-amber-500' : 'bg-green-500'
                                        }`} />
                                    <span>{point.latitude.toFixed(2)}, {point.longitude.toFixed(2)}</span>
                                </div>
                            )
                        })}
                        {points.length > 5 && <span className="text-xs font-bold text-muted-foreground self-center">+{points.length - 5} more</span>}
                    </div>
                </div>

                {/* Decorative elements representing heatmap clusters */}
                {points.map((point, i) => {
                    const category = getPointCategory(point)
                    return (
                        <div
                            key={i}
                            className={`absolute w-32 h-32 rounded-full blur-[40px] opacity-20 animate-pulse pointer-events-none ${category === 'high' ? 'bg-red-500' :
                                category === 'moderate' ? 'bg-amber-500' : 'bg-green-500'
                                }`}
                            style={{
                                top: `${(point.latitude % 1) * 100}%`,
                                left: `${(point.longitude % 1) * 100}%`,
                                animationDelay: `${i * 0.5}s`
                            }}
                        />
                    )
                })}
            </Card>

            <Card className="p-8 rounded-[2rem] border-none bg-primary/5 flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                    <h4 className="font-bold text-foreground">Data Privacy Note</h4>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed italic">
                        Location data is generalized to protect user privacy. Individual addresses are never stored; only atmospheric regional prevalence is mapped.
                    </p>
                </div>
            </Card>
        </div>
    )
}
