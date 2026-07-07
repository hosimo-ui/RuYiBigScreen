<template>
  <BasePanel title="能力雷达">
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
import { RadarChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import type { RadarData } from '@/types/dashboard'

use([CanvasRenderer, RadarChart, TooltipComponent, LegendComponent])

const props = defineProps<{
  data: RadarData
}>()

const chartOption = computed(() => ({
  tooltip: {
    backgroundColor: 'rgba(6, 20, 50, 0.9)',
    borderColor: 'rgba(0, 180, 255, 0.4)',
    textStyle: { color: '#c8e6ff', fontSize: 12 },
  },
  legend: {
    bottom: 0,
    textStyle: { color: '#8899bb', fontSize: 11 },
  },
  radar: {
    center: ['50%', '45%'],
    radius: '65%',
    indicator: props.data.indicators,
    axisName: { color: '#8899bb', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
    splitArea: {
      areaStyle: {
        color: ['rgba(0,180,255,0.03)', 'rgba(0,180,255,0.06)'],
      },
    },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
  },
  series: props.data.series.map((s, i) => ({
    type: 'radar' as const,
    name: s.name,
    data: [{ value: s.values, name: s.name }],
    symbol: 'circle',
    symbolSize: 4,
    lineStyle: {
      width: 2,
      color: i === 0 ? '#00d4ff' : '#ffab40',
    },
    areaStyle: {
      color: i === 0 ? 'rgba(0,212,255,0.2)' : 'rgba(255,171,64,0.1)',
    },
    itemStyle: {
      color: i === 0 ? '#00d4ff' : '#ffab40',
    },
  })),
}))
</script>
