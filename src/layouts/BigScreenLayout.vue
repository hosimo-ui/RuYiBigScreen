<template>
  <div class="big-screen">
    <ScreenHeader :current-time="store.currentTime" />
    <div class="big-screen__body">
      <!-- 左侧区域 -->
      <div class="big-screen__left">
        <div class="big-screen__chart">
          <LineTrendChart :data="store.trend" />
        </div>
        <div class="big-screen__chart">
          <PieStatusChart :data="store.categories" />
        </div>
      </div>

      <!-- 中间区域 -->
      <div class="big-screen__center">
        <!-- 指标卡片 -->
        <div class="big-screen__metrics">
          <MetricCard
            label="今日访问量"
            :value="store.summary?.todayVisits ?? 0"
            icon="&#x1F4C8;"
            variant="primary"
          />
          <MetricCard
            label="实时订单数"
            :value="store.summary?.realtimeOrders ?? 0"
            icon="&#x1F4E6;"
            variant="success"
          />
          <MetricCard
            label="活跃用户数"
            :value="store.summary?.activeUsers ?? 0"
            icon="&#x1F465;"
            variant="info"
          />
          <MetricCard
            label="系统健康度"
            :value="store.summary?.systemHealth ?? 0"
            unit="%"
            icon="&#x2764;"
            variant="warning"
            :decimals="1"
          />
        </div>
        <!-- 数据中枢 + 态势总览 并排 -->
        <div class="big-screen__hub-row">
          <div class="big-screen__hub">
            <DataHubChart :data="store.hubNodes" />
          </div>
          <div class="big-screen__map">
            <MapOverviewChart :data="store.mapPoints" />
          </div>
        </div>
        <!-- 底部活动列表 -->
        <div class="big-screen__activity">
          <BasePanel title="实时动态">
            <div class="activity-list">
              <div
                v-for="item in store.activities"
                :key="item.id"
                class="activity-item"
              >
                <span class="activity-item__dot" :class="`activity-item__dot--${item.type}`" />
                <span class="activity-item__content">{{ item.content }}</span>
                <span class="activity-item__time">{{ formatRelativeTime(item.time) }}</span>
              </div>
            </div>
          </BasePanel>
        </div>
      </div>

      <!-- 右侧区域 -->
      <div class="big-screen__right">
        <div class="big-screen__chart">
          <BarRankingChart :data="store.ranking" />
        </div>
        <div class="big-screen__chart">
          <RadarAbilityChart v-if="store.radar" :data="store.radar" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ScreenHeader from '@/components/ScreenHeader.vue'
import MetricCard from '@/components/MetricCard.vue'
import BasePanel from '@/components/BasePanel.vue'
import LineTrendChart from '@/charts/LineTrendChart.vue'
import PieStatusChart from '@/charts/PieStatusChart.vue'
import BarRankingChart from '@/charts/BarRankingChart.vue'
import RadarAbilityChart from '@/charts/RadarAbilityChart.vue'
import MapOverviewChart from '@/charts/MapOverviewChart.vue'
import DataHubChart from '@/charts/DataHubChart.vue'
import { useDashboardStore } from '@/stores/dashboardStore'
import { formatRelativeTime } from '@/utils/format'

const store = useDashboardStore()
</script>

<style scoped>
.big-screen {
  width: 1920px;
  height: 1080px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 30%, rgba(0, 80, 160, 0.15) 0%, rgba(0, 0, 0, 0) 60%),
    linear-gradient(180deg, #080e1a 0%, #0a1628 40%, #0c1a30 100%);
}

.big-screen__body {
  flex: 1;
  display: flex;
  padding: 4px 12px 6px;
  gap: 8px;
  min-height: 0;
}

.big-screen__left,
.big-screen__right {
  flex: 0 0 340px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.big-screen__center {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.big-screen__metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.big-screen__hub-row {
  flex: 1;
  display: flex;
  gap: 8px;
  min-height: 300px;
}

.big-screen__hub {
  flex: 0 0 480px;
}

.big-screen__map {
  flex: 1;
  min-height: 300px;
}

.big-screen__activity {
  height: 160px;
  flex-shrink: 0;
}

.big-screen__chart {
  flex: 1;
  min-height: 180px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  max-height: 120px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  font-size: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.activity-item__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.activity-item__dot--info {
  background: #00d4ff;
}

.activity-item__dot--success {
  background: #00e676;
}

.activity-item__dot--warning {
  background: #ffab40;
}

.activity-item__dot--error {
  background: #ff5252;
}

.activity-item__content {
  flex: 1;
  color: #aac8e0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-item__time {
  color: #556688;
  font-size: 11px;
  flex-shrink: 0;
}
</style>
