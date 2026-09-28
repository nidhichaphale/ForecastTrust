import { useState, useMemo, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { ForecastFilterParams } from '../types'

/**
 * Reusable hook to synchronize and read analytical filter state from URL query parameters.
 * Provides a drop-in replacement for useState with URL initialization and zero infinite re-renders.
 */
export function useUrlFilters<T extends ForecastFilterParams>(defaultFilters: T = {} as T) {
  const [searchParams] = useSearchParams()
  const searchString = searchParams.toString()

  // Parse search parameters into filter object — stable string dependency
  const parsedFromUrl = useMemo<Partial<T>>(() => {
    const parsed: Record<string, any> = {}
    for (const [key, val] of searchParams.entries()) {
      if (val !== '' && val !== 'all') {
        if (key === 'leadDay') {
          const num = parseInt(val, 10)
          if (!isNaN(num)) parsed[key] = num
        } else {
          parsed[key] = val
        }
      }
    }
    return parsed as Partial<T>
  }, [searchString])

  // Initialize state with defaultFilters + any initial URL parameters
  const [filters, setFilters] = useState<T>(() => ({
    ...defaultFilters,
    ...parsedFromUrl,
  }))

  // Track search string changes to only sync when the URL query string actually transitions
  const lastSearchRef = useRef(searchString)
  useEffect(() => {
    if (lastSearchRef.current !== searchString) {
      lastSearchRef.current = searchString
      setFilters((prev) => ({
        ...prev,
        ...parsedFromUrl,
      }))
    }
  }, [searchString, parsedFromUrl])

  return [filters, setFilters] as const
}
