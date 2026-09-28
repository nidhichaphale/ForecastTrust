import type { HiddenRiskRecord } from '../types'
import { MOCK_FORECASTS } from './forecasts'

/**
 * Hidden-Risk dataset simulating instances of zero or near-zero ensemble spread.
 * Highlights instances where models exhibit false certainty versus genuine stable dry spells.
 */

function generateHiddenRiskRecords(): HiddenRiskRecord[] {
  // Capture explicit zero-spread forecasts plus near-zero low spread forecasts
  const candidates = MOCK_FORECASTS.filter(
    (fc) => fc.zeroSpread || (fc.ensembleSpread <= 1.0 && fc.forecastRainfall <= 2.0)
  )

  let counter = 300

  return candidates.map((fc) => {
    counter++
    const isZeroSpread = fc.zeroSpread || fc.ensembleSpread === 0
    const isZeroForecast = fc.forecastRainfall === 0
    const obs = fc.observedRainfall ?? 0
    const becameBust = fc.bustStatus === 'bust' || obs >= 15.0

    let outcomeType: 'accurate_dry_agreement' | 'hidden_bust_occurrence' | 'marginal_drizzle'
    let hiddenRiskProbability: number
    let notes: string

    if (becameBust) {
      outcomeType = 'hidden_bust_occurrence'
      hiddenRiskProbability = parseFloat((0.68 + (counter % 20) * 0.01).toFixed(2))
      notes = `Overconfident model suppression failed in ${fc.locationName}; unexpected localized convection resulted in ${obs}mm.`
    } else if (obs > 0) {
      outcomeType = 'marginal_drizzle'
      hiddenRiskProbability = 0.22
      notes = `Traced localized precipitation (${obs}mm) within non-catastrophic margin.`
    } else {
      outcomeType = 'accurate_dry_agreement'
      hiddenRiskProbability = 0.05
      notes = `High ensemble consensus correctly anticipated persistent arid/dry inversion.`
    }

    return {
      id: `hr-${counter}`,
      locationId: fc.locationId,
      locationName: fc.locationName,
      state: fc.state,
      region: fc.region,
      validDate: fc.validDate,
      leadDay: fc.leadDay,
      zeroSpreadStatus: isZeroSpread,
      zeroForecastStatus: isZeroForecast,
      ensembleSpread: fc.ensembleSpread,
      forecastRainfall: fc.forecastRainfall,
      observedRainfall: fc.observedRainfall,
      hiddenRiskStatus: becameBust,
      hiddenRiskProbability,
      outcomeType,
      notes,
    }
  })
}

export const MOCK_HIDDEN_RISK_RECORDS: HiddenRiskRecord[] = generateHiddenRiskRecords()
