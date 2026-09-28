import type { LeadDayStatistic } from '../types'
import { MOCK_FORECASTS } from './forecasts'

/**
 * Lead-Day statistics for horizons 1 through 10.
 * Demonstrates forecast degradation and uncertainty expansion over lead time.
 */

function computeLeadDayStatistics(): LeadDayStatistic[] {
  const leadDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  // Benchmark model ROC-AUC degradation curve
  const modelRocCurve: Record<number, number> = {
    1: 0.932,
    2: 0.918,
    3: 0.904,
    4: 0.892,
    5: 0.881,
    6: 0.869,
    7: 0.856,
    8: 0.842,
    9: 0.829,
    10: 0.814,
  }

  return leadDays.map((leadDay) => {
    const fcs = MOCK_FORECASTS.filter((fc) => fc.leadDay === leadDay)
    const count = fcs.length

    if (count === 0) {
      // Interpolated baseline for un-sampled intermediate days (e.g. days 6, 8, 9)
      return {
        leadDay,
        forecastCount: 180,
        bustCount: Math.round(18 + leadDay * 2.2),
        bustRate: parseFloat((10.0 + leadDay * 1.2).toFixed(1)),
        avgError: parseFloat((4.5 + leadDay * 1.3).toFixed(1)),
        avgSpread: parseFloat((2.5 + leadDay * 1.6).toFixed(1)),
        avgBustProbability: parseFloat((0.14 + leadDay * 0.02).toFixed(2)),
        modelRocAuc: modelRocCurve[leadDay] || 0.82,
      }
    }

    const bustCount = fcs.filter((fc) => fc.bustStatus === 'bust').length
    const sumError = fcs.reduce((acc, fc) => acc + Math.abs(fc.forecastError), 0)
    const sumSpread = fcs.reduce((acc, fc) => acc + fc.ensembleSpread, 0)
    const sumRisk = fcs.reduce((acc, fc) => acc + fc.bustProbability, 0)

    return {
      leadDay,
      forecastCount: count,
      bustCount,
      bustRate: parseFloat(((bustCount / count) * 100).toFixed(1)),
      avgError: parseFloat((sumError / count).toFixed(1)),
      avgSpread: parseFloat((sumSpread / count).toFixed(1)),
      avgBustProbability: parseFloat((sumRisk / count).toFixed(2)),
      modelRocAuc: modelRocCurve[leadDay] || 0.85,
    }
  })
}

export const MOCK_LEAD_DAY_STATS: LeadDayStatistic[] = computeLeadDayStatistics()
