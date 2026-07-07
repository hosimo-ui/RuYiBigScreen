<template>
  <div class="metric-card" :class="`metric-card--${variant}`">
    <div class="metric-card__icon">
      <span v-html="icon" />
    </div>
    <div class="metric-card__content">
      <div class="metric-card__label">{{ label }}</div>
      <div class="metric-card__value">
        <span class="metric-card__number">{{ displayValue }}</span>
        <span v-if="unit" class="metric-card__unit">{{ unit }}</span>
      </div>
    </div>
    <div class="metric-card__decoration" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatNumber } from '@/utils/format'

const props = defineProps<{
  label: string
  value: number
  unit?: string
  icon?: string
  variant?: 'primary' | 'success' | 'warning' | 'info'
  decimals?: number
}>()

const displayValue = computed(() => {
  if (props.decimals !== undefined) {
    return props.value.toFixed(props.decimals)
  }
  return formatNumber(props.value)
})
</script>

<style scoped>
.metric-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 6px;
  background: linear-gradient(135deg, rgba(6, 24, 54, 0.9) 0%, rgba(10, 35, 75, 0.75) 100%);
  border: 1px solid rgba(0, 180, 255, 0.2);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.metric-card__decoration {
  position: absolute;
  right: -20px;
  top: -20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  opacity: 0.08;
  pointer-events: none;
}

.metric-card--primary .metric-card__decoration {
  background: #00d4ff;
}

.metric-card--success .metric-card__decoration {
  background: #00e676;
}

.metric-card--warning .metric-card__decoration {
  background: #ffab40;
}

.metric-card--info .metric-card__decoration {
  background: #7c4dff;
}

.metric-card__icon {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.metric-card--primary .metric-card__icon {
  background: rgba(0, 212, 255, 0.15);
  color: #00d4ff;
}

.metric-card--success .metric-card__icon {
  background: rgba(0, 230, 118, 0.15);
  color: #00e676;
}

.metric-card--warning .metric-card__icon {
  background: rgba(255, 171, 64, 0.15);
  color: #ffab40;
}

.metric-card--info .metric-card__icon {
  background: rgba(124, 77, 255, 0.15);
  color: #7c4dff;
}

.metric-card__content {
  flex: 1;
  min-width: 0;
}

.metric-card__label {
  font-size: 13px;
  color: #8899bb;
  margin-bottom: 4px;
}

.metric-card__value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.metric-card__number {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  font-family: 'DIN Alternate', 'Consolas', monospace;
  letter-spacing: 1px;
}

.metric-card__unit {
  font-size: 13px;
  color: #6688aa;
}
</style>
