# 如意数据大屏 RuyiBigScreen

一个公开开源的教学型数据可视化大屏项目，帮助学生和初学者从 0 到 1 学习如何动手制作数据可视化大屏。

## 效果预览

![如意数据大屏效果图](images/1.png)

## 复现步骤

本项目有两种运行模式：Docker MySQL 真实数据（默认），以及纯前端 mock 模式。

### 方式一：Docker MySQL 模式（默认，推荐）

```bash
# 1. 克隆项目
git clone git@github.com:hosimo-ui/RuYiBigScreen.git
cd RuYiBigScreen

# 2. 安装依赖
npm install

# 3. 启动 Docker MySQL（需先导入数据，见下方说明）
docker start mysql8

# 4. 启动 API 服务器（终端1）
npm run api

# 5. 启动前端（终端2）
npm run dev
```

浏览器打开 `http://localhost:10001`，即可看到服务器监控大屏，数据每 10 秒自动从 MySQL 刷新。

**Docker MySQL 数据导入**（仅首次）：

```bash
# 将 .dat 文件拷贝到 Docker 容器可访问的路径
docker cp server/data mysql8:/var/lib/mysql-files/

# 执行建表导入脚本
docker exec -i mysql8 mysql -u root -p123456 < server/setup.sql
```

### 方式二：纯前端 mock 模式（无需 Docker）

如果不想折腾数据库，可以切回前端内置模拟数据：

修改项目根目录 `.env`：

```env
VITE_DATA_SOURCE=mock
```

然后只需：

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:10001` 即可。数据由前端内存模拟器实时生成。

### 关闭项目

- 前端开发服务器：终端按 `Ctrl + C`
- API 服务器：终端按 `Ctrl + C`
- Docker MySQL：`docker stop mysql8`

### 环境要求

- Node.js >= 18
- npm >= 9
- Docker（仅方式一需要）

---

## 页面内容

打开后看到的大屏包含：

| 区域     | 内容                                                     |
| -------- | -------------------------------------------------------- |
| 顶部     | 标题"如意数据大屏 RuyiBigScreen" + 实时时钟               |
| 中上     | 4 个核心指标卡片（主机总数、采集记录数、CPU使用率、磁盘使用率） |
| 中间靠左 | 主机实时状态（8 台服务器节点，状态灯+进度条）              |
| 中间靠右 | 主机状态矩阵（机房×机柜散点图，20 台主机）                |
| 左侧     | CPU与内存趋势折线图 + 机房分布饼图                         |
| 右侧     | 主机负载排名柱状图 + 系统健康雷达图                        |
| 底部     | 监控告警列表（来自数据库真实异常值）                       |

---

## 开发命令

| 命令                   | 说明                                |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | 启动前端开发服务器（端口 10001）     |
| `npm run api`          | 启动 API 服务器（端口 8080）        |
| `npm run build`        | 生产构建（输出到 dist/）            |
| `npm run preview`      | 预览生产构建                        |
| `npm run lint`         | ESLint 代码检查                     |
| `npm run format`       | Prettier 格式化                     |
| `npm run test`         | 运行单元测试                        |
| `npm run test:e2e`     | 运行 E2E 测试                       |
| `npm run type-check`   | TypeScript 类型检查                 |

---

## 切换数据源

通过项目根目录 `.env` 中的 `VITE_DATA_SOURCE` 控制：

```env
# Docker MySQL 模式（默认，需先启动 npm run api）
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=http://localhost:8080/api

