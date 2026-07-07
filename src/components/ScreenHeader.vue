<template>
  <header class="screen-header">
    <div class="screen-header__left">
      <div class="screen-header__logo">
        <span class="screen-header__logo-icon">如</span>
      </div>
      <span class="screen-header__subtitle">数据可视化平台</span>
    </div>
    <div class="screen-header__center">
      <h1 class="screen-header__title">如意数据大屏 RuyiBigScreen</h1>
      <div class="screen-header__line" />
    </div>
    <div class="screen-header__right">
      <div class="screen-header__time">
        <span class="screen-header__time-icon">⏱</span>
        <span>{{ currentTime }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  currentTime: string
}>()
</script>

<style scoped>
.screen-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 16px;
  background: linear-gradient(180deg, rgba(0, 100, 200, 0.15) 0%, transparent 100%);
  border-bottom: 1px solid rgba(0, 180, 255, 0.2);
  position: relative;
}

.screen-header__left,
.screen-header__right {
  flex: 0 0 240px;
  display: flex;
  align-items: center;
}

.screen-header__left {
  gap: 12px;
}

.screen-header__logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #00d4ff, #0066ff);
  display: flex;
  align-items: center;
  justify-content: center;
}

.screen-header__logo-icon {
  font-size: 22px;
  color: #fff;
  font-weight: 700;
}

.screen-header__subtitle {
  font-size: 13px;
  color: #6688aa;
  letter-spacing: 1px;
}

.screen-header__center {
  flex: 1;
  text-align: center;
}

.screen-header__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #e0f0ff;
  letter-spacing: 3px;
  background: linear-gradient(90deg, #00d4ff, #7c8dff, #00d4ff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.screen-header__line {
  height: 1px;
  margin: 4px auto 0;
  width: 60%;
  background: linear-gradient(90deg, transparent, rgba(0, 200, 255, 0.5), transparent);
}

.screen-header__right {
  justify-content: flex-end;
}

.screen-header__time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #aac8e0;
  font-family: 'Consolas', monospace;
  letter-spacing: 1px;
}

.screen-header__time-icon {
  font-size: 16px;
}
</style>
