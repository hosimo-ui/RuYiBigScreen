<template>
  <BasePanel title="主机实时状态">
    <div class="hub-grid">
      <div
        v-for="node in data"
        :key="node.name"
        class="hub-node"
        :class="`hub-node--${node.status}`"
      >
        <div class="hub-node__ring" />
        <div class="hub-node__info">
          <span class="hub-node__name">{{ node.name }}</span>
          <span class="hub-node__value">{{ node.value }}</span>
        </div>
        <div class="hub-node__bar">
          <div
            class="hub-node__bar-fill"
            :style="{ width: node.value + '%' }"
          />
        </div>
      </div>
    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import type { HubNode } from '@/types/dashboard'

defineProps<{
  data: HubNode[]
}>()
</script>

<style scoped>
.hub-grid {
  position: absolute;
  inset: 6px 8px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 10px;
  padding: 4px;
}

.hub-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px;
  border-radius: 6px;
  background: rgba(6, 24, 54, 0.6);
  border: 1px solid rgba(0, 180, 255, 0.15);
  position: relative;
  overflow: hidden;
  transition: border-color 0.4s, background 0.4s;
}

.hub-node--good {
  border-color: rgba(0, 200, 100, 0.35);
  background: rgba(0, 200, 100, 0.06);
}

.hub-node--warning {
  border-color: rgba(255, 171, 64, 0.45);
  background: rgba(255, 171, 64, 0.08);
}

.hub-node--danger {
  border-color: rgba(255, 82, 82, 0.5);
  background: rgba(255, 82, 82, 0.08);
}

.hub-node__ring {
  position: absolute;
  top: 6px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.hub-node--good .hub-node__ring {
  background: #00e676;
  box-shadow: 0 0 6px #00e676;
}

.hub-node--warning .hub-node__ring {
  background: #ffab40;
  box-shadow: 0 0 6px #ffab40;
  animation: pulse-warn 2s infinite;
}

.hub-node--danger .hub-node__ring {
  background: #ff5252;
  box-shadow: 0 0 8px #ff5252;
  animation: pulse-danger 1.2s infinite;
}

@keyframes pulse-warn {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@keyframes pulse-danger {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

.hub-node__info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.hub-node__name {
  font-size: 12px;
  color: #c8e6ff;
  letter-spacing: 1px;
}

.hub-node__value {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  font-family: 'Consolas', monospace;
}

.hub-node__bar {
  width: 100%;
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.hub-node__bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.6s ease-out;
}

.hub-node--good .hub-node__bar-fill {
  background: linear-gradient(90deg, #00c853, #00e676);
}

.hub-node--warning .hub-node__bar-fill {
  background: linear-gradient(90deg, #ff9100, #ffab40);
}

.hub-node--danger .hub-node__bar-fill {
  background: linear-gradient(90deg, #d50000, #ff5252);
}
</style>
