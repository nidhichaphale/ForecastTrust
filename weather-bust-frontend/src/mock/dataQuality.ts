import type { DataQualityStatistic } from '../types'
import { MOCK_FORECASTS } from './forecasts'
import { MOCK_LOCATIONS } from './locations'

/**
 * Data Quality and Pipeline Integrity metrics for the Data Explorer and ingestion health audit.
 */

function computeDataQuality(): DataQualityStatistic {
  const total = MOCK_FORECASTS.length
  const zeroForecasts = MOCK_FORECASTS.filter((fc) => fc.forecastRainfall === 0).length
  const zeroSpreadCases = MOCK_FORECASTS.filter((fc) => fc.zeroSpread).length
  const bustLabels = MOCK_FORECASTS.filter((fc) => fc.bustStatus === 'bust').length
  const missingObservations = MOCK_FORECASTS.filter((fc) => fc.hasObservation === false || fc.observedRainfall < 0).length
  const validRecords = total - missingObservations
  const completenessRate = parseFloat(((validRecords / total) * 100).toFixed(1))
  const missingPercentage = parseFloat(((missingObservations / total) * 100).toFixed(1))

  return {
    totalRecords: total,
    validRecords,
    missingValues: missingObservations,
    missingPercentage,
    zeroForecasts,
    zeroSpreadCases,
    bustLabelsCount: bustLabels,
    dateCoverageStart: '2026-08-01',
    dateCoverageEnd: '2026-08-25',
    totalLocations: MOCK_LOCATIONS.length,
    completenessRate,
  }
}

export const MOCK_DATA_QUALITY: DataQualityStatistic = computeDataQuality()
