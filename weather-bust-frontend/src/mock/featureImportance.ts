import type { FeatureImportance } from '../types'

/**
 * Mock feature importance analysis highlighting predictive drivers of forecast busts.
 */

export const MOCK_FEATURE_IMPORTANCE: FeatureImportance[] = [
  // Ensemble Drivers (Primary Predictors)
  {
    featureName: 'ens_spread',
    displayName: 'Ensemble Spread (Standard Deviation)',
    category: 'ensemble',
    importanceScore: 94.6,
    normalizedRatio: 0.185,
    rank: 1,
    description: 'Degree of disagreement among numerical weather prediction ensemble members.',
  },
  {
    featureName: 'ens_range',
    displayName: 'Ensemble Range (Max - Min)',
    category: 'ensemble',
    importanceScore: 88.2,
    normalizedRatio: 0.172,
    rank: 2,
    description: 'Full spread interval capturing tail risk and extreme outlier scenarios.',
  },
  {
    featureName: 'ens_mean',
    displayName: 'Ensemble Mean Precipitation',
    category: 'ensemble',
    importanceScore: 76.4,
    normalizedRatio: 0.149,
    rank: 3,
    description: 'Central tendency of the ensemble forecast distribution.',
  },
  {
    featureName: 'ens_max',
    displayName: 'Ensemble Upper Bound (90th Percentile)',
    category: 'ensemble',
    importanceScore: 65.8,
    normalizedRatio: 0.128,
    rank: 4,
    description: 'Extreme ceiling indicating potential localized convective bursts.',
  },

  // Historical & Contextual Drivers
  {
    featureName: 'hist_3d_rain',
    displayName: 'Historical 3-Day Cumulative Rainfall',
    category: 'historical',
    importanceScore: 52.3,
    normalizedRatio: 0.102,
    rank: 5,
    description: 'Pre-existing soil moisture and atmospheric saturation proxy.',
  },
  {
    featureName: 'prior_bust_frequency',
    displayName: 'Prior 14-Day Local Bust Rate',
    category: 'historical',
    importanceScore: 44.1,
    normalizedRatio: 0.086,
    rank: 6,
    description: 'Recent persistence of model bias under specific synoptic regimes.',
  },

  // Spatial Drivers
  {
    featureName: 'coastal_proximity',
    displayName: 'Coastal Proximity Index',
    category: 'spatial',
    importanceScore: 36.7,
    normalizedRatio: 0.072,
    rank: 7,
    description: 'Distance to marine boundary layer and moisture influx corridors.',
  },
  {
    featureName: 'terrain_elevation',
    displayName: 'Terrain Elevation Gradient',
    category: 'spatial',
    importanceScore: 28.5,
    normalizedRatio: 0.056,
    rank: 8,
    description: 'Orographic lift potential along Ghats and Himalayan foothills.',
  },

  // Temporal Drivers
  {
    featureName: 'lead_day',
    displayName: 'Forecast Lead Day Horizon (1-10)',
    category: 'temporal',
    importanceScore: 24.2,
    normalizedRatio: 0.047,
    rank: 9,
    description: 'Non-linear error amplification over increasing forecast projection horizon.',
  },
  {
    featureName: 'monsoon_phase_doy',
    displayName: 'Monsoon Intraseasonal Phase (Day of Year)',
    category: 'temporal',
    importanceScore: 18.9,
    normalizedRatio: 0.037,
    rank: 10,
    description: 'Active vs break monsoon cycle modulation.',
  },
]
