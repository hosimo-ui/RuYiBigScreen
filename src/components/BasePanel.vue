<template>
  <div class="base-panel">
    <div class="base-panel__header">
      <div class="base-panel__header-left">
        <span class="base-panel__dot" />
        <h3 class="base-panel__title">{{ title }}</h3>
      </div>
      <slot name="header-right" />
    </div>
    <div class="base-panel__body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style scoped>
.base-panel {
  height: 100%;
  background: linear-gradient(135deg, rgba(6, 24, 54, 0.85) 0%, rgba(10, 35, 75, 0.7) 100%);
  border: 1px solid rgba(0, 180, 255, 0.25);
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(4px);
  transition: border-color 0.3s;
}

.base-panel:hover {
  border-color: rgba(0, 200, 255, 0.5);
}

.base-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  border-bottom: 1px solid rgba(0, 180, 255, 0.15);
  background: linear-gradient(90deg, rgba(0, 150, 255, 0.12) 0%, transparent 100%);
}

.base-panel__header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.base-panel__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00d4ff;
  box-shadow: 0 0 6px #00d4ff;
  flex-shrink: 0;
}

.base-panel__title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #c8e6ff;
  letter-spacing: 1px;
  white-space: nowrap;
}

.base-panel__body {
  flex: 1;
  position: relative;
  padding: 6px 8px;
  min-height: 0;
}
</style>
