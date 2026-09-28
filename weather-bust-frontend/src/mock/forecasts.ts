import type { Forecast, RiskLevel, BustStatus } from '../types'
import { MOCK_LOCATIONS } from './locations'

/**
 * Deterministic generation of realistic meteorological forecasts across Indian locations.
 * Incorporates realistic monsoon climatology, lead-day error growth, and calibrated bust probabilities.
 */

// Selected dates across an active monsoon window
const BASE_DATES = [
  '2026-08-01',
  '2026-08-03',
  '2026-08-05',
  '2026-08-08',
  '2026-08-10',
  '2026-08-12',
  '2026-08-15',
]

// Specific designated bust scenario targets for deterministic referential integrity
const DESIGNATED_BUSTS = new Set([
  'loc-mum:2026-08-03:3', // Mumbai coastal convective bust lead day 3
  'loc-mng:2026-08-05:2', // Mangaluru orographic extreme bust lead day 2
  'loc-gau:2026-08-01:4', // Guwahati Brahmaputra depression bust lead day 4
  'loc-ccu:2026-08-08:5', // Kolkata Bay of Bengal cyclonic surge lead day 5
  'loc-bpl:2026-08-10:6', // Bhopal central trough bifurcation lead day 6
  'loc-del:2026-08-12:3', // Delhi urban flash convective bust lead day 3
  'loc-koc:2026-08-03:4', // Kochi monsoonal surge bust lead day 4
  'loc-pne:2026-08-05:5', // Pune rainshadow breach lead day 5
  'loc-bbs:2026-08-08:3', // Bhubaneswar coastal squall bust lead day 3
  'loc-rpr:2026-08-10:7', // Raipur trough shift bust lead day 7
  'loc-srt:2026-08-03:2', // Surat Tapi basin squall bust lead day 2
  'loc-dhn:2026-08-12:4', // Dehradun cloudburst trigger lead day 4
])

// Zero-spread test cases (ensemble overconfidence & dry agreement)
const HIDDEN_BUST_CASES = new Set([
  'loc-ahd:2026-08-08:4', // Ahmedabad: West, D+4, localized convective burst
  'loc-vns:2026-08-10:3', // Varanasi: Central, D+3, trough rain
  'loc-blr:2026-08-03:2', // Bengaluru: South, D+2, surprise evening thunderstorm
  'loc-hyd:2026-08-12:5', // Hyderabad: South, D+5, easterly wave intrusion
  'loc-gau:2026-08-05:1', // Guwahati: Northeast, D+1, sudden orographic burst
  'loc-ccu:2026-08-15:4', // Kolkata: East, D+4, coastal squall
  'loc-bpl:2026-08-01:7', // Bhopal: Central, D+7, monsoon trough shift
  'loc-pne:2026-08-10:3', // Pune: West, D+3, Western Ghats breach
  'loc-jpr:2026-08-08:10', // Jaipur: North, D+10, Western disturbance burst
])

const MARGINAL_DRIZZLE_CASES = new Set([
  'loc-pat:2026-08-01:1', // Patna: East, D+1, light drizzle
  'loc-ngp:2026-08-15:5', // Nagpur: West, D+5, localized showers
  'loc-chd:2026-08-08:3', // Chandigarh: North, D+3, trace precipitation
])

const ZERO_SPREAD_DRY_CASES = new Set([
  'loc-del:2026-08-05:3', // Delhi: North, D+3, verified dry spell
  'loc-jdp:2026-08-01:2', // Jodhpur: West, D+2, arid consensus
  'loc-jdp:2026-08-05:5', // Jodhpur: West, D+5, arid consensus
  'loc-rnc:2026-08-15:2', // Ranchi: East, D+2, clear dry break
  'loc-che:2026-08-08:1', // Chennai: South, D+1, rainshadow dry consensus
  'loc-rpr:2026-08-03:4', // Raipur: Central, D+4, break-monsoon condition
  'loc-shl:2026-08-12:7', // Shillong: Northeast, D+7, high ridge stability
  'loc-gwa:2026-08-10:2', // Gwalior: Central, D+2, dry continental air
  'loc-sgr:2026-08-03:3', // Srinagar: North, D+3, dry valley inversion
])

const ZERO_SPREAD_CASES = new Set([
  ...HIDDEN_BUST_CASES,
  ...MARGINAL_DRIZZLE_CASES,
  ...ZERO_SPREAD_DRY_CASES,
])

