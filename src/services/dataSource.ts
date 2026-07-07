/**
 * 统一数据源切换机制
 *
 * - VITE_DATA_SOURCE=mock → 使用 mock 数据
 * - VITE_DATA_SOURCE=api  → 使用 Axios API 请求
 */
import { logger } from '@/logs/logger'

export type DataSourceMode = 'mock' | 'api'

export function getDataSourceMode(): DataSourceMode {
  const mode = import.meta.env.VITE_DATA_SOURCE as DataSourceMode
  if (mode !== 'mock' && mode !== 'api') {
    logger.warn(`Unknown VITE_DATA_SOURCE "${mode}", falling back to "mock"`)
    return 'mock'
  }
  return mode
}

export function isMockMode(): boolean {
  return getDataSourceMode() === 'mock'
}

export function isApiMode(): boolean {
  return getDataSourceMode() === 'api'
}
