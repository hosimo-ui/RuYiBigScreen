/**
 * 仪表板数据服务
 * 通过统一数据源获取数据，组件不直接接触 mock 或 API
 */
import http from './http'
import { isMockMode } from './dataSource'
import { dashboardMockData } from '@/mocks/dashboardMock'
import { initSimulator, nextDashboardFrame } from '@/mocks/realtimeDashboardSimulator'
import { logger } from '@/logs/logger'
import type {
  SummaryMetrics,
  TrendSeries,
  CategoryItem,
  RankingItem,
  RadarData,
  ActivityItem,
  MapPoint,
  HubNode,
  DashboardData,
} from '@/types/dashboard'

/** 通用响应格式 */
interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

/** 从 API 响应或 mock 中提取数据 */
function extractData<T>(response: ApiResponse<T>): T {
  return response.data
}

/** 模拟 API 延迟的 mock 请求 */
async function mockRequest<T>(data: T, delay = 200): Promise<T> {
  logger.debug(`[MockService] Returning mock data with ${delay}ms delay`)
  await new Promise((r) => setTimeout(r, delay))
  return data
}

/** 确保实时模拟器已初始化 */
let simulatorReady = false
function ensureSimulator(): void {
  if (!simulatorReady && isMockMode()) {
    initSimulator(dashboardMockData)
    simulatorReady = true
    logger.info('Realtime simulator initialized')
  }
}

// ===================== 统一获取全部数据 =====================

/** 获取完整仪表板数据（实时模式返回下一帧） */
export async function fetchAllDashboard(): Promise<DashboardData> {
  if (isMockMode()) {
    ensureSimulator()
    return mockRequest(nextDashboardFrame(), 50)
  }
  const res = await http.get<ApiResponse<DashboardData>>('/dashboard/all')
  return extractData(res.data)
}

// ===================== 各数据获取方法 =====================

export async function fetchSummary(): Promise<SummaryMetrics> {
  if (isMockMode()) {
    ensureSimulator()
    return mockRequest(nextDashboardFrame().summary, 50)
  }
  const res = await http.get<ApiResponse<SummaryMetrics>>('/dashboard/summary')
  return extractData(res.data)
}

export async function fetchTrend(): Promise<TrendSeries[]> {
  if (isMockMode()) {
    ensureSimulator()
    return mockRequest(nextDashboardFrame().trend, 50)
  }
  const res = await http.get<ApiResponse<TrendSeries[]>>('/dashboard/trend')
  return extractData(res.data)
}

export async function fetchCategories(): Promise<CategoryItem[]> {
  if (isMockMode()) {
    ensureSimulator()
    return mockRequest(nextDashboardFrame().categories, 50)
  }
  const res = await http.get<ApiResponse<CategoryItem[]>>('/dashboard/categories')
  return extractData(res.data)
}

export async function fetchRanking(): Promise<RankingItem[]> {
  if (isMockMode()) {
    ensureSimulator()
    return mockRequest(nextDashboardFrame().ranking, 50)
  }
  const res = await http.get<ApiResponse<RankingItem[]>>('/dashboard/ranking')
  return extractData(res.data)
}

export async function fetchRadar(): Promise<RadarData> {
  if (isMockMode()) {
    ensureSimulator()
    return mockRequest(nextDashboardFrame().radar, 50)
  }
  const res = await http.get<ApiResponse<RadarData>>('/dashboard/radar')
  return extractData(res.data)
}

export async function fetchActivities(): Promise<ActivityItem[]> {
  if (isMockMode()) {
    ensureSimulator()
    return mockRequest(nextDashboardFrame().activities, 50)
  }
  const res = await http.get<ApiResponse<ActivityItem[]>>('/dashboard/activities')
  return extractData(res.data)
}

export async function fetchMapPoints(): Promise<MapPoint[]> {
  if (isMockMode()) {
    ensureSimulator()
    return mockRequest(nextDashboardFrame().mapPoints, 50)
  }
  const res = await http.get<ApiResponse<MapPoint[]>>('/dashboard/map-points')
  return extractData(res.data)
}

export async function fetchHubNodes(): Promise<HubNode[]> {
  if (isMockMode()) {
    ensureSimulator()
    return mockRequest(nextDashboardFrame().hubNodes, 50)
  }
  const res = await http.get<ApiResponse<HubNode[]>>('/dashboard/hub-nodes')
  return extractData(res.data)
}
