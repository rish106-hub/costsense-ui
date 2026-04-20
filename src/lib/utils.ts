import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatINR = (n: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)

export const fmtAgent = (raw: string): string =>
  raw
    .replace('agent_0', 'A0')
    .replace('agent_', 'A')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

export const truncate = (s: string, n: number): string =>
  s.length > n ? s.slice(0, n) + '…' : s

export const fmtDateTime = (iso: string): string =>
  iso ? iso.slice(0, 19).replace('T', ' ') : '—'

export const fmtPct = (n: number | null): string =>
  n != null ? `${(n * 100).toFixed(0)}%` : '—'
