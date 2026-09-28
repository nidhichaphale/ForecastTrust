import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { SettingsProvider } from './context/SettingsContext'
import { ThemeProvider } from './context/ThemeContext'
import { AlertsProvider } from './context/AlertsContext'

export const App: React.FC = () => {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <AlertsProvider>
          <RouterProvider router={router} />
        </AlertsProvider>
      </ThemeProvider>
    </SettingsProvider>
  )
}

export default App
