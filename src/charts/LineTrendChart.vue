<template>
  <BasePanel title="CPU与内存趋势">
    <VChart
      :option="chartOption"
      :autoresize="true"
      style="position: absolute; inset: 6px 8px"
    />
  </BasePanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import type { TrendSeries } from '@/types/dashboard'

use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

const props = defineProps<{
  data: TrendSeries[]
}>()

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis' as const,
    backgroundColor: 'rgba(6, 20, 50, 0.9)',
    borderColor: 'rgba(0, 180, 255, 0.4)',
    textStyle: { color: '#c8e6ff', fontSize: 12 },
  },
  legend: {
    data: props.data.map((s) => s.name),
    top: 0,
    right: 0,
    textStyle: { color: '#8899bb', fontSize: 11 },
  },
  grid: {
    top: 36,
    left: 10,
    right: 14,
    bottom: 8,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: props.data[0]?.data.map((d) => d.time) ?? [],
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } },
    axisTick: { show: false },
    axisLabel: { color: '#6688aa', fontSize: 10 },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    axisLabel: { color: '#6688aa', fontSize: 10 },
  },
  series: props.data.map((s, i) => ({
    name: s.name,
    type: 'line' as const,
    smooth: true,
    symbol: 'none',
    data: s.data.map((d) => d.value),
    lineStyle: {
      width: 2,
      color: i === 0 ? '#00d4ff' : '#7c4dff',
    },
    itemStyle: {
      color: i === 0 ? '#00d4ff' : '#7c4dff',
    },
    areaStyle: {
      color: {
        type: 'linear' as const,
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: i === 0 ? 'rgba(0,212,255,0.25)' : 'rgba(124,77,255,0.2)' },
          { offset: 1, color: 'rgba(0,0,0,0)' },
        ],
      },
    },
  })),
}))
</script>
