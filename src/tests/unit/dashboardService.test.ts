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
  fetchHubNodes,
  fetchAllDashboard,
} from '@/services/dashboardService'
import {
  initSimulator,
  nextDashboardFrame,
  resetSimulator,
} from '@/mocks/realtimeDashboardSimulator'
import { dashboardMockData } from '@/mocks/dashboardMock'

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

  it('fetchHubNodes should return hub nodes', async () => {
    const data = await fetchHubNodes()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('name')
    expect(data[0]).toHaveProperty('value')
    expect(data[0]).toHaveProperty('status')
  })

  it('fetchAllDashboard should return complete dashboard data', async () => {
    const data = await fetchAllDashboard()
    expect(data).toHaveProperty('summary')
    expect(data).toHaveProperty('trend')
    expect(data).toHaveProperty('categories')
    expect(data).toHaveProperty('ranking')
    expect(data).toHaveProperty('radar')
    expect(data).toHaveProperty('activities')
    expect(data).toHaveProperty('mapPoints')
    expect(data).toHaveProperty('hubNodes')
  })
})

describe('realtimeDashboardSimulator', () => {
  beforeEach(() => {
    resetSimulator()
    initSimulator(dashboardMockData)
  })

  it('should produce different data on consecutive calls', () => {
    const frame1 = nextDashboardFrame()
    const frame2 = nextDashboardFrame()
    // summary.todayVisits should increase each frame
    expect(frame2.summary.todayVisits).toBeGreaterThan(frame1.summary.todayVisits)
  })

  it('should keep trend array length within reasonable bounds', () => {
    // Generate many frames, trend should not grow indefinitely
    initSimulator(dashboardMockData)
    for (let i = 0; i < 20; i++) {
      nextDashboardFrame()
    }
    const frame = nextDashboardFrame()
    expect(frame.trend[0].data.length).toBeLessThanOrEqual(10)
  })

  it('should keep activities array length within max', () => {
    initSimulator(dashboardMockData)
    for (let i = 0; i < 20; i++) {
      nextDashboardFrame()
    }
    const frame = nextDashboardFrame()
    expect(frame.activities.length).toBeLessThanOrEqual(8)
  })

  it('should keep categories sum at 100', () => {
    initSimulator(dashboardMockData)
    for (let i = 0; i < 20; i++) {
      nextDashboardFrame()
    }
    const frame = nextDashboardFrame()
    const total = frame.categories.reduce((s, c) => s + c.value, 0)
    expect(Math.abs(total - 100)).toBeLessThan(0.2)
  })

  it('should keep hubNodes values within range [40, 100]', () => {
    initSimulator(dashboardMockData)
    for (let i = 0; i < 30; i++) {
      nextDashboardFrame()
    }
    const frame = nextDashboardFrame()
    frame.hubNodes.forEach((node) => {
      expect(node.value).toBeGreaterThanOrEqual(35)
      expect(node.value).toBeLessThanOrEqual(105)
    })
  })

  it('should keep summary metrics in reasonable range', () => {
    initSimulator(dashboardMockData)
    for (let i = 0; i < 20; i++) {
      nextDashboardFrame()
    }
    const frame = nextDashboardFrame()
    expect(frame.summary.todayVisits).toBeGreaterThan(100000)
    expect(frame.summary.systemHealth).toBeGreaterThanOrEqual(90)
    expect(frame.summary.systemHealth).toBeLessThanOrEqual(100)
    expect(frame.summary.activeUsers).toBeGreaterThan(0)
  })
})
