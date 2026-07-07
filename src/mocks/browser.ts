import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
import { logger } from '@/logs/logger'

export const worker = setupWorker(...handlers)

export async function startMockService(): Promise<void> {
  if (import.meta.env.VITE_DATA_SOURCE === 'mock') {
    logger.info('Starting MSW mock service...')
    await worker.start({
      onUnhandledRequest: 'bypass',
    })
    logger.info('MSW mock service started successfully')
  } else {
    logger.info('VITE_DATA_SOURCE is not mock, skipping MSW')
  }
}
