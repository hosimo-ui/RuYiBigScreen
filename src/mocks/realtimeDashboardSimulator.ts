/**
 * 实时仪表板数据模拟器
 *
 * 基于上一帧数据生成下一帧数据，模拟真实业务系统的数据变化。
 * 不依赖任何外部服务，纯内存计算。
 *
 * 设计原则：
 * - 数据变化克制、有业务逻辑
 * - 各模块变化频率独立
 * - 所有数值保持合理范围
 */
import type {
  DashboardData,
  SummaryMetrics,
  TrendPoint,
  TrendSeries,
  CategoryItem,
  RankingItem,
  ActivityItem,
  HubNode,
} from '@/types/dashboard'

// ===================== 随机工具函数 =====================

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randFloat(min: number, max: number, decimals = 1): number {
  const val = Math.random() * (max - min) + min
  return Number(val.toFixed(decimals))
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

function now(): string {
  return new Date().toISOString()
}

function timeLabel(): string {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// ===================== 动态消息模板 =====================

const ACTIVITY_TEMPLATES: { content: string; type: ActivityItem['type'] }[] = [
  { content: '北京学习中心完成新一轮访问数据同步', type: 'info' },
  { content: '可视化案例库同步 {n} 条练习记录', type: 'info' },
  { content: '学员端新增一批项目实战提交', type: 'success' },
  { content: '教师端发布新的课堂任务', type: 'info' },
  { content: '数据质量巡检通过，异常值已自动标记', type: 'success' },
  { content: '华东节点接口延迟轻微升高，已切换备用通道', type: 'warning' },
  { content: '告警中心发现轻微波动，正在持续观察', type: 'warning' },
  { content: '问答互动区新增高频问题聚类结果', type: 'info' },
  { content: '南京数据中心完成定时备份', type: 'success' },
  { content: '系统负载均衡器自动扩容完成', type: 'info' },
  { content: '实时数据流检测到延迟峰值，已自动恢复', type: 'warning' },
  { content: '课程学习模块访问量突破今日新高', type: 'success' },
  { content: '深圳节点心跳延迟，正在检测网络状态', type: 'warning' },
  { content: '教学资源包自动更新完成', type: 'success' },
  { content: '学员答题数据批量归档完成', type: 'info' },
]

let activityIdCounter = 1000

// ===================== 各模块更新函数 =====================

function updateSummaryMetrics(prev: SummaryMetrics): SummaryMetrics {
  return {
    todayVisits: prev.todayVisits + randInt(20, 300),
    realtimeOrders: prev.realtimeOrders + randInt(0, 80),
    activeUsers: clamp(
      prev.activeUsers + randInt(-200, 300),
      1000,
      20000,
    ),
    systemHealth: clamp(
      randFloat(95, 99.9),
      90,
      99.9,
    ),
  }
}

function updateTrendWindow(summary: SummaryMetrics, prevTrend: TrendSeries[]): TrendSeries[] {
  const maxPoints = 10
  const label = timeLabel()

  return prevTrend.map((series) => {
    const isVisits = series.name === '访问量'
    // Extract a meaningful increment proportional to the summary metric
    const baseValue = isVisits
      ? Math.round(summary.todayVisits / 40)
      : Math.round(summary.realtimeOrders / 15)

    const newPoint: TrendPoint = {
      time: label,
      value: baseValue + randInt(-baseValue * 0.1, baseValue * 0.1),
    }

    const updated = [...series.data, newPoint]
    if (updated.length > maxPoints) {
      return { ...series, data: updated.slice(updated.length - maxPoints) }
    }
    return { ...series, data: updated }
  })
}

function updateCategories(prev: CategoryItem[]): CategoryItem[] {
  // Add small random deltas, then normalize to 100
  const deltas = prev.map(() => randFloat(-2, 3, 1))
  const raw = prev.map((c, i) => ({
    ...c,
    value: clamp(c.value + deltas[i], 5, 50),
  }))

  // Renormalize to sum = 100
  const total = raw.reduce((s, c) => s + c.value, 0)
  const normalized = raw.map((c) => ({
    ...c,
    value: Number(((c.value / total) * 100).toFixed(1)),
  }))

  // Fix minor rounding so sum is exactly 100
  const diff = 100 - normalized.reduce((s, c) => s + c.value, 0)
  normalized[0].value = Number((normalized[0].value + diff).toFixed(1))

  return normalized
}

function updateRanking(prev: RankingItem[]): RankingItem[] {
  // Each city gets a small positive increment
  const updated = prev.map((item) => ({
    ...item,
    value: item.value + randInt(5, 80),
  }))

  // Re-sort and reassign ranks
  updated.sort((a, b) => b.value - a.value)
  return updated.map((item, i) => ({ ...item, rank: i + 1 }))
}

function updateRadar(prev: DashboardData['radar']): DashboardData['radar'] {
  return {
    indicators: prev.indicators,
    series: prev.series.map((s) => ({
      ...s,
      values: s.values.map((v) => clamp(v + randInt(-2, 3), 40, 100)),
    })),
  }
}

function updateHubNodes(prev: HubNode[]): HubNode[] {
  return prev.map((node) => {
    const newValue = clamp(node.value + randInt(-4, 5), 40, 100)
    let status: HubNode['status'] = 'good'
    if (newValue < 55) status = 'danger'
    else if (newValue < 70) status = 'warning'

    // Danger should be rare — force back to warning if it was good before
    if (status === 'danger' && node.status === 'good') {
      status = 'warning'
    }

    return {
      ...node,
      value: newValue,
      status,
    }
  })
}

function createRealtimeActivity(): ActivityItem {
  activityIdCounter++
  const template = ACTIVITY_TEMPLATES[randInt(0, ACTIVITY_TEMPLATES.length - 1)]
  const content = template.content.replace('{n}', String(randInt(5, 30)))

  // ~20% chance of warning, ~5% chance of error
  let type = template.type
  if (template.type === 'info' && Math.random() < 0.15) {
    type = 'warning'
  }
  if (Math.random() < 0.03) {
    type = 'error'
  }

  return {
    id: activityIdCounter,
    type,
    content,
    time: now(),
  }
}

function updateActivities(prev: ActivityItem[]): ActivityItem[] {
  const maxItems = 8
  const updated = [createRealtimeActivity(), ...prev]
  if (updated.length > maxItems) {
    return updated.slice(0, maxItems)
  }
  return updated
}

function updateMapPoints(prev: DashboardData['mapPoints']): DashboardData['mapPoints'] {
  return prev.map((p) => ({
    ...p,
    level: clamp(p.level + randInt(-1, 1), 1, 6),
  }))
}

// ===================== 帧状态 =====================

let frameData: DashboardData | null = null
let frameCount = 0

// ===================== 导出函数 =====================

/** 用初始数据初始化模拟器 */
export function initSimulator(initialData: DashboardData): void {
  frameData = structuredClone(initialData)
  frameCount = 0
}

/** 生成下一帧数据 */
export function nextDashboardFrame(): DashboardData {
  if (!frameData) {
    throw new Error('Simulator not initialized. Call initSimulator() first.')
  }

  frameCount++

  // --- summary: 每帧更新 ---
  const summary = updateSummaryMetrics(frameData.summary)

  // --- trend: 每 2 帧更新一次 ---
  const trend =
    frameCount % 2 === 0
      ? updateTrendWindow(summary, frameData.trend)
      : frameData.trend

  // --- categories: 每 6 帧更新一次 (~12s) ---
  const categories =
    frameCount % 6 === 0
      ? updateCategories(frameData.categories)
      : frameData.categories

  // --- ranking: 每 5 帧更新一次 (~10s) ---
  const ranking =
    frameCount % 5 === 0
      ? updateRanking(frameData.ranking)
      : frameData.ranking

  // --- radar: 每 15 帧更新一次 (~30s) ---
  const radar =
    frameCount % 15 === 0
      ? updateRadar(frameData.radar)
      : frameData.radar

  // --- activities: 每 2 帧新增一条 ---
  const activities =
    frameCount % 2 === 0
      ? updateActivities(frameData.activities)
      : frameData.activities

  // --- hubNodes: 每帧小幅变化 ---
  const hubNodes = updateHubNodes(frameData.hubNodes)

  // --- mapPoints: 每 5 帧变化 ---
  const mapPoints =
    frameCount % 5 === 0
      ? updateMapPoints(frameData.mapPoints)
      : frameData.mapPoints

  frameData = {
    summary,
    trend,
    categories,
    ranking,
    radar,
    activities,
    mapPoints,
    hubNodes,
  }

  return frameData
}

/** 获取当前帧计数 */
export function getFrameCount(): number {
  return frameCount
}

/** 重置模拟器 */
export function resetSimulator(): void {
  frameData = null
  frameCount = 0
  activityIdCounter = 1000
}
