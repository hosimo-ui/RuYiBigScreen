import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import BasePanel from '@/components/BasePanel.vue'
import { startMockService } from '@/mocks/browser'
import { logger } from '@/logs/logger'
import '../styles/global.css'

async function bootstrap() {
  logger.info('Starting RuyiBigScreen application...')

  // 启动 mock 服务
  await startMockService()

  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)

  // 全局注册 BasePanel（图表组件大量使用）
  app.component('BasePanel', BasePanel)

  app.mount('#app')

  logger.info('RuyiBigScreen application mounted')
}

bootstrap().catch((err) => {
  logger.error('Failed to bootstrap application', err)
  console.error('Bootstrap error:', err)
})
