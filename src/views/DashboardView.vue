<template>
  <div v-if="store.loading && !store.isLoaded" class="dashboard-loading">
    <div class="dashboard-loading__spinner" />
    <p>加载数据中...</p>
  </div>
  <div v-else-if="store.error" class="dashboard-error">
    <p>数据加载失败: {{ store.error }}</p>
    <button @click="store.loadAllData()">重试</button>
  </div>
  <BigScreenLayout v-else />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import BigScreenLayout from '@/layouts/BigScreenLayout.vue'
import { useDashboardStore } from '@/stores/dashboardStore'

const store = useDashboardStore()

onMounted(async () => {
  if (!store.isLoaded) {
    await store.loadAllData()
  }
  store.startTimeUpdate()
  store.startRealtime()
})

onUnmounted(() => {
  store.stopTimeUpdate()
  store.stopRealtime()
})
</script>

<style scoped>
.dashboard-loading,
.dashboard-error {
  width: 1920px;
  height: 1080px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #080e1a;
  color: #8899bb;
  font-size: 16px;
}

.dashboard-loading__spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 180, 255, 0.2);
  border-top-color: #00d4ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.dashboard-error button {
  margin-top: 12px;
  padding: 8px 24px;
  border: 1px solid rgba(0, 180, 255, 0.4);
  border-radius: 4px;
  background: rgba(0, 180, 255, 0.1);
  color: #00d4ff;
  cursor: pointer;
  font-size: 14px;
}

.dashboard-error button:hover {
  background: rgba(0, 180, 255, 0.2);
}
</style>
