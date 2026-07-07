/** 核心指标数据 */
export interface SummaryMetrics {
  todayVisits: number
  realtimeOrders: number
  activeUsers: number
  systemHealth: number
}

/** 趋势数据点 */
export interface TrendPoint {
  time: string
  value: number
}

/** 趋势系列 */
export interface TrendSeries {
  name: string
  data: TrendPoint[]
}

/** 分类占比数据项 */
export interface CategoryItem {
  name: string
  value: number
}

/** 排名数据项 */
export interface RankingItem {
  name: string
  value: number
  rank: number
}

/** 雷达指标 */
export interface RadarIndicator {
  name: string
  max: number
}

/** 雷达数据项 */
export interface RadarItem {
  name: string
  values: number[]
}

/** 雷达数据 */
export interface RadarData {
  indicators: RadarIndicator[]
  series: RadarItem[]
}

/** 活动/告警条目 */
export interface ActivityItem {
  id: number
  type: 'info' | 'warning' | 'error' | 'success'
  content: string
  time: string
}

/** 地图数据点 */
export interface MapPoint {
  name: string
  value: number[]
  level: number
}

/** 数据中枢业务节点 */
export interface HubNode {
  name: string
  value: number
  status: 'good' | 'warning' | 'danger'
  description: string
}

/** 完整的仪表板数据 */
export interface DashboardData {
  summary: SummaryMetrics
  trend: TrendSeries[]
  categories: CategoryItem[]
  ranking: RankingItem[]
  radar: RadarData
  activities: ActivityItem[]
  mapPoints: MapPoint[]
  hubNodes: HubNode[]
}
