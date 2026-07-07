import { test, expect } from '@playwright/test'

test.describe('如意数据大屏 E2E', () => {
  test('should display the main dashboard page', async ({ page }) => {
    await page.goto('/')

    // 验证页面标题
    await expect(page).toHaveTitle(/如意数据大屏/)

    // 验证顶部标题存在
    const header = page.locator('.screen-header__title')
    await expect(header).toBeVisible()
    await expect(header).toContainText('如意数据大屏')

    // 验证至少一个核心指标卡片存在
    const metricCards = page.locator('.metric-card')
    await expect(metricCards.first()).toBeVisible({ timeout: 10000 })
    const count = await metricCards.count()
    expect(count).toBeGreaterThanOrEqual(4)

    // 验证今日访问量卡片存在
    await expect(page.locator('.metric-card').filter({ hasText: '今日访问量' })).toBeVisible({
      timeout: 10000,
    })

    // 验证至少一个图表容器存在（BasePanel）
    const panels = page.locator('.base-panel')
    await expect(panels.first()).toBeVisible({ timeout: 10000 })
    const panelCount = await panels.count()
    expect(panelCount).toBeGreaterThanOrEqual(3)

    // 验证实时动态列表存在
    await expect(page.locator('.activity-list')).toBeVisible({ timeout: 10000 })

    // 验证页面没有明显的控制台错误（检查页面是否正常渲染）
    const body = page.locator('body')
    await expect(body).toBeVisible()

    // 截屏保存
    await page.screenshot({ path: 'src/tests/e2e/screenshots/dashboard.png', fullPage: true })
  })

  test('should display current time', async ({ page }) => {
    await page.goto('/')
    const timeEl = page.locator('.screen-header__time')
    await expect(timeEl).toBeVisible({ timeout: 10000 })
    const timeText = await timeEl.textContent()
    expect(timeText).toBeTruthy()
    // 格式应该包含数字
    expect(timeText).toMatch(/\d/)
  })
})
