/**
 * Leaflet CSS must be imported before any react-leaflet component.
 */
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet'
import type { MapForecast } from '../../mock/mapHelpers'

// Risk level → marker fill color — saturated to stand out on terrain basemap
const RISK_COLOR: Record<string, string> = {
  low: '#22c55e',       // green-500
  moderate: '#eab308',  // yellow-500
  high: '#ea580c',      // orange-600
  severe: '#dc2626',    // red-600
}

// Stroke (border) color for contrast on terrain map
const RISK_STROKE: Record<string, string> = {
  low: '#15803d',       // green-700
  moderate: '#a16207',  // yellow-700
  high: '#9a3412',      // orange-800
  severe: '#991b1b',    // red-800
}

const RISK_OPACITY: Record<string, number> = {
  low: 0.85,
  moderate: 0.90,
  high: 0.95,
  severe: 1.0,
}

const RISK_RADIUS: Record<string, number> = {
  low: 7,
  moderate: 9,
  high: 12,
  severe: 15,
}

/** Sub-component that resets map view to India */
function IndiaViewReset({ trigger }: { trigger: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([22.5937, 78.9629], 5, { duration: 0.9 })
  }, [trigger, map])
  return null
}

interface RiskMapProps {
  forecasts: MapForecast[]
  selectedId: string | null
  onSelect: (fc: MapForecast) => void
  resetTrigger: number
}

const RISK_PRIORITY: Record<string, number> = { severe: 4, high: 3, moderate: 2, low: 1 }

export const RiskMap: React.FC<RiskMapProps> = ({
  forecasts,
  selectedId,
  onSelect,
  resetTrigger,
}) => {
  // Deduplicate: one marker per location — show highest-risk forecast
  const dedupedForecasts = useMemo<MapForecast[]>(() => {
    const byLocation = new Map<string, MapForecast>()
    for (const fc of forecasts) {
      const existing = byLocation.get(fc.locationId)
      if (!existing || (RISK_PRIORITY[fc.riskLevel] ?? 0) > (RISK_PRIORITY[existing.riskLevel] ?? 0)) {
        byLocation.set(fc.locationId, fc)
      }
    }
    return Array.from(byLocation.values())
  }, [forecasts])

  return (
    <MapContainer
      center={[22.5937, 78.9629]}
      zoom={5}
      minZoom={4}
      maxZoom={10}
      style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
      zoomControl={true}
      attributionControl={true}
    >
      {/*
        ESRI World Topo Map — free, no API key required.
        Shows terrain elevation, country/state borders, city labels.
        Professional weather-map style similar to AccuWeather.
      */}
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong)"
        maxZoom={19}
      />

      <IndiaViewReset trigger={resetTrigger} />

      {dedupedForecasts.map((fc) => {
        const isSelected = fc.id === selectedId
        const fillColor = RISK_COLOR[fc.riskLevel] ?? '#94a3b8'
        const strokeColor = isSelected ? '#ffffff' : (RISK_STROKE[fc.riskLevel] ?? '#475569')
        const baseRadius = RISK_RADIUS[fc.riskLevel] ?? 8
        const radius = isSelected ? baseRadius + 4 : baseRadius

        return (
          <CircleMarker
            key={`${fc.locationId}-${fc.id}`}
            center={[fc.latitude, fc.longitude]}
            radius={radius}
            pathOptions={{
              color: strokeColor,
              fillColor,
              weight: isSelected ? 3 : 2,
              fillOpacity: RISK_OPACITY[fc.riskLevel] ?? 0.88,
              opacity: 1,
            }}
            eventHandlers={{
              click: () => onSelect(fc),
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -(radius + 6)]}
              opacity={0.97}
            >
              <div style={{ fontFamily: 'inherit', minWidth: 160, padding: '2px 0' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 4 }}>
                  {fc.locationName}, {fc.state}
                </div>
                <div style={{ fontSize: 11, color: '#475569', display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                  <span>Risk</span>
                  <span style={{ color: fillColor, fontWeight: 700, textTransform: 'capitalize' }}>
                    {fc.riskLevel}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#475569', display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                  <span>Bust Prob</span>
                  <span style={{ color: '#0f172a', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                    {(fc.bustProbability * 100).toFixed(0)}%
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#475569', display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                  <span>Lead Day</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>D+{fc.leadDay}</span>
                </div>
                {fc.bustStatus === 'bust' && (
                  <div style={{
                    marginTop: 5,
                    fontSize: 10,
                    color: '#dc2626',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    borderTop: '1px solid #fecaca',
                    paddingTop: 4,
                  }}>
                    ⚠ BUST DETECTED
                  </div>
                )}
              </div>
            </Tooltip>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
