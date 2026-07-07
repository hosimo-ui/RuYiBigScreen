# 如意数据大屏 RuyiBigScreen

一个公开开源的教学型数据可视化大屏项目，主要用于帮助学生和初学者从 0 到 1 学习如何自己动手制作一个数据可视化大屏。

## 技术栈

| 技术        | 用途           |
| ----------- | -------------- |
| Vue 3       | 前端框架       |
| Vite 6      | 构建工具       |
| TypeScript  | 类型安全       |
| ECharts 5   | 数据可视化图表 |
| Pinia 2     | 状态管理       |
| Axios       | HTTP 请求      |
| MSW 2       | Mock 数据服务  |
| Vitest 2    | 单元测试       |
| Playwright  | E2E 测试       |
| ESLint 8    | 代码规范检查   |
| Prettier 3  | 代码格式化     |
| Stylelint   | 样式规范检查   |

## 项目结构

```
RuyiBigScreen/
├── public/                      # 静态资源（含 MSW Service Worker）
├── src/
│   ├── app/                     # 应用入口
│   │   ├── App.vue              # 根组件
│   │   └── main.ts              # 启动入口
│   ├── assets/                  # 静态资源（字体等）
│   ├── components/              # 通用组件
│   │   ├── BasePanel.vue        # 面板容器组件
│   │   ├── MetricCard.vue       # 指标卡片组件
│   │   └── ScreenHeader.vue     # 屏幕顶部标题栏
│   ├── charts/                  # ECharts 图表组件
│   │   ├── LineTrendChart.vue   # 访问趋势折线图
│   │   ├── BarRankingChart.vue  # 城市排名柱状图
│   │   ├── PieStatusChart.vue   # 分类占比饼图
│   │   ├── RadarAbilityChart.vue# 能力雷达图
│   │   └── MapOverviewChart.vue # 全国态势总览图
│   ├── views/                   # 页面视图
│   │   └── DashboardView.vue    # 仪表板主视图
│   ├── layouts/                 # 布局组件
│   │   └── BigScreenLayout.vue  # 大屏布局
│   ├── services/                # 数据访问层
│   │   ├── http.ts              # Axios 实例（拦截器、日志）
│   │   ├── dashboardService.ts  # 仪表板数据服务
│   │   └── dataSource.ts        # 数据源切换（mock / api）
│   ├── mocks/                   # Mock 数据层
│   │   ├── browser.ts           # MSW 浏览器 Worker 启动
│   │   ├── handlers.ts          # MSW 请求处理器
│   │   └── dashboardMock.ts     # Mock 数据集
│   ├── stores/                  # Pinia 状态管理
│   │   └── dashboardStore.ts    # 仪表板状态
│   ├── utils/                   # 工具函数
│   │   ├── format.ts            # 数字/时间格式化
│   │   └── resize.ts            # 大屏自适应缩放
│   ├── logs/                    # 日志系统
│   │   └── logger.ts            # 统一日志（可扩展 Sentry）
│   ├── types/                   # TypeScript 类型定义
│   │   └── dashboard.ts         # 仪表板数据类型
│   ├── styles/                  # 全局样式
│   │   └── global.css           # 全局样式（暗色主题、滚动条）
│   └── tests/                   # 测试
│       ├── unit/                # 单元测试
│       │   ├── format.test.ts           # 格式化工具测试
│       │   └── dashboardService.test.ts # 数据服务测试
│       └── e2e/                 # E2E 测试
│           └── dashboard.spec.ts        # 页面集成测试
├── index.html                   # HTML 入口
├── package.json                 # 依赖与脚本
├── vite.config.ts               # Vite 配置
├── vitest.config.ts             # Vitest 配置
├── playwright.config.ts         # Playwright 配置
├── tsconfig.json                # TypeScript 配置
├── tsconfig.node.json           # Node 端 TS 配置
├── .env                         # 环境变量（开发）
├── .env.production              # 环境变量（生产）
├── .eslintrc.cjs                # ESLint 配置
├── .eslintignore                # ESLint 忽略规则
├── .prettierrc                  # Prettier 配置
├── .prettierignore              # Prettier 忽略规则
├── .stylelintrc.json            # Stylelint 配置
└── .gitignore                   # Git 忽略规则
```

## 环境要求

- Node.js >= 18
- npm >= 9

