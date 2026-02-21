'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, Popup, useMap, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface AssessmentPoint {
    latitude: number
    longitude: number
    primary_risk: string
    menstrual_score: number
    created_at: string
    breast_risk_score?: number
    ovarian_risk_score?: number
    endometrial_risk_score?: number
}

interface IndiaMapProps {
    points: AssessmentPoint[]
    getPointCategory: (p: AssessmentPoint) => 'low' | 'moderate' | 'high' | 'critical'
}

function MapController() {
    const map = useMap()
    return null
}

export default function IndiaMap({ points, getPointCategory }: IndiaMapProps) {
    const [geoFileData, setGeoFileData] = useState<any>(null)
    const center: [number, number] = [20.5937, 78.9629]

    useEffect(() => {
        fetch('/india_states.geojson')
            .then(res => res.json())
            .then(data => setGeoFileData(data))
            .catch(err => console.error('Error loading geojson:', err))
    }, [])

    // Map state names to risk levels based on points
    const stateRisks = React.useMemo(() => {
        const risks: Record<string, number> = {}
        const counts: Record<string, number> = {}

        // Simple heuristic: match points to states via proximity or labels if available
        // For now, we'll use the points provided to determine state-level "heat"
        points.forEach(p => {
            // If the primary_risk contains a state name (from our regional trends logic)
            const stateMatch = p.primary_risk.match(/\((.*?)\)/)
            if (stateMatch && stateMatch[1]) {
                const stateName = stateMatch[1]
                risks[stateName] = (risks[stateName] || 0) + p.menstrual_score
                counts[stateName] = (counts[stateName] || 0) + 1
            }
        })

        const averages: Record<string, number> = {}
        Object.keys(risks).forEach(state => {
            averages[state] = risks[state] / counts[state]
        })
        return averages
    }, [points])

    const getStyle = (feature: any) => {
        return {
            fillColor: 'transparent',
            weight: 1,
            opacity: 0.3,
            color: '#94a3b8', // Slate 400
            fillOpacity: 0
        }
    }

    const onEachFeature = (feature: any, layer: any) => {
        layer.on({
            mouseover: (e: any) => {
                const l = e.target
                l.setStyle({ color: '#6366f1', opacity: 1, weight: 1.5 })
            },
            mouseout: (e: any) => {
                const l = e.target
                l.setStyle({ color: '#94a3b8', opacity: 0.3, weight: 1 })
            }
        })
    }

    return (
        <MapContainer
            center={center}
            zoom={5}
            style={{ height: '100%', width: '100%', borderRadius: '2rem' }}
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; CARTO'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <MapController />

            {geoFileData && (
                <GeoJSON
                    data={geoFileData}
                    style={getStyle}
                    onEachFeature={onEachFeature}
                />
            )}

            {/* Localized Hotspot Highlighting */}
            {points.map((point, i) => {
                const category = getPointCategory(point)
                const color = category === 'critical' ? '#e11d48' : // Deep Pink (Rose 600)
                    category === 'high' ? '#f472b6' :           // Pink (Pink 400)
                        category === 'moderate' ? '#fdba74' :   // Peach (Orange 300)
                            '#86efac'                           // Pista (Green 300)

                return (
                    <React.Fragment key={i}>
                        {/* Inner Core */}
                        <Circle
                            center={[point.latitude, point.longitude]}
                            pathOptions={{
                                color: 'white',
                                fillColor: color,
                                fillOpacity: 0.9,
                                weight: 2
                            }}
                            radius={8000}
                        >
                            <Popup>
                                <div className="p-2 font-sans">
                                    <h4 className="font-black text-sm uppercase tracking-tight" style={{ color }}>{category} Area</h4>
                                    <p className="text-[10px] text-muted-foreground italic mb-2">Impact Zone: {point.latitude.toFixed(2)}, {point.longitude.toFixed(2)}</p>
                                    <div className="flex justify-between items-center text-[11px] font-bold">
                                        <span>HEALTH PRIORITY</span>
                                        <span style={{ color }}>{point.menstrual_score.toFixed(1)}%</span>
                                    </div>
                                </div>
                            </Popup>
                        </Circle>

                        {/* Outer Glow / Area Highlight */}
                        <Circle
                            center={[point.latitude, point.longitude]}
                            pathOptions={{
                                color: 'transparent',
                                fillColor: color,
                                fillOpacity: 0.2,
                                weight: 0
                            }}
                            radius={45000}
                        />

                        {/* Secondary Interactive Ring */}
                        <Circle
                            center={[point.latitude, point.longitude]}
                            pathOptions={{
                                color: color,
                                fillColor: 'transparent',
                                weight: 1.5,
                                dashArray: '8, 12',
                                opacity: 0.3
                            }}
                            radius={65000}
                        />
                    </React.Fragment>
                )
            })}
        </MapContainer>
    )
}
