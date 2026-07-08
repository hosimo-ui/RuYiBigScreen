<template>
  <BasePanel title="机房分布">
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
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import type { CategoryItem } from '@/types/dashboard'

use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent])

const props = defineProps<{
  data: CategoryItem[]
}>()

const COLORS = ['#00d4ff', '#7c4dff', '#00e676', '#ffab40', '#ff5252']

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'item' as const,
    backgroundColor: 'rgba(6, 20, 50, 0.9)',
    borderColor: 'rgba(0, 180, 255, 0.4)',
    textStyle: { color: '#c8e6ff', fontSize: 12 },
    formatter: '{b}: {c}%',
  },
  legend: {
    bottom: 0,
    textStyle: { color: '#8899bb', fontSize: 11 },
    itemWidth: 10,
    itemHeight: 10,
  },
  series: [
    {
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 4,
        borderColor: 'rgba(6, 24, 54, 0.9)',
        borderWidth: 3,
      },
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold',
          color: '#fff',
        },
      },
      data: props.data.map((d, i) => ({
        value: d.value,
        name: d.name,
        itemStyle: { color: COLORS[i % COLORS.length] },
      })),
    },
  ],
}))
</script>
