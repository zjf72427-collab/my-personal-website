export interface ContestMetric {
  label: string
  value: string
}

export interface ContestMember {
  name: string
  role: string
}

export interface ContestMilestone {
  name: string
  date: string
  progress: number
}

export interface ContestLink {
  label: string
  href: string
  external?: boolean
  primary?: boolean
}

export interface ContestDownload {
  label: string
  title: string
  href: string
}

export interface ContestTechGroup {
  label: string
  items: string[]
}

export interface ContestProject {
  badge: string
  status: string
  title: string
  subtitle: string
  summary: string
  desc: string
  role: string
  progress: number
  metrics: ContestMetric[]
  tags: string[]
  highlights: string[]
  members: ContestMember[]
  milestones: ContestMilestone[]
  links: ContestLink[]
  downloads: ContestDownload[]
  techGroups: ContestTechGroup[]
}

export const contestProject: ContestProject = {
  badge: '比赛项目 / SC171',
  status: '已完成可演示原型',
  title: '天地协同管理平台',
  subtitle: '// Air-Ground Collaborative Management Platform',
  summary: '面向无人机、传感器、摄像头等设备的实时监测、地图协同与智能预警平台。',
  desc:
    '项目围绕设备接入、实时监测、智能预警、数据分析和巡检报告构建完整业务闭环，适合比赛答辩、教学演示和原型验证。',
  role:
    '我负责将项目成果整合到个人网站展示，重点强化项目价值表达、信息层级和比赛场景下的可读性。',
  progress: 92,
  metrics: [
    { label: '接入对象', value: '无人机 / 传感器 / 摄像头 / 充电站' },
    { label: '核心能力', value: '监测、告警、地图、分析、报告' },
    { label: '展示价值', value: '比赛答辩、教学演示、原型验证' }
  ],
  tags: ['FastAPI', 'WebSocket', 'SQLite', 'Leaflet', 'ECharts', 'Docker'],
  highlights: [
    '支持设备注册、分组、状态监测与地图实时展示。',
    '支持超速、低电量、烟雾、围栏越界、离线等多类告警。',
    '支持 AI 诊断、异常分析、趋势预测和巡检报告生成。',
    '支持模拟器联调，便于项目演示与实验验证。'
  ],
  members: [
    { name: 'Muz', role: 'Presentation & Integration' },
    { name: 'SC171', role: 'Device Access' },
    { name: 'Platform', role: 'Visualization Workflow' }
  ],
  milestones: [
    { name: '项目方案整理', date: '2026-03-10', progress: 100 },
    { name: '平台功能整合', date: '2026-03-18', progress: 95 },
    { name: '比赛展示上线', date: '2026-03-27', progress: 92 }
  ],
  links: [
    { label: '查看项目详情', href: '/project/tiandi', primary: true },
    { label: '查看实验过程', href: '/lab' },
    { label: '联系我演示', href: '#contact' }
  ],
  downloads: [
    { label: '项目说明', title: '天地协同管理平台项目介绍', href: '/downloads/tiandi-project-intro.md' },
    { label: '展示 PPT', title: '天地协同比赛展示材料', href: '/downloads/tiandi-presentation.pptx' },
    { label: '实施文档', title: '项目实施说明文档', href: '/downloads/tiandi-implementation.docx' }
  ],
  techGroups: [
    { label: '后端', items: ['FastAPI', 'SQLAlchemy', 'SQLite'] },
    { label: '实时通信', items: ['WebSocket', '模拟器联调'] },
    { label: '可视化', items: ['Leaflet 地图', 'ECharts 图表'] },
    { label: '能力层', items: ['告警中心', 'AI 分析', '报告生成'] },
    { label: '部署', items: ['Docker', 'Docker Compose'] }
  ]
}
