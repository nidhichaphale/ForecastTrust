import type { BustEvent, RiskLevel } from '../types'
import { MOCK_FORECASTS } from './forecasts'

/**
 * Bust events dynamically derived from verified forecast records with severe/high forecast busts.
 * Strictly guarantees that every referenced forecastId exists in MOCK_FORECASTS.
 */

function generateBustEvents(): BustEvent[] {
  // Filter forecasts that experienced significant busts
  const qualifyingForecasts = MOCK_FORECASTS.filter(
    (fc) => fc.bustStatus === 'bust' && (fc.riskLevel === 'high' || fc.riskLevel === 'severe')
  )

  let eventCounter = 200

  return qualifyingForecasts.map((fc) => {
    eventCounter++
    const error = fc.forecastError
    let bustType: 'excess_underforecast' | 'deficit_overforecast' | 'unpredicted_convective'
    let summary: string

    if (fc.zeroSpread) {
      bustType = 'unpredicted_convective'
      summary = `Sudden unmodeled convective precipitation triggered in ${fc.locationName}; ensemble predicted zero spread.`
    } else if (error > 0) {
      bustType = 'excess_underforecast'
      summary = `Severe precipitation underforecast in ${fc.locationName} (${error > 50 ? 'Extremely Severe' : 'Elevated'} discrepancy: +${error}mm).`
    } else {
      bustType = 'deficit_overforecast'
      summary = `False positive overforecast in ${fc.locationName}; observed shortfall of ${Math.abs(error)}mm.`
    }

    const severity: RiskLevel = Math.abs(error) > 50 || fc.bustProbability > 0.85 ? 'severe' : 'high'

    return {
      id: `bust-ev-${eventCounter}`,
      forecastId: fc.id,
      locationId: fc.locationId,
      locationName: fc.locationName,
      state: fc.state,
      region: fc.region,
      initDate: fc.initDate,
      validDate: fc.validDate,
      leadDay: fc.leadDay,
      forecastRainfall: fc.forecastRainfall,
      observedRainfall: fc.observedRainfall,
      error,
      bustProbability: fc.bustProbability,
      severity,
      detectionConfidence: fc.confidence,
      bustType,
      summary,
    }
  })
}

export const MOCK_BUST_EVENTS: BustEvent[] = generateBustEvents()