function generateForecastDataset(): Forecast[] {
  const forecasts: Forecast[] = []
  let idCounter = 1000

  // Iterate over locations and dates
  MOCK_LOCATIONS.forEach((loc) => {
    BASE_DATES.forEach((initDateStr) => {
      // Generate across lead days 1 to 10 (sample lead days for clean realistic coverage)
      const leadDays = [1, 2, 3, 4, 5, 7, 10]

      leadDays.forEach((leadDay) => {
        idCounter++
        const forecastId = `fc-${idCounter}`
        const key = `${loc.id}:${initDateStr}:${leadDay}`

        // Calculate valid date by adding lead days to init date
        const initDate = new Date(initDateStr)
        const validDateObj = new Date(initDate)
        validDateObj.setDate(validDateObj.getDate() + leadDay)
        const validDate = validDateObj.toISOString().split('T')[0]

        // Base rainfall potential influenced by location climatology
        let baseRain = 0
        if (loc.isCoastal) {
          baseRain = 25.0 + ((loc.latitude * 3) % 20)
        } else if (loc.region === 'Northeast India') {
          baseRain = 35.0 + ((loc.longitude * 2) % 25)
        } else if (loc.region === 'Central India') {
          baseRain = 15.0 + ((loc.latitude * 4) % 15)
        } else if (loc.region === 'North India') {
          baseRain = 8.0 + ((loc.latitude * 2) % 12)
        } else {
          baseRain = 10.0 + ((loc.elevationMeters % 15))
        }

        // Apply pseudo-random variation based on deterministic hash
        const hash = Math.sin(idCounter * 9.2) * 10000
        const rand = hash - Math.floor(hash)

        let isZeroSpread = ZERO_SPREAD_CASES.has(key)
        let isDesignatedBust = DESIGNATED_BUSTS.has(key)

        let forecastRainfall: number
        let observedRainfall: number
        let ensembleSpread: number
        let ensembleMin: number
        let ensembleMax: number
        let ensembleMean: number
        let bustProbability: number
        let riskLevel: RiskLevel
        let bustStatus: BustStatus
        let confidence: number

        if (isDesignatedBust) {
          // Significant Bust Scenario
          forecastRainfall = parseFloat((baseRain * 0.4 + rand * 5).toFixed(1))
          // Heavy unpredicted rainfall
          observedRainfall = parseFloat((forecastRainfall + 45.0 + rand * 35.0).toFixed(1))
          ensembleSpread = parseFloat((6.0 + leadDay * 1.8 + rand * 4).toFixed(1))
          ensembleMean = forecastRainfall
          ensembleMin = Math.max(0, parseFloat((ensembleMean - ensembleSpread * 0.8).toFixed(1)))
          ensembleMax = parseFloat((ensembleMean + ensembleSpread * 2.2).toFixed(1))

          bustProbability = parseFloat((0.74 + rand * 0.22).toFixed(2))
          riskLevel = bustProbability > 0.85 ? 'severe' : 'high'
          bustStatus = 'bust'
          confidence = parseFloat((0.85 + rand * 0.12).toFixed(2))
        } else if (isZeroSpread) {
          // Zero spread edge cases (ensemble unanimity)
          forecastRainfall = 0.0
          ensembleSpread = 0.0
          ensembleMean = 0.0
          ensembleMin = 0.0
          ensembleMax = 0.0

          if (HIDDEN_BUST_CASES.has(key)) {
            // Hidden bust: model predicted zero with 0 spread, but received meaningful/heavy rain
            observedRainfall = parseFloat((28.0 + rand * 28.0).toFixed(1))
            bustProbability = parseFloat((0.68 + rand * 0.18).toFixed(2))
            riskLevel = bustProbability > 0.80 ? 'severe' : 'high'
            bustStatus = 'bust'
            confidence = 0.82
          } else if (MARGINAL_DRIZZLE_CASES.has(key)) {
            // Marginal drizzle case: slight trace rain despite zero prediction
            observedRainfall = parseFloat((2.0 + rand * 3.5).toFixed(1))
            bustProbability = 0.22
            riskLevel = 'low'
            bustStatus = 'normal'
            confidence = 0.90
          } else {
            // True dry spell consensus: model predicted 0, spread 0, actual 0
            observedRainfall = 0.0
            bustProbability = 0.04
            riskLevel = 'low'
            bustStatus = 'normal'
            confidence = 0.95
          }
        } else {
          // Normal / Controlled Operational Distribution
          // Lead day increases spread and error naturally
          const spreadFactor = 1.0 + leadDay * 0.7
          ensembleSpread = parseFloat((1.2 + spreadFactor * (0.8 + rand * 1.2)).toFixed(1))

          // Allow dry spells / arid weather where forecast rainfall is 0.0 with normal ensemble uncertainty
          const isAridStation = ['loc-jdp', 'loc-jpr', 'loc-sgr', 'loc-chd', 'loc-gwa'].includes(loc.id)
          if (isAridStation && rand < 0.25) {
            forecastRainfall = 0.0
            ensembleMean = 0.0
            ensembleMin = 0.0
            ensembleMax = parseFloat((ensembleSpread * 1.8).toFixed(1))
            observedRainfall = rand < 0.18 ? 0.0 : parseFloat((rand * 4.0).toFixed(1))
          } else {
            forecastRainfall = parseFloat((baseRain * (0.5 + rand * 0.8)).toFixed(1))
            ensembleMean = forecastRainfall
            const errorNoise = (rand - 0.48) * (4.0 + leadDay * 2.5)
            observedRainfall = Math.max(0, parseFloat((forecastRainfall + errorNoise).toFixed(1)))
          }

          const absErr = Math.abs(observedRainfall - forecastRainfall)

          // Calibrate risk and bust probability according to error and spread
          if (absErr > 32.0 || (leadDay >= 5 && rand > 0.90)) {
            bustProbability = parseFloat((0.62 + rand * 0.18).toFixed(2))
            riskLevel = 'high'
            bustStatus = 'bust'
          } else if (absErr > 16.0 || (leadDay >= 4 && rand > 0.76)) {
            bustProbability = parseFloat((0.35 + rand * 0.20).toFixed(2))
            riskLevel = 'moderate'
            bustStatus = absErr > 22.0 ? 'borderline' : 'normal'
          } else {
            bustProbability = parseFloat((0.03 + rand * 0.18).toFixed(2))
            riskLevel = 'low'
            bustStatus = 'normal'
          }

          ensembleMin = Math.max(0, parseFloat((ensembleMean - ensembleSpread * 1.2).toFixed(1)))
          ensembleMax = parseFloat((ensembleMean + ensembleSpread * 1.5).toFixed(1))
          confidence = parseFloat((0.70 + (10 - leadDay) * 0.025).toFixed(2))
        }

        // Deterministic Data Quality classification
        let dataStatus: Forecast['dataStatus'] = 'complete'
        const qualityIssues: string[] = []

        // Designated missing observations: remote mountain / sensor dropout stations on specific dates
        const isMissingObservation =
          (loc.id === 'loc-sgr' && (validDate === '2026-08-15' || validDate === '2026-08-18')) ||
          (loc.id === 'loc-leh' && (validDate === '2026-08-12' || validDate === '2026-08-15')) ||
          (loc.id === 'loc-shl' && validDate === '2026-08-10') ||
          (loc.id === 'loc-dhn' && validDate === '2026-08-15') ||
          (loc.id === 'loc-gwa' && validDate === '2026-08-15') ||
          (loc.id === 'loc-ngp' && validDate === '2026-08-18')

        let finalObservedRainfall = observedRainfall
        let finalForecastError = parseFloat((observedRainfall - forecastRainfall).toFixed(1))
        let hasObservation = true

        if (isMissingObservation) {
          finalObservedRainfall = -999.0 // Sentinel: unobserved / missing telemetry (never treated as 0 mm dry)
          finalForecastError = 0.0
          hasObservation = false
          dataStatus = 'missing_observation'
          qualityIssues.push('Automatic Weather Station (AWS) telemetry packet dropped; ground truth observation pending ingestion.')
        } else if (loc.id === 'loc-jdp' && leadDay === 10 && initDateStr === '2026-08-08') {
          dataStatus = 'partial'
          qualityIssues.push('Partial ensemble telemetry; 2 of 21 perturbed ensemble members missing from raw GRIB payload.')
        } else if (loc.id === 'loc-chd' && leadDay === 7 && initDateStr === '2026-08-10') {
          dataStatus = 'partial'
          qualityIssues.push('Incomplete spatial metadata; grid coordinate interpolation discrepancy detected.')
        }

        const ensembleRange = parseFloat((ensembleMax - ensembleMin).toFixed(1))

        forecasts.push({
          id: forecastId,
          locationId: loc.id,
          locationName: loc.name,
          state: loc.state,
          region: loc.region,
          initDate: initDateStr,
          validDate,
          leadDay,
          forecastRainfall,
          observedRainfall: finalObservedRainfall,
          hasObservation,
          forecastError: finalForecastError,
          ensembleMean,
          ensembleSpread,
          ensembleMin,
          ensembleMax,
          ensembleRange,
          bustProbability,
          riskLevel,
          confidence,
          bustStatus,
          zeroSpread: isZeroSpread,
          dataStatus,
          qualityIssues,
        })
      })
    })
  })

  return forecasts
}

export const MOCK_FORECASTS: Forecast[] = generateForecastDataset()
