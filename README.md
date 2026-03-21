# 木Z · 个人主页

> 探索 · 创造 · 突破边界

一个赛博朋克风格的全栈个人主页，前端基于 Vue 3 + Vite，后端基于 Express + Prisma + SQLite，支持暗黑/浅色双主题、JWT 鉴权管理后台与实时数据渲染。

---

## 前端特色功能

### 暗黑 / 浅色双主题

- 一键切换深色（`#060c14` 宇宙黑）与浅色模式，偏好持久化至 `localStorage`
- 深色模式：青色 `#00f5ff` + 粉色 `#ff006e` + 紫色 `#7b2fff` 三色霓虹体系
- 全局 `data-theme` attribute 驱动，所有组件响应式适配

### Canvas 矩阵雨背景

- `BgEffects.vue` — 原生 Canvas 实现的滚动字符雨
- 性能优化：`requestAnimationFrame` + 可见性检测自动暂停

### 10CM《春雪》音乐播放器

- `MusicPlayer.vue` — 右下角悬浮式 HTML5 音频播放器
- 支持播放/暂停、进度条拖拽、音量控制
- 配乐：10CM《봄이 좋냐 (春雪)》，`public/music/spring-snow.mp3`
- 磁盘转动动效 + 歌词氛围渐变

### 开机启动动画

- `BootScreen.vue` — 仿终端系统启动序列，逐行打印 log
- 首次访问自动触发，`sessionStorage` 防重复播放

### 数字花园 (Digital Garden)

- Markdown 知识库，零依赖自研渲染器 + highlight.js 代码高亮
- 支持全文搜索，展开时从后端 API 懒加载内容
- 本地 `.md` 文件兜底，后端离线时优雅降级

### HardLab 终端实验室

- 仿终端 UI 风格，记录 VMware / Linux / GNS3 网络实验
- 命令行打字动效，绿色 `#00ff41` phosphor 配色

### Admin 管理后台

- JWT 登录保护（`/admin`），Token 存储于 `localStorage`
- 文章发布/编辑/删除，支持 Markdown 正文 + 分类 + 公开/私密
- 大赛开发进度管理（三人计算机设计大赛）
- 所有写请求自动携带 `Authorization: Bearer <token>`

---

## 后端架构

```
E:/wz/server/
├── src/index.js          # Express 主服务
├── prisma/
│   ├── schema.prisma     # 数据库模型定义
│   └── dev.db            # SQLite 本地数据库（已 gitignore）
└── .env                  # 环境变量（已 gitignore）
```

### Prisma ORM + SQLite

| 数据表 | 说明 |
|--------|------|
| `Article` | 专业笔记，含标题/Markdown内容/分类/是否公开 |
| `ProjectUpdate` | 大赛开发进度动态 |
| `GameScore` | 「财源滚滚」游戏排行榜，按分数降序索引 |

### JWT 鉴权体系

- `POST /api/auth/login` — 账号密码登录，签发 7 天有效 JWT
- `GET /api/auth/verify` — 验证 token 有效性
- 所有写操作（POST/PUT/DELETE）受 `authMiddleware` 保护
- GET 读取接口公开，无需 token

### RESTful API

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| POST | `/api/auth/login` | — | 管理员登录 |
| GET | `/api/articles` | — | 文章列表 |
| GET | `/api/articles/:id` | — | 单篇文章 |
| POST | `/api/articles` | JWT | 发布文章 |
| PUT | `/api/articles/:id` | JWT | 更新文章 |
| DELETE | `/api/articles/:id` | JWT | 删除文章 |
| GET | `/api/project-updates` | — | 进度列表 |
| POST/PUT/DELETE | `/api/project-updates` | JWT | 进度管理 |
| GET | `/api/scores` | — | 排行榜 Top 20 |
| POST | `/api/scores` | — | 提交分数 |

---

## 技术栈

**前端**
- Vue 3 + Vite 7 + TypeScript
- vue-router 4（Hash 模式）+ Pinia
- SCSS + Tailwind CSS 4 + Element Plus
- unplugin-auto-import（ref/reactive/onMounted 自动导入）
- highlight.js · @vueuse/core

**后端**
- Node.js + Express 4
- Prisma ORM + SQLite
- jsonwebtoken + dotenv
- CORS（限定前端端口）

---

## 本地运行

### 前端

```bash
cd art-design-pro
pnpm install
pnpm dev          # http://localhost:3007
```

### 后端

```bash
cd server
npm install
# 配置 .env（参考 .env.example）
npm run db:push   # 初始化数据库
npm run dev       # http://localhost:3008
```

### 路由

| 路径 | 说明 |
|------|------|
| `/` | 主页 |
| `/garden` | 数字花园 |
| `/lab` | 硬核实验室 |
| `/admin` | 管理后台（需登录） |

---

## 目录结构

```
E:/wz/
├── art-design-pro/          # 前端
│   └── src/views/home/
│       ├── components/      # 各功能区块
│       ├── pages/           # 子页面路由
│       ├── content/         # Markdown 源文件
│       ├── data/            # 静态数据
│       └── composables/     # useMarkdown 渲染器
└── server/                  # 后端
    ├── src/index.js
    ├── prisma/schema.prisma
    └── .env
```

---

© 2026 木Z — All rights reserved · `// SYSTEM v2.0.0`
