<template>
  <BasePanel title="主机状态矩阵">
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
import { ScatterChart, EffectScatterChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import type { MapPoint } from '@/types/dashboard'

use([CanvasRenderer, ScatterChart, EffectScatterChart, TooltipComponent, GridComponent])

const props = defineProps<{
  data: MapPoint[]
}>()

const ROOM_LABELS = ['', 'A机房', 'B机房', 'C机房', 'D机房', 'E机房']

const STATUS_COLORS: Record<number, string> = {
  1: '#ff5252',
  3: '#ffab40',
  5: '#00e676',
}

const STATUS_TEXT: Record<number, string> = {
  1: '异常',
  3: '告警',
  5: '正常',
}

const chartOption = computed(() => {
  const points = props.data.map((p) => ({
    name: p.name,
    value: [p.value[1], -p.value[0], p.level],
  }))

  return {
    tooltip: {
      trigger: 'item' as const,
      backgroundColor: 'rgba(6, 20, 50, 0.9)',
      borderColor: 'rgba(0, 180, 255, 0.4)',
      textStyle: { color: '#c8e6ff', fontSize: 12 },
      formatter: (p: { name: string; value: number[] }) =>
        `<b>${p.name}</b><br/>状态: ${STATUS_TEXT[p.value[2]] || '未知'}`,
    },
    grid: { top: 8, left: 50, right: 16, bottom: 16 },
    xAxis: {
      type: 'value',
      name: '机柜',
      min: 0,
      max: 13,
      interval: 1,
      axisLabel: { color: '#6688aa', fontSize: 10 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    },
    yAxis: {
      type: 'value',
      name: '机房',
      min: -6,
      max: 0,
      interval: 1,
      axisLabel: {
        color: '#8899bb',
        fontSize: 10,
        formatter: (v: number) => ROOM_LABELS[-v] || '',
      },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    },
    series: [
      {
        type: 'effectScatter',
        data: points,
        symbolSize: 14,
        showEffectOn: 'render',
        rippleEffect: { brushType: 'stroke' as const, scale: 2.5, period: 3 },
        itemStyle: {
          color: (p: { value: number[] }) => STATUS_COLORS[p.value[2]] || '#00d4ff',
          shadowBlur: 6,
          shadowColor: 'rgba(0,200,255,0.3)',
        },
        label: {
          show: true,
          position: 'right' as const,
          formatter: '{b}',
          color: '#8899bb',
          fontSize: 9,
        },
        zlevel: 1,
      },
    ],
  }
})
</script>
