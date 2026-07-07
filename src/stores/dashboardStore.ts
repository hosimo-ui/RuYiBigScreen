import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  fetchSummary,
  fetchTrend,
  fetchCategories,
  fetchRanking,
  fetchRadar,
  fetchActivities,
  fetchMapPoints,
} from '@/services/dashboardService'
import { logger } from '@/logs/logger'
import type {
  SummaryMetrics,
  TrendSeries,
  CategoryItem,
  RankingItem,
  RadarData,
  ActivityItem,
  MapPoint,
} from '@/types/dashboard'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const summary = ref<SummaryMetrics | null>(null)
  const trend = ref<TrendSeries[]>([])
  const categories = ref<CategoryItem[]>([])
  const ranking = ref<RankingItem[]>([])
  const radar = ref<RadarData | null>(null)
  const activities = ref<ActivityItem[]>([])
  const mapPoints = ref<MapPoint[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentTime = ref('')

  // 定时更新时间
  let timeTimer: ReturnType<typeof setInterval> | null = null

  function updateTime() {
    const now = new Date()
    currentTime.value = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  function startTimeUpdate() {
    updateTime()
    timeTimer = setInterval(updateTime, 1000)
  }

  function stopTimeUpdate() {
    if (timeTimer) {
      clearInterval(timeTimer)
      timeTimer = null
    }
  }

  // Computed
  const isLoaded = computed(() => summary.value !== null)

  // Actions
  async function loadAllData() {
    loading.value = true
    error.value = null
    logger.info('Loading all dashboard data...')

    try {
      const results = await Promise.all([
        fetchSummary(),
        fetchTrend(),
        fetchCategories(),
        fetchRanking(),
        fetchRadar(),
        fetchActivities(),
        fetchMapPoints(),
      ])

      summary.value = results[0]
      trend.value = results[1]
      categories.value = results[2]
      ranking.value = results[3]
      radar.value = results[4]
      activities.value = results[5]
      mapPoints.value = results[6]

      logger.info('All dashboard data loaded successfully')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      error.value = msg
      logger.error('Failed to load dashboard data', e)
    } finally {
      loading.value = false
    }
  }

  return {
    summary,
    trend,
    categories,
    ranking,
    radar,
    activities,
    mapPoints,
    loading,
    error,
    currentTime,
    isLoaded,
    loadAllData,
    startTimeUpdate,
    stopTimeUpdate,
    updateTime,
  }
})
