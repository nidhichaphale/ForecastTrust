import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines Tailwind classes with clsx and merges duplicates safely.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
