type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  data?: unknown
  timestamp: string
}

type LogHandler = (entry: LogEntry) => void

class Logger {
  private handlers: LogHandler[] = []
  private minLevel: LogLevel = 'debug'

  constructor() {
    // 开发环境默认输出到 console
    if (import.meta.env.DEV) {
      this.addHandler((entry) => {
        const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`
        switch (entry.level) {
          case 'debug':
            console.debug(prefix, entry.message, entry.data ?? '')
            break
          case 'info':
            console.info(prefix, entry.message, entry.data ?? '')
            break
          case 'warn':
            console.warn(prefix, entry.message, entry.data ?? '')
            break
          case 'error':
            console.error(prefix, entry.message, entry.data ?? '')
            break
        }
      })
    }
  }

  /** 添加日志处理器（用于接入 Sentry 等平台） */
  addHandler(handler: LogHandler): void {
    this.handlers.push(handler)
  }

  /** 设置最低日志级别 */
  setLevel(level: LogLevel): void {
    this.minLevel = level
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
    return levels.indexOf(level) >= levels.indexOf(this.minLevel)
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    }

    for (const handler of this.handlers) {
      try {
        handler(entry)
      } catch (e) {
        // 避免日志处理器的错误影响主流程
        console.error('Log handler error:', e)
      }
    }
  }

  debug(message: string, data?: unknown): void {
    this.log('debug', message, data)
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data)
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data)
  }

  error(message: string, data?: unknown): void {
    this.log('error', message, data)
  }
}

export const logger = new Logger()
