import type { Alert } from '../types'
import { MOCK_BUST_EVENTS } from './bustEvents'
import { MOCK_FORECASTS } from './forecasts'

/**
 * Weather bust alerts for early warning, operational triage, and event tracking.
 * Strictly references valid forecast, bust event, and location IDs.
 */

function generateAlerts(): Alert[] {
  const alerts: Alert[] = []

  // 1. Primary alerts based on verified bust events
  MOCK_BUST_EVENTS.slice(0, 24).forEach((event, index) => {
    const isUnread = index < 8
    const isResolved = index > 15
    const isAcknowledged = !isUnread && !isResolved

    let alertType: Alert['alertType']
    let triggerMetric = 'Signed Forecast Error'
    let triggerValue = `${event.error > 0 ? '+' : ''}${event.error} mm`
    let threshold = 'Threshold: Error ≥ 25 mm'

    if (event.bustType === 'unpredicted_convective') {
      alertType = 'hidden_risk_zero_spread'
      triggerMetric = 'Zero Spread False Certainty'
      triggerValue = `Obs: ${event.observedRainfall} mm, Spread: 0.0 mm`
      threshold = 'Threshold: Obs ≥ 15 mm with Spread ≤ 1.0 mm'
    } else if (event.severity === 'severe') {
      alertType = 'severe_forecast_bust'
      threshold = 'Threshold: Error ≥ 35 mm or Prob ≥ 85%'
    } else if (Math.abs(event.error) > 40) {
      alertType = 'flash_convective_discrepancy'
      triggerMetric = 'Mesoscale Convective Discrepancy'
      threshold = 'Threshold: Error ≥ 40 mm'
    } else {
      alertType = 'extreme_ensemble_divergence'
      triggerMetric = 'Ensemble Spread Variance'
      triggerValue = `${event.error > 0 ? '+' : ''}${event.error} mm`
      threshold = 'Threshold: Multi-model Divergence'
    }

    const errorSign = event.error > 0 ? `+${event.error}` : `${event.error}`
    const message = `Verification bust detected for ${event.locationName} (${event.state}) at Lead Day ${event.leadDay}: ${errorSign} mm error (Forecast: ${event.forecastRainfall} mm, Observed: ${event.observedRainfall} mm). Model Bust Prob: ${(event.bustProbability * 100).toFixed(0)}%.`

    const status: Alert['status'] = isResolved ? 'resolved' : isAcknowledged ? 'acknowledged' : 'new'

    alerts.push({
      id: `alt-${100 + index}`,
      timestamp: `${event.validDate}T06:30:00Z`,
      locationId: event.locationId,
      locationName: event.locationName,
      state: event.state,
      region: event.region,
      alertType,
      severity: event.severity,
      message,
      relatedForecastId: event.forecastId,
      relatedBustEventId: event.id,
      isRead: !isUnread,
      isResolved,
      status,
      acknowledgedAt: isAcknowledged || isResolved ? `${event.validDate}T08:15:00Z` : undefined,
      resolvedAt: isResolved ? `${event.validDate}T12:00:00Z` : undefined,
      validDate: event.validDate,
      leadDay: event.leadDay,
      triggerMetric,
      triggerValue,
      threshold,
    })
  })

  // 2. Advance Forecast High-Risk Alerts (derived from advance forecasts with high bust probability)
  const highRiskAdvanceForecasts = MOCK_FORECASTS.filter(
    (fc) => fc.bustProbability >= 0.70 && fc.leadDay <= 5 && !alerts.some((a) => a.relatedForecastId === fc.id)
  ).slice(0, 8)

  highRiskAdvanceForecasts.forEach((fc, idx) => {
    alerts.push({
      id: `alt-20${idx}`,
      timestamp: `${fc.initDate}T05:00:00Z`,
      locationId: fc.locationId,
      locationName: fc.locationName,
      state: fc.state,
      region: fc.region,
      alertType: 'high_bust_risk',
      severity: fc.bustProbability >= 0.80 ? 'severe' : 'high',
      message: `Elevated bust probability (${(fc.bustProbability * 100).toFixed(0)}%) flagged for ${fc.locationName} (${fc.region}) at Lead Day D+${fc.leadDay}. Model confidence: ${(fc.confidence * 100).toFixed(0)}%.`,
      relatedForecastId: fc.id,
      isRead: idx > 3,
      isResolved: false,
      status: idx > 3 ? 'acknowledged' : 'new',
      acknowledgedAt: idx > 3 ? `${fc.initDate}T07:20:00Z` : undefined,
      validDate: fc.validDate,
      leadDay: fc.leadDay,
      triggerMetric: 'Predicted Bust Probability',
      triggerValue: `${(fc.bustProbability * 100).toFixed(0)}%`,
      threshold: 'Threshold: Probability ≥ 65%',
    })
  })

  // 3. Data Quality Ingest Gap Alerts (derived from forecasts with missing observations)
  const missingObsForecasts = MOCK_FORECASTS.filter(
    (fc) => (fc.dataStatus === 'missing_observation' || fc.hasObservation === false) && !alerts.some((a) => a.relatedForecastId === fc.id)
  ).slice(0, 6)

  missingObsForecasts.forEach((fc, idx) => {
    alerts.push({
      id: `alt-30${idx}`,
      timestamp: `${fc.validDate}T14:00:00Z`,
      locationId: fc.locationId,
      locationName: fc.locationName,
      state: fc.state,
      region: fc.region,
      alertType: 'data_quality_missing_observation',
      severity: idx < 2 ? 'high' : 'moderate',
      message: `Telemetry ingest latency exceeded for ${fc.locationName} (${fc.state}). Valid date ${fc.validDate} observation pending ground-truth ingest past 24h window.`,
      relatedForecastId: fc.id,
      isRead: idx > 1,
      isResolved: idx >= 4,
      status: idx >= 4 ? 'resolved' : idx > 1 ? 'acknowledged' : 'new',
      acknowledgedAt: idx > 1 ? `${fc.validDate}T16:00:00Z` : undefined,
      resolvedAt: idx >= 4 ? `${fc.validDate}T18:30:00Z` : undefined,
      validDate: fc.validDate,
      leadDay: fc.leadDay,
      triggerMetric: 'Observation Ingest Latency',
      triggerValue: 'Observation Pending (>24h SLA)',
      threshold: 'Ingest SLA: 24 Hours',
    })
  })

  // Sort descending by timestamp
  return alerts.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

export const MOCK_ALERTS: Alert[] = generateAlerts()
