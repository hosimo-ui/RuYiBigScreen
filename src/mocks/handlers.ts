import { http, HttpResponse, delay } from 'msw'
import { dashboardMockData } from './dashboardMock'
import { logger } from '@/logs/logger'

export const handlers = [
  http.get('/api/dashboard/summary', async () => {
    logger.debug('[MSW] GET /api/dashboard/summary')
    await delay(200)
    return HttpResponse.json({
      code: 0,
      data: dashboardMockData.summary,
      message: 'ok',
    })
  }),

  http.get('/api/dashboard/trend', async () => {
    logger.debug('[MSW] GET /api/dashboard/trend')
    await delay(300)
    return HttpResponse.json({
      code: 0,
      data: dashboardMockData.trend,
      message: 'ok',
    })
  }),

  http.get('/api/dashboard/categories', async () => {
    logger.debug('[MSW] GET /api/dashboard/categories')
    await delay(200)
    return HttpResponse.json({
      code: 0,
      data: dashboardMockData.categories,
      message: 'ok',
    })
  }),

  http.get('/api/dashboard/ranking', async () => {
    logger.debug('[MSW] GET /api/dashboard/ranking')
    await delay(250)
    return HttpResponse.json({
      code: 0,
      data: dashboardMockData.ranking,
      message: 'ok',
    })
  }),

  http.get('/api/dashboard/radar', async () => {
    logger.debug('[MSW] GET /api/dashboard/radar')
    await delay(200)
    return HttpResponse.json({
      code: 0,
      data: dashboardMockData.radar,
      message: 'ok',
    })
  }),

  http.get('/api/dashboard/activities', async () => {
    logger.debug('[MSW] GET /api/dashboard/activities')
    await delay(250)
    return HttpResponse.json({
      code: 0,
      data: dashboardMockData.activities,
      message: 'ok',
    })
  }),

  http.get('/api/dashboard/map-points', async () => {
    logger.debug('[MSW] GET /api/dashboard/map-points')
    await delay(200)
    return HttpResponse.json({
      code: 0,
      data: dashboardMockData.mapPoints,
      message: 'ok',
    })
  }),
]
