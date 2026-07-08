<template>
  <BasePanel title="主机负载排名">
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
import { BarChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import type { RankingItem } from '@/types/dashboard'

use([CanvasRenderer, BarChart, TooltipComponent, GridComponent])

const props = defineProps<{
  data: RankingItem[]
}>()

const chartOption = computed(() => {
  const names = props.data.map((d) => d.name).reverse()
  const values = props.data.map((d) => d.value).reverse()

  return {
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: 'rgba(6, 20, 50, 0.9)',
      borderColor: 'rgba(0, 180, 255, 0.4)',
      textStyle: { color: '#c8e6ff', fontSize: 12 },
      formatter: (params: { name: string; value: number }[]) => {
        const p = params[0]
        return `${p.name}<br/>访问量: ${p.value.toLocaleString()}`
      },
    },
    grid: {
      top: 6,
      left: 10,
      right: 30,
      bottom: 4,
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisLabel: {
        color: '#6688aa',
        fontSize: 10,
        formatter: (v: number) => (v >= 10000 ? (v / 10000).toFixed(1) + 'w' : v),
      },
    },
    yAxis: {
      type: 'category',
      data: names,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } },
      axisTick: { show: false },
      axisLabel: { color: '#c8e6ff', fontSize: 11 },
    },
    series: [
      {
        type: 'bar',
        data: values.map((v, i) => ({
          value: v,
          itemStyle: {
            color: {
              type: 'linear' as const,
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: 'rgba(0,180,255,0.6)' },
                { offset: 1, color: i < 3 ? '#00d4ff' : 'rgba(0,180,255,0.4)' },
              ],
            },
            borderRadius: [0, 4, 4, 0],
          },
        })),
        barWidth: 16,
        label: {
          show: true,
          position: 'right' as const,
          color: '#8899bb',
          fontSize: 10,
          formatter: (p: { value: number }) =>
            p.value >= 10000 ? (p.value / 10000).toFixed(1) + 'w' : p.value.toLocaleString(),
        },
      },
    ],
  }
})
</script>
