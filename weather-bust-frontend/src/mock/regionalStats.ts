import type { RegionalStatistic, RegionId } from '../types'
import { MOCK_REGIONS } from './regions'
import { MOCK_FORECASTS } from './forecasts'

/**
 * Regional aggregate statistics computed directly from underlying forecast records.
 * Ensures consistent alignment across regional overviews, maps, and comparative charts.
 */

function computeRegionalStatistics(): RegionalStatistic[] {
  return MOCK_REGIONS.map((regionDef) => {
    const regionForecasts = MOCK_FORECASTS.filter((fc) => fc.region === regionDef.id)
    const count = regionForecasts.length

    if (count === 0) {
      return {
        region: regionDef.id,
        forecastCount: 0,
        bustCount: 0,
        bustRate: 0,
        avgForecastRainfall: 0,
        avgObservedRainfall: 0,
        avgError: 0,
        avgRiskProbability: 0,
        highRiskCount: 0,
        topAffectedState: 'N/A',
      }
    }

    const bustForecasts = regionForecasts.filter((fc) => fc.bustStatus === 'bust')
    const highRiskForecasts = regionForecasts.filter(
      (fc) => fc.riskLevel === 'high' || fc.riskLevel === 'severe'
    )

    const sumFcRain = regionForecasts.reduce((acc, fc) => acc + fc.forecastRainfall, 0)
    const sumObsRain = regionForecasts.reduce((acc, fc) => acc + fc.observedRainfall, 0)
    const sumAbsError = regionForecasts.reduce((acc, fc) => acc + Math.abs(fc.forecastError), 0)
    const sumRisk = regionForecasts.reduce((acc, fc) => acc + fc.bustProbability, 0)

    // Calculate top affected state in this region
    const stateBustCounts: Record<string, number> = {}
    bustForecasts.forEach((fc) => {
      stateBustCounts[fc.state] = (stateBustCounts[fc.state] || 0) + 1
    })

    let topState = 'Various'
    let maxStateCount = -1
    Object.entries(stateBustCounts).forEach(([state, bCount]) => {
      if (bCount > maxStateCount) {
        maxStateCount = bCount
        topState = state
      }
    })

    return {
      region: regionDef.id as RegionId,
      forecastCount: count,
      bustCount: bustForecasts.length,
      bustRate: parseFloat(((bustForecasts.length / count) * 100).toFixed(1)),
      avgForecastRainfall: parseFloat((sumFcRain / count).toFixed(1)),
      avgObservedRainfall: parseFloat((sumObsRain / count).toFixed(1)),
      avgError: parseFloat((sumAbsError / count).toFixed(1)),
      avgRiskProbability: parseFloat((sumRisk / count).toFixed(2)),
      highRiskCount: highRiskForecasts.length,
      topAffectedState: topState,
    }
  })
}

export const MOCK_REGIONAL_STATS: RegionalStatistic[] = computeRegionalStatistics()
