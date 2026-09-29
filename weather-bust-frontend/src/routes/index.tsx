import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RootLayout } from '../layouts/RootLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { ForecastExplorerPage } from '../pages/ForecastExplorerPage'
import { ForecastDetailPage } from '../pages/ForecastDetailPage'
import { ForecastRiskMapPage } from '../pages/ForecastRiskMapPage'
import { BustDetectionPage } from '../pages/BustDetectionPage'
import { HiddenRiskPage } from '../pages/HiddenRiskPage'
import { VerificationAnalysisPage } from '../pages/VerificationAnalysisPage'
import { DataQualityPage } from '../pages/DataQualityPage'
import { AlertsPage } from '../pages/AlertsPage'
import { SettingsPage } from '../pages/SettingsPage'
import { RouteErrorBoundary } from '../components/common/RouteErrorBoundary'

/**
 * Main application routing configuration.
 * Preserves all existing canonical URLs while supporting workspace aliases.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'forecasts',
        element: <ForecastExplorerPage />,
      },
      {
        path: 'forecasts/:forecastId',
        element: <ForecastDetailPage />,
      },
      {
        path: 'map',
        element: <ForecastRiskMapPage />,
      },
      {
        path: 'risk-map',
        element: <Navigate to="/map" replace />,
      },
      {
        path: 'risk-overview',
        element: <Navigate to="/map" replace />,
      },
      {
        path: 'bust-detection',
        element: <BustDetectionPage />,
      },
      {
        path: 'hidden-risk',
        element: <HiddenRiskPage />,
      },
      {
        path: 'analysis',
        element: <VerificationAnalysisPage />,
      },
      {
        path: 'verification',
        element: <Navigate to="/analysis" replace />,
      },
      {
        path: 'data',
        element: <DataQualityPage />,
      },
      {
        path: 'alerts',
        element: <AlertsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
])