# 纯前端 mock 模式（无需后端，数据由内存模拟器生成）
VITE_DATA_SOURCE=mock
```

切换后重启 `npm run dev` 即可生效，无需修改任何组件代码。

**mock / api 共用同一套 Service 层**，架构不变：

---

## 技术栈

| 技术        | 用途       |
| ----------- | ---------- |
| Vue 3       | 前端框架   |
| Vite 6      | 构建工具   |
| TypeScript  | 类型安全   |
| ECharts 5   | 图表渲染   |
| Pinia 2     | 状态管理   |
| Axios       | HTTP 请求  |
| MSW 2       | Mock 服务  |
| Vitest 2    | 单元测试   |
| Playwright  | E2E 测试   |
| ESLint 8    | 代码规范   |
| Prettier 3  | 代码格式化 |
| Stylelint   | 样式规范   |

---

## 项目结构

```
RuyiBigScreen/
├── public/                          # 静态资源（含 MSW Service Worker）
├── images/                          # 文档素材（效果图等）
├── server/                          # API 服务器
│   ├── index.cjs                    # Express API（连接 Docker MySQL）
│   ├── setup.sql                    # 建库建表脚本
│   └── data/                        # 原始数据文件（.dat）
├── src/
│   ├── app/                         # 应用入口
│   │   ├── App.vue
│   │   └── main.ts
│   ├── components/                  # 通用组件
│   │   ├── BasePanel.vue            # 面板容器
│   │   ├── MetricCard.vue           # 指标卡片
│   │   └── ScreenHeader.vue         # 顶部标题栏
│   ├── charts/                      # 图表组件
│   │   ├── LineTrendChart.vue       # 访问趋势折线图
│   │   ├── BarRankingChart.vue      # 城市排名柱状图
│   │   ├── PieStatusChart.vue       # 分类占比饼图
│   │   ├── RadarAbilityChart.vue    # 能力雷达图
│   │   ├── MapOverviewChart.vue     # 全国态势总览
│   │   └── DataHubChart.vue         # 如意数据中枢
│   ├── views/
│   │   └── DashboardView.vue        # 主视图
│   ├── layouts/
│   │   └── BigScreenLayout.vue      # 大屏布局
│   ├── services/                    # 数据访问层
│   │   ├── http.ts                  # Axios 实例
│   │   ├── dashboardService.ts      # 数据服务
│   │   └── dataSource.ts            # 数据源切换（mock/api）
│   ├── mocks/                       # Mock 数据层
│   │   ├── browser.ts               # MSW 启动
│   │   ├── handlers.ts              # MSW 请求处理器
│   │   ├── dashboardMock.ts         # 初始 mock 数据
│   │   └── realtimeDashboardSimulator.ts  # 实时模拟器
│   ├── stores/
│   │   └── dashboardStore.ts        # Pinia 状态
│   ├── utils/
│   │   ├── format.ts                # 格式化工具
│   │   └── resize.ts                # 大屏自适应缩放
│   ├── logs/
│   │   └── logger.ts                # 统一日志
│   ├── types/
│   │   └── dashboard.ts             # 类型定义
│   ├── styles/
│   │   └── global.css               # 全局样式
│   └── tests/
│       ├── unit/                    # 单元测试（23 个用例）
│       └── e2e/                     # E2E 测试（2 个用例）
├── index.html
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── tsconfig.json
├── .env.example                     # 环境变量模板
├── .eslintrc.cjs
├── .prettierrc
└── .stylelintrc.json
```

---

## 架构设计

### 数据流

```
组件 ← Pinia Store ← dashboardService ← dataSource
                                              ├── mock → 内存实时模拟器（帧计数驱动）
                                              └── api  → Axios → server/index.cjs → Docker MySQL8
```

### 数据更新机制

**API 模式**（当前默认）：前端每 10 秒发起一轮 HTTP 请求到 `server/index.cjs`，服务器查询 Docker MySQL8 并返回最新数据。

**Mock 模式**：`src/mocks/realtimeDashboardSimulator.ts` 基于帧计数器驱动，每 2 秒生成下一帧数据：

| 数据模块      | 刷新频率  | 变化规则                                  |
| ------------- | --------- | ----------------------------------------- |
| 指标卡        | 每 2 秒   | 访问量递增，用户数浮动，健康度 95~99.9    |
| 趋势          | 每 4 秒   | 滑动窗口追加新点，保留 10 个              |
| 动态列表      | 每 4 秒   | 新增一条消息，保留 8 条                   |
| 数据中枢      | 每 2 秒   | 8 个节点 value 微调，status 联动          |
| 排名          | 每 10 秒  | 各条目递增后重排                          |
| 分类占比      | 每 12 秒  | 各分类微调，总和恒为 100%                 |
| 雷达          | 每 30 秒  | 各维度 ±1~3 分                            |

### 关键设计原则

- **组件不直接读 mock 文件** — 所有数据通过 `services/` 层获取
- **mock / api 一键切换** — 改变环境变量即可
- **实时逻辑不在组件里** — 模拟器独立模块，Store 只负责调度

---

## 测试结果

```
✅ 单元测试：23/23 通过
✅ E2E 测试： 2/2  通过
✅ ESLint：   零错误
✅ 构建：     成功
```

---

## License

MIT
