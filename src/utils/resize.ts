/**
 * 大屏自适应缩放工具
 * 基于 1920x1080 设计稿等比缩放
 */

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

let resizeHandler: (() => void) | null = null

export function initScreenResize(container: HTMLElement): () => void {
  const handleResize = () => {
    const { innerWidth, innerHeight } = window
    const scaleX = innerWidth / DESIGN_WIDTH
    const scaleY = innerHeight / DESIGN_HEIGHT
    // 保持比例，取较小值
    const scale = Math.min(scaleX, scaleY)

    container.style.transform = `scale(${scale})`
    container.style.transformOrigin = 'left top'
    container.style.width = `${DESIGN_WIDTH}px`
    container.style.height = `${DESIGN_HEIGHT}px`

    // 居中
    const offsetX = (innerWidth - DESIGN_WIDTH * scale) / 2
    const offsetY = (innerHeight - DESIGN_HEIGHT * scale) / 2
    container.style.position = 'absolute'
    container.style.left = `${offsetX}px`
    container.style.top = `${offsetY}px`
  }

  handleResize()
  resizeHandler = handleResize
  window.addEventListener('resize', handleResize)

  return () => {
    window.removeEventListener('resize', handleResize)
  }
}

export function destroyScreenResize(): void {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
}
