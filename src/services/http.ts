import axios from 'axios'
import { logger } from '@/logs/logger'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    logger.debug(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    logger.error('[HTTP] Request error', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    logger.debug(`[HTTP] Response ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    logger.error('[HTTP] Response error', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    })
    return Promise.reject(error)
  },
)

export default http
