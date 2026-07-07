import { describe, it, expect } from 'vitest'
import { formatNumber, formatPercent, formatRelativeTime, formatDateTime } from '@/utils/format'

describe('formatNumber', () => {
  it('should format numbers less than 10000', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(999)).toBe('999')
    expect(formatNumber(5000)).toBe('5,000')
  })

  it('should format numbers >= 10000 with 万 suffix', () => {
    expect(formatNumber(10000)).toBe('1.0w')
    expect(formatNumber(128934)).toBe('12.9w')
    expect(formatNumber(1000000)).toBe('100.0w')
  })
})

describe('formatPercent', () => {
  it('should format decimals to percentage', () => {
    expect(formatPercent(0.5)).toBe('50.0%')
    expect(formatPercent(0.997)).toBe('99.7%')
    expect(formatPercent(0.123, 2)).toBe('12.30%')
  })
})

describe('formatRelativeTime', () => {
  it('should return 刚刚 for recent times', () => {
    const now = new Date().toISOString()
    expect(formatRelativeTime(now)).toBe('刚刚')
  })

  it('should return minutes ago', () => {
    const d = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    expect(formatRelativeTime(d)).toBe('5分钟前')
  })

  it('should return hours ago', () => {
    const d = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    expect(formatRelativeTime(d)).toBe('3小时前')
  })

  it('should return days ago', () => {
    const d = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    expect(formatRelativeTime(d)).toBe('2天前')
  })
})

describe('formatDateTime', () => {
  it('should format date time correctly', () => {
    const result = formatDateTime('2026-07-07T14:32:01')
    expect(result).toBe('2026-07-07 14:32:01')
  })
})
