import type { Forecast, ForecastFilterParams } from '../types'
import { MOCK_FORECASTS, MOCK_LOCATIONS, getForecasts } from './index'

/**
 * Forecast record enriched with geographic coordinates for map rendering.
 */
export interface MapForecast extends Forecast {
  latitude: number
  longitude: number
}

/**
 * Return filtered forecasts enriched with lat/lon from their Location record.
 * Use this in map components instead of calling getForecasts + getLocationById separately.
 */
export function getMapForecasts(filters?: ForecastFilterParams): MapForecast[] {
  const locationIndex = new Map(MOCK_LOCATIONS.map((l) => [l.id, l]))
  const forecasts = getForecasts(filters)
  const result: MapForecast[] = []
  for (const fc of forecasts) {
    const loc = locationIndex.get(fc.locationId)
    if (!loc) continue
    result.push({ ...fc, latitude: loc.latitude, longitude: loc.longitude })
  }
  return result
}

/**
 * Unique forecast valid-dates present in the dataset, sorted ascending.
 */
export function getMockValidDates(): string[] {
  const dates = new Set(MOCK_FORECASTS.map((fc) => fc.validDate))
  return [...dates].sort()
}
