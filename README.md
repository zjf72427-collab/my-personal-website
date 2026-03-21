# 木Z — 个人主页

> 探索 · 创造 · 突破边界

一个基于 Vue 3 + Vite 构建的赛博朋克风格个人主页，记录技术思考、创作实验与折腾痕迹。

---

## 核心功能

| 模块 | 说明 |
|------|------|
| **Hero** | 打字机动效欢迎屏，滚动扫描线背景 |
| **About** | 角色轮播打字动效，个人简介 |
| **Skills** | 技术栈可视化展示 |
| **ContestCard** | 竞赛 / 项目卡片展示 |
| **GeekSpace** | 算法题解折叠面板 |
| **HardLab** | 仿终端 UI，VMware / Linux / GNS3 实验记录 |
| **DigitalGarden** | Markdown 知识库，零依赖自研渲染器 + highlight.js 代码高亮 |
| **PostsSection** | 博客文章索引 |
| **GameShowcase** | 独立游戏展示区 |
| **GuestBook** | 留言本 |
| **MusicPlayer** | HTML5 音乐播放器（右下角悬浮） |
| **BgEffects** | Canvas 矩阵雨动态背景 |
| **BootScreen** | 开机启动动画 |

## 技术栈

- **框架**: Vue 3 + Vite 7 + TypeScript
- **路由**: vue-router 4（Hash 模式）
- **样式**: SCSS + Tailwind CSS 4
- **UI**: Element Plus（按需自动导入）
- **状态**: Pinia + @vueuse/core
- **代码高亮**: highlight.js
- **自动导入**: unplugin-auto-import（ref / reactive / onMounted 无需手动 import）
- **Markdown**: 自研零依赖渲染器（`src/views/home/composables/useMarkdown.ts`）

## 目录结构

```
src/views/home/
├── index.vue                    # 主页入口
├── style.scss                   # 全局样式
├── components/                  # 各功能区块组件
├── pages/
│   ├── DigitalGardenPage.vue    # /garden 路由
│   └── LabPage.vue              # /lab 路由
├── data/
│   └── contestProject.ts        # 竞赛项目数据（在此编辑卡片内容）
├── content/                     # Markdown 内容文件
│   ├── algorithms.md
│   ├── cv-paper-01.md
│   └── communication-circuit.md
└── composables/
    └── useMarkdown.ts           # 自研 MD 渲染器
```

## 本地运行

**环境要求**: Node.js >= 20.19.0，pnpm >= 8.8.0

```bash
# 克隆项目
git clone https://github.com/zjf72427/my-personal-website.git
cd my-personal-website

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

```bash
# 构建生产版本
pnpm build
```

## 路由

| 路径 | 页面 |
|------|------|
| `/` | 主页 |
| `/garden` | 数字花园（知识库） |
| `/lab` | 实验室 |

## 主题

支持深色 / 浅色双主题切换，偏好持久化至 `localStorage('muz-theme')`。

## 音乐

将 mp3 放至 `public/music/spring-snow.mp3` 即可。

---

© 2026 木Z — All rights reserved &nbsp;·&nbsp; `// SYSTEM v2.0.0`
