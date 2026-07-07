<template>
  <BasePanel title="全国态势总览">
    <VChart
      :option="chartOption"
      :autoresize="true"
      style="height: 100%; min-height: 360px"
    />
  </BasePanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ScatterChart, EffectScatterChart, LinesChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import type { MapPoint } from '@/types/dashboard'

use([CanvasRenderer, ScatterChart, EffectScatterChart, LinesChart, TooltipComponent, GridComponent])

const props = defineProps<{
  data: MapPoint[]
}>()

// 中国城市坐标映射到 0-100 范围
const COORD_MAP: Record<string, [number, number]> = {
  北京: [65, 78],
  上海: [78, 52],
  广州: [62, 18],
  深圳: [63, 15],
  杭州: [74, 48],
  成都: [30, 35],
  武汉: [58, 45],
  南京: [72, 54],
  重庆: [36, 28],
  西安: [38, 52],
}

const chartOption = computed(() => {
  const points = props.data
    .filter((p) => COORD_MAP[p.name])
    .map((p) => ({
      name: p.name,
      value: [...COORD_MAP[p.name], p.level * 8],
    }))

  return {
    tooltip: {
      trigger: 'item' as const,
      backgroundColor: 'rgba(6, 20, 50, 0.9)',
      borderColor: 'rgba(0, 180, 255, 0.4)',
      textStyle: { color: '#c8e6ff', fontSize: 12 },
      formatter: (p: { name: string; value: number[] }) =>
        `<b>${p.name}</b><br/>活跃指数: ${((p.value[2] / 8) * 20).toFixed(0)}`,
    },
    grid: {
      top: 8,
      left: 8,
      right: 8,
      bottom: 8,
    },
    xAxis: {
      type: 'value',
      min: 0,
      max: 100,
      show: false,
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      show: false,
    },
    series: [
      // 背景连接线
      {
        type: 'lines',
        coordinateSystem: 'cartesian2d',
        polyline: false,
        data: generateConnections(points),
        lineStyle: {
          color: 'rgba(0, 180, 255, 0.12)',
          width: 0.5,
          curveness: 0.2,
        },
        effect: {
          show: true,
          period: 8,
          trailLength: 0.2,
          symbolSize: 3,
          color: 'rgba(0, 212, 255, 0.5)',
        },
        zlevel: 0,
      },
      // 普通闪烁点
      {
        type: 'effectScatter',
        data: points,
        symbolSize: (val: number[]) => Math.max(val[2], 6),
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke' as const,
          scale: 3,
          period: 4,
          color: 'rgba(0, 212, 255, 0.4)',
        },
        itemStyle: {
          color: '#00d4ff',
          shadowBlur: 10,
          shadowColor: '#00d4ff',
        },
        label: {
          show: true,
          position: 'right' as const,
          formatter: '{b}',
          color: '#8899bb',
          fontSize: 10,
        },
        zlevel: 1,
      },
    ],
  }
})

function generateConnections(points: { value: number[] }[]): { coords: number[][] }[] {
  const result: { coords: number[][] }[] = []
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (Math.random() > 0.6) {
        result.push({
          coords: [points[i].value.slice(0, 2), points[j].value.slice(0, 2)],
        })
      }
    }
  }
  return result
}
</script>
