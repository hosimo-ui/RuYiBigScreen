<template>
  <div class="app-root">
    <DashboardView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import DashboardView from '@/views/DashboardView.vue'
import { initScreenResize } from '@/utils/resize'
import { logger } from '@/logs/logger'

onMounted(() => {
  const container = document.querySelector('.app-root') as HTMLElement
  if (container) {
    initScreenResize(container)
    logger.info('Screen resize initialized')
  }
})
</script>

<style>
.app-root {
  width: 1920px;
  height: 1080px;
  overflow: hidden;
}
</style>
