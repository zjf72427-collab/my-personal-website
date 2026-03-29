<template>
  <div class="project-page">
    <section class="hero">
      <div class="hero-overlay">
        <div class="hero-content">
          <p class="hero-kicker">SC171 竞赛项目</p>
          <h1>天地协同管理平台</h1>
          <p class="hero-subtitle">Air-Ground Collaborative Management Platform</p>
          <p class="hero-summary">
            面向低空设备与地面感知设备的统一运维平台，涵盖设备接入、告警、地图实时回放、AI 诊断与巡检报告，可用于演示、教学与验证。
          </p>
          <div class="hero-actions">
            <a class="primary-btn" href="#downloads">立即下载</a>
            <RouterLink class="text-btn" to="/">返回首页</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="panel row">
      <article class="panel-card">
        <h2>项目简介</h2>
        <p>
          建设了设备注册、状态监测、地图可视化与告警推送四大模块，支持无人机、传感器、摄像头、充电桩等多类设备接入，后台用 FastAPI + SQLite，前端通过 Leaflet 与 ECharts 实时呈现态势。
        </p>
      </article>
      <article class="panel-card">
        <h2>核心能力</h2>
        <ul>
          <li>动态地图与设备定位</li>
          <li>告警中心：超速 / 低电量 / 离线 / 围栏</li>
          <li>AI 异常分析 + 巡检报告生成</li>
          <li>模拟器联调支持教学演示</li>
        </ul>
      </article>
    </section>

    <section class="panel tech">
      <div class="panel-head">
        <h2>技术栈分组</h2>
      </div>
      <div class="tech-grid">
        <div class="tech-card">
          <h3>后端</h3>
          <p>FastAPI / SQLAlchemy / SQLite</p>
        </div>
        <div class="tech-card">
          <h3>实时通信</h3>
          <p>WebSocket / MQTT 模拟器</p>
        </div>
        <div class="tech-card">
          <h3>数据分析</h3>
          <p>自定义指标计算 / CSV 导出</p>
        </div>
        <div class="tech-card">
          <h3>可视化</h3>
          <p>Leaflet 地图 / ECharts 趋势</p>
        </div>
        <div class="tech-card">
          <h3>部署</h3>
          <p>Docker Compose / 云端演示</p>
        </div>
      </div>
    </section>

    <section id="downloads" class="panel download">
      <div>
        <h2>下载与资源</h2>
        <p>立即获取演示版、PPT 与技术文档。</p>
      </div>
      <div class="download-links">
        <a href="#" class="download-card">
          <p class="label">展示 PPT</p>
          <strong>天地协同平台演示稿</strong>
        </a>
        <a href="#" class="download-card">
          <p class="label">技术文档</p>
          <strong>系统架构说明书</strong>
        </a>
        <a href="#" class="download-card">
          <p class="label">部署包</p>
          <strong>FastAPI / Frontend 镜像</strong>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
:global(:root) {
  --bg: #050c16;
  --panel: rgba(13, 21, 35, 0.95);
  --border: rgba(0, 175, 255, 0.35);
  --accent: #00d4ff;
  --text: #e8f2ff;
}

.project-page {
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  padding-bottom: 80px;
}

.hero {
  min-height: 60vh;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(123, 47, 255, 0.25)), url('/assets/bg-dark-BoZNsetB.webp') center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero-overlay {
  width: 100%;
  padding: 80px 24px;
  background: rgba(5, 12, 22, 0.72);
  display: flex;
  justify-content: center;
}

.hero-content {
  max-width: 900px;
  text-align: left;
}

.hero-kicker {
  font-family: 'Orbitron', monospace;
  letter-spacing: 3px;
  font-size: 0.7rem;
  color: var(--accent);
}

.hero h1 {
  font-size: clamp(2.5rem, 3vw, 3.6rem);
  margin-bottom: 6px;
}

.hero-subtitle {
  font-size: 1rem;
  margin-bottom: 18px;
  color: rgba(232, 242, 255, 0.8);
}

.hero-summary {
  font-size: 1rem;
  line-height: 1.7;
  max-width: 720px;
}

.hero-actions {
  margin-top: 24px;
  display: flex;
  gap: 14px;
}

.primary-btn, .text-btn {
  font-size: 0.85rem;
  letter-spacing: 1px;
  padding: 0.85rem 1.4rem;
  border-radius: 999px;
  border: 1px solid var(--accent);
  text-transform: uppercase;
  text-decoration: none;
}

.primary-btn {
  background: var(--accent);
  color: #050c16;
  font-weight: 700;
}

.text-btn {
  color: var(--text);
  border-color: rgba(255, 255, 255, 0.25);
}

.panel {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px;
}

.panel.row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.panel-card {
  background: var(--panel);
  border: 1px solid var(--border);
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}

.panel-card h2 {
  margin-bottom: 12px;
  font-size: 1.1rem;
}

.panel-card ul {
  padding-left: 18px;
  list-style: decimal;
  line-height: 1.7;
}

.panel.tech {
  background: #060f1f;
  border-radius: 22px;
  border: 1px solid rgba(0, 212, 255, 0.25);
}

.panel-head h2 {
  margin-bottom: 16px;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.tech-card {
  border-radius: 14px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(11, 16, 32, 0.8);
}

.tech-card h3 {
  margin-bottom: 6px;
  font-size: 0.95rem;
  color: var(--accent);
}

.tech-card p {
  color: rgba(232, 242, 255, 0.85);
  line-height: 1.6;
}

.download {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 20px;
  margin-top: 32px;
}

.download-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.download-card {
  padding: 18px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(6, 12, 26, 0.85);
  display: block;
  text-decoration: none;
  color: inherit;
}

.download-card strong {
  display: block;
  margin-top: 6px;
  font-size: 1rem;
  font-weight: 600;
}

.label {
  font-family: 'Orbitron', monospace;
  font-size: 0.65rem;
  letter-spacing: 2px;
  color: var(--accent);
}

.gc-grid {
  margin-top: 24px;
}

.gc-links {
  margin-bottom: 18px;
}

.gc-link.primary {
  border-width: 0;
  background: linear-gradient(135deg, #00d4ff, #7b2fff);
  color: #050c16;
}

.gc-footer {
  margin-top: 12px;
}

.gc-member {
  font-size: 0.75rem;
  color: rgba(232, 242, 255, 0.7);
}

@media (max-width: 900px) {
  .gc-top {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .hero-actions {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