## 快速启动

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 浏览器访问
# http://localhost:3000
```

开发服务器启动后会自动打开浏览器。

## 启动后的验证

浏览器打开后，应该看到：

1. **顶部标题栏** — "如意数据大屏 RuyiBigScreen" + 实时时钟
2. **4 个核心指标卡片** — 今日访问量、实时订单数、活跃用户数、系统健康度
3. **左侧图表** — 访问趋势折线图 + 分类占比饼图
4. **中间区域** — 全国态势总览（城市散点 + 连线动效）
5. **右侧图表** — 城市排名柱状图 + 能力雷达图
6. **底部列表** — 实时动态告警列表

## 关闭项目

- **关闭开发服务器**：在终端中按 `Ctrl + C`
- **关闭浏览器页面**：关闭浏览器标签页即可

## 开发命令

| 命令                   | 说明                              |
| ---------------------- | --------------------------------- |
| `npm run dev`          | 启动开发服务器（端口 3000）       |
| `npm run build`        | 生产构建（输出到 dist/）          |
| `npm run preview`      | 预览生产构建                      |
| `npm run lint`         | ESLint 代码规范检查               |
| `npm run lint:style`   | Stylelint 样式规范检查            |
| `npm run format`       | Prettier 代码格式化               |
| `npm run test`         | 运行单元测试                      |
| `npm run test:watch`   | 单元测试（持续监听）              |
| `npm run test:coverage`| 单元测试 + 覆盖率报告             |
| `npm run test:e2e`     | 运行 E2E 测试                     |
| `npm run test:e2e:ui`  | E2E 测试（可视化界面）            |
| `npm run type-check`   | TypeScript 类型检查               |

## 切换数据源

### Mock 模式（默认）

`.env` 文件中配置：

```env
VITE_DATA_SOURCE=mock
```

使用 MSW (Mock Service Worker) 拦截 HTTP 请求，返回本地 mock 数据。

### API 模式

```env
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=http://your-api-server.com/api
```

切换到真实 API 请求，使用 Axios 发送 HTTP 请求到指定的后端服务。

**平滑切换原理**：
- 组件 → Pinia Store → `dashboardService` → `dataSource` 判断模式
- Mock 模式直接返回 mock 数据
- API 模式使用 Axios 发送真实 HTTP 请求
- **组件代码无需任何修改**，只需改变环境变量

**添加新的真实 API**：
1. 在 `src/mocks/handlers.ts` 中添加对应的 MSW handler（Mock 模式使用）
2. 在 `src/services/dashboardService.ts` 中添加对应的 Axios 调用（API 模式使用）
3. 确保 MSW handler 路径与 Axios 请求路径一致

## 页面设计

- **设计尺寸**：1920 × 1080（自适应浏览器窗口缩放）
- **主题风格**：科技感、深色背景、蓝青色视觉

## 架构设计要点

### 数据流

```
组件 ← Pinia Store ← dashboardService ← dataSource
                                              ├── mock → 本地 mock 数据
                                              └── api  → Axios HTTP 请求 → 后端 API
```

### 数据访问规范

- 页面组件**不能**直接读取 mock 文件
- 所有数据必须通过 `services/` 层获取
- 组件只依赖 Pinia Store 提供的数据

### 日志系统

`src/logs/logger.ts` 提供统一日志接口：

```ts
import { logger } from '@/logs/logger'

logger.debug('调试信息', data)
logger.info('操作信息', data)
logger.warn('警告信息', data)
logger.error('错误信息', data)

// 扩展接入 Sentry
logger.addHandler((entry) => {
  Sentry.captureMessage(entry.message, { level: entry.level })
})
```

## 依赖安装详情

### npm 依赖（D 盘，不占 C 盘空间）

所有 npm 包安装在 `d:\VscodeProjects\Ai_Agent\RuYiBigScreen\node_modules\`，约 19,289 个文件，存储在 D 盘。

| 依赖                           | 版本      | 用途           | 类别       |
| ------------------------------ | --------- | -------------- | ---------- |
| vue                            | ^3.5.13   | 前端框架       | 运行时     |
| vite                           | ^6.0.6    | 构建工具       | 开发       |
| typescript                     | ~5.7.2    | 类型安全       | 开发       |
| echarts                        | ^5.5.1    | 图表渲染       | 运行时     |
| vue-echarts                    | ^7.0.3    | ECharts Vue 封装| 运行时    |
| pinia                          | ^2.3.0    | 状态管理       | 运行时     |
| axios                          | ^1.7.9    | HTTP 请求      | 运行时     |
| dayjs                          | ^1.11.13  | 时间处理       | 运行时     |
| msw                            | ^2.7.0    | Mock 服务      | 开发       |
| vitest                         | ^2.1.8    | 单元测试       | 开发       |
| @vue/test-utils                | ^2.4.6    | Vue 测试工具   | 开发       |
| happy-dom                      | ^16.0.1   | 测试 DOM 环境  | 开发       |
| @playwright/test               | ^1.49.1   | E2E 测试       | 开发       |
| eslint                         | ^8.57.1   | 代码检查       | 开发       |
| @typescript-eslint/*           | ^8.19.0   | ESLint TS 支持 | 开发       |
| eslint-plugin-vue              | ^9.32.0   | ESLint Vue 支持| 开发       |
| prettier                       | ^3.4.2    | 代码格式化     | 开发       |
| stylelint                      | ^16.12.0  | 样式检查       | 开发       |
| vue-tsc                        | ^2.2.0    | Vue TS 类型检查| 开发       |
| @vitejs/plugin-vue             | ^5.2.1    | Vite Vue 插件  | 开发       |

### Playwright 浏览器（C 盘）

Playwright 下载的浏览器引擎安装在 **C 盘**：

```
C:\Users\32156\AppData\Local\ms-playwright\
├── chromium-1228/                   # Chromium 浏览器
├── chromium_headless_shell-1228/    # Headless Shell
├── ffmpeg-1011/                     # 视频录制支持
└── winldd-1007/                     # Windows DLL 依赖
```

**如果不使用 E2E 测试**，可以删除此目录释放 C 盘空间（约 300MB）。

## 测试结果

```
✅ 单元测试：15/15 全部通过
✅ E2E 测试： 2/2  全部通过
✅ ESLint：   零错误
✅ 构建：     成功
```
