import { describe, it, expect, vi } from 'vitest'

// Mock the data source module to force mock mode
vi.mock('@/services/dataSource', () => ({
  isMockMode: () => true,
  getDataSourceMode: () => 'mock',
  isApiMode: () => false,
}))

// Mock the logger
vi.mock('@/logs/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

import {
  fetchSummary,
  fetchTrend,
  fetchCategories,
  fetchRanking,
  fetchRadar,
  fetchActivities,
  fetchMapPoints,
} from '@/services/dashboardService'

describe('dashboardService in mock mode', () => {
  it('fetchSummary should return summary metrics', async () => {
    const data = await fetchSummary()
    expect(data).toBeDefined()
    expect(typeof data.todayVisits).toBe('number')
    expect(typeof data.realtimeOrders).toBe('number')
    expect(typeof data.activeUsers).toBe('number')
    expect(typeof data.systemHealth).toBe('number')
  })

  it('fetchTrend should return trend series array', async () => {
    const data = await fetchTrend()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('name')
    expect(data[0]).toHaveProperty('data')
    expect(Array.isArray(data[0].data)).toBe(true)
  })

  it('fetchCategories should return category items', async () => {
    const data = await fetchCategories()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('name')
    expect(data[0]).toHaveProperty('value')
  })

  it('fetchRanking should return ranking items sorted', async () => {
    const data = await fetchRanking()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('rank')
    expect(data[0]).toHaveProperty('name')
    expect(data[0]).toHaveProperty('value')
  })

  it('fetchRadar should return radar data with indicators and series', async () => {
    const data = await fetchRadar()
    expect(data).toHaveProperty('indicators')
    expect(data).toHaveProperty('series')
    expect(Array.isArray(data.indicators)).toBe(true)
    expect(Array.isArray(data.series)).toBe(true)
  })

  it('fetchActivities should return activity list', async () => {
    const data = await fetchActivities()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('type')
    expect(data[0]).toHaveProperty('content')
    expect(data[0]).toHaveProperty('time')
  })

  it('fetchMapPoints should return map points', async () => {
    const data = await fetchMapPoints()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('name')
    expect(data[0]).toHaveProperty('value')
    expect(data[0]).toHaveProperty('level')
  })
})
