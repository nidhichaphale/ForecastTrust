import React from 'react'
import { ThemeContext, type Theme } from './theme-context-def'
import { useSettings } from '../hooks'

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, updateAppearance } = useSettings()

  // Resolve active theme: if system, test against prefers-color-scheme
  const themePref = settings.appearance.theme
  let activeTheme: Theme = 'dark'
  if (themePref === 'system') {
    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    activeTheme = prefersDark ? 'dark' : 'light'
  } else {
    activeTheme = themePref
  }

  const toggleTheme = () => {
    const nextTheme: Theme = activeTheme === 'dark' ? 'light' : 'dark'
    updateAppearance({ theme: nextTheme })
  }

  return (
    <ThemeContext.Provider value={{ theme: activeTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
