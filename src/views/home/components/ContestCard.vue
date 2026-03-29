<template>
  <section id="contest" class="w">
    <div class="sh rv">
      <span class="snum">03</span>
      <h2 class="stit">FEATURED PROJECT</h2>
      <div class="sl2"></div>
    </div>

    <div class="glass-card rv on" :class="{ glowing }" @mouseenter="glowing = true" @mouseleave="glowing = false">
      <div class="gc-glow"></div>
      <div class="gc-corner tl"></div>
      <div class="gc-corner tr"></div>
      <div class="gc-corner bl"></div>
      <div class="gc-corner br"></div>

      <div class="gc-top">
        <div class="gc-main">
          <div class="gc-header">
            <div class="gc-badge">{{ project.badge }}</div>
            <div class="gc-status">
              <span class="status-dot"></span>
              {{ project.status }}
            </div>
          </div>

          <h3 class="gc-title">{{ project.title }}</h3>
          <p class="gc-subtitle">{{ project.subtitle }}</p>

          <div class="gc-summary-card">
            <div class="gc-summary-kicker">PROJECT SUMMARY</div>
            <p class="gc-summary">{{ project.summary }}</p>
          </div>

          <p class="gc-desc">{{ project.desc }}</p>
          <p class="gc-role">{{ project.role }}</p>
        </div>

        <aside class="gc-side">
          <div class="gc-cover-card">
            <div class="cover-grid"></div>
            <div class="cover-radar"></div>
            <div class="cover-content">
              <span class="cover-kicker">SC171</span>
              <strong>{{ project.title }}</strong>
              <span class="cover-caption">Air + Ground / Monitor + Alert + Report</span>
            </div>
          </div>

          <div class="gc-progress-card">
            <div class="gc-prog-header">
              <span>Current Progress</span>
              <span class="gc-pct">{{ pct }}%</span>
            </div>
            <div class="gc-bar">
              <div class="gc-fill" :style="{ width: `${pct}%` }"></div>
            </div>
          </div>

          <div class="gc-metrics">
            <div v-for="metric in project.metrics" :key="metric.label" class="gc-metric">
              <div class="gc-metric-label">{{ metric.label }}</div>
              <div class="gc-metric-value">{{ metric.value }}</div>
            </div>
          </div>
        </aside>
      </div>

      <div class="gc-tech">
        <div class="gc-block-title">技术栈</div>
        <div class="gc-tags">
          <span v-for="tag in project.tags" :key="tag" class="gc-tag">{{ tag }}</span>
        </div>
      </div>

      <div class="gc-grid">
        <div class="gc-block">
          <div class="gc-block-title">核心亮点</div>
          <ul class="gc-list">
            <li v-for="item in project.highlights" :key="item">{{ item }}</li>
          </ul>
        </div>

        <div class="gc-block">
          <div class="gc-block-title">里程碑</div>
          <ul class="gc-mile-list">
            <li v-for="milestone in project.milestones" :key="milestone.name" class="gc-mile-item">
              <div class="gc-mile-head">
                <span>{{ milestone.name }}</span>
                <span class="gc-mile-date">{{ milestone.date }}</span>
              </div>
              <div class="gc-mile-bar">
                <span class="gc-mile-fill" :style="{ width: `${milestone.progress}%` }"></span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="gc-links">
        <a
          v-for="link in project.links"
          :key="link.label"
          class="gc-link"
          :class="{ primary: link.primary }"
          :href="link.href"
        >
          {{ link.label }}
        </a>
      </div>

      <div class="gc-footer">
        <span v-for="member in project.members" :key="member.name" class="gc-member">{{ member.name }} / {{ member.role }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { contestProject } from '../data/contestProject'

const project = reactive({ ...contestProject })
const glowing = ref(false)
const pct = ref(0)

let progressTimer = 0

function animateProgress(target: number) {
  window.clearInterval(progressTimer)
  const normalized = Math.max(0, Math.min(100, target))
  progressTimer = window.setInterval(() => {
    if (pct.value === normalized) {
      window.clearInterval(progressTimer)
      return
    }
    pct.value += pct.value < normalized ? 1 : -1
  }, 15)
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('on')
        animateProgress(project.progress)
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.2 }
  )

  document.querySelectorAll('#contest .rv').forEach((element) => observer.observe(element))
})

onUnmounted(() => {
  window.clearInterval(progressTimer)
})
</script>

<style lang="scss" scoped>
.glass-card {
  position: relative;
  background:
    linear-gradient(180deg, rgba(8, 18, 32, 0.96), rgba(8, 18, 32, 0.9)),
    radial-gradient(circle at top right, rgba(0, 245, 255, 0.08), transparent 32%);
  border: 1px solid rgba(0, 245, 255, 0.18);
  border-radius: 2px;
  padding: 34px;
  transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
  overflow: hidden;

  &.glowing {
    border-color: rgba(0, 245, 255, 0.5);
    box-shadow:
      0 0 36px rgba(0, 245, 255, 0.12),
      0 0 72px rgba(123, 47, 255, 0.08),
      inset 0 0 40px rgba(0, 245, 255, 0.03);
    transform: translateY(-3px);
  }
}

.gc-glow {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.3s;
  background: radial-gradient(ellipse at 50% 0%, rgba(0, 245, 255, 0.06) 0%, transparent 70%);
  pointer-events: none;

  .glass-card.glowing & {
    opacity: 1;
  }
}

.gc-corner {
  position: absolute;
  width: 14px;
  height: 14px;

  &.tl {
    top: 0;
    left: 0;
    border-top: 2px solid #00f5ff;
    border-left: 2px solid #00f5ff;
  }

  &.tr {
    top: 0;
    right: 0;
    border-top: 2px solid #7b2fff;
    border-right: 2px solid #7b2fff;
  }

  &.bl {
    bottom: 0;
    left: 0;
    border-bottom: 2px solid #7b2fff;
    border-left: 2px solid #7b2fff;
  }

  &.br {
    bottom: 0;
    right: 0;
    border-bottom: 2px solid #00f5ff;
    border-right: 2px solid #00f5ff;
  }
}

.gc-top {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(260px, 0.75fr);
  gap: 24px;
  margin-bottom: 24px;
}

.gc-header,
.gc-prog-header,
.gc-mile-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.gc-header {
  margin-bottom: 18px;
}

.gc-badge,
.gc-subtitle,
.gc-block-title,
.gc-summary-kicker,
.gc-metric-label,
.cover-kicker {
  font-family: 'Orbitron', monospace;
}

.gc-badge {
  font-size: 0.65rem;
  color: #00f5ff;
  letter-spacing: 3px;
}

.gc-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.65rem;
  letter-spacing: 2px;
  color: #b8d7f4;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #00f5ff;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.4;
    transform: scale(0.8);
  }
}

.gc-title {
  font-size: 2rem;
  font-weight: 700;
  color: #f5fbff;
  margin-bottom: 6px;
  letter-spacing: 1px;
}

.gc-subtitle {
  font-size: 0.72rem;
  color: #00f5ff;
  letter-spacing: 3px;
  margin-bottom: 18px;
}

.gc-summary-card,
.gc-cover-card,
.gc-progress-card,
.gc-metric,
.gc-block {
  border: 1px solid rgba(0, 245, 255, 0.12);
  background: rgba(12, 24, 40, 0.72);
}

.gc-summary-card {
  padding: 14px 16px;
  margin-bottom: 14px;
}

.gc-summary-kicker {
  font-size: 0.58rem;
  color: #00f5ff;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.gc-summary {
  color: #e8f5ff;
  line-height: 1.8;
  font-size: 0.95rem;
}

.gc-desc {
  color: #b8d7f4;
  line-height: 1.9;
  font-size: 0.88rem;
}

.gc-role {
  margin-top: 12px;
  font-size: 0.78rem;
  color: #dcecff;
  line-height: 1.8;
  padding-left: 12px;
  border-left: 2px solid rgba(0, 245, 255, 0.3);
}

.gc-side {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gc-cover-card {
  position: relative;
  min-height: 180px;
  overflow: hidden;
  padding: 18px;
  background:
    radial-gradient(circle at center, rgba(0, 245, 255, 0.18), transparent 40%),
    linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(123, 47, 255, 0.16)),
    #081321;
}

.cover-grid,
.cover-radar {
  position: absolute;
  inset: 0;
}

.cover-grid {
  background-image:
    linear-gradient(rgba(0, 245, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 245, 255, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.45;
}

.cover-radar {
  background: conic-gradient(from 210deg, transparent, rgba(0, 245, 255, 0.4), transparent 55%);
  animation: radar-spin 8s linear infinite;
  transform-origin: center;
}

@keyframes radar-spin {
  to {
    transform: rotate(360deg);
  }
}

.cover-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 144px;
  gap: 8px;

  strong {
    color: #f5fbff;
    font-size: 1.2rem;
    line-height: 1.3;
  }
}

.cover-kicker {
  color: #00f5ff;
  letter-spacing: 2px;
  font-size: 0.58rem;
}

.cover-caption {
  color: rgba(232, 245, 255, 0.76);
  font-size: 0.72rem;
  line-height: 1.6;
}

.gc-progress-card {
  padding: 14px 16px;
}

.gc-prog-header {
  font-size: 0.72rem;
  color: #b8d7f4;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.gc-pct {
  color: #00f5ff;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
}

.gc-bar,
.gc-mile-bar {
  height: 4px;
  background: rgba(0, 245, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.gc-fill,
.gc-mile-fill {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #00f5ff, #00ff88);
}

.gc-metrics {
  display: grid;
  gap: 10px;
}

.gc-metric {
  padding: 12px 14px;
}

.gc-metric-label {
  font-size: 0.58rem;
  letter-spacing: 1.6px;
  color: #00f5ff;
  margin-bottom: 8px;
}

.gc-metric-value {
  color: #e8f5ff;
  font-size: 0.78rem;
  line-height: 1.7;
}

.gc-tech {
  margin-bottom: 20px;
}

.gc-block-title {
  font-size: 0.62rem;
  letter-spacing: 2px;
  color: #00f5ff;
  margin-bottom: 10px;
}

.gc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.gc-tag {
  padding: 5px 12px;
  font-size: 0.68rem;
  letter-spacing: 1px;
  border: 1px solid rgba(0, 245, 255, 0.24);
  color: #d4e9ff;
  background: rgba(0, 245, 255, 0.05);
  clip-path: polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
}

.gc-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.gc-block {
  padding: 14px;
}

.gc-list {
  margin: 0;
  padding-left: 18px;
  color: #d4e9ff;
  font-size: 0.78rem;
  line-height: 1.75;
}

.gc-mile-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gc-mile-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.gc-mile-head {
  color: #e8f5ff;
  font-size: 0.74rem;
}

.gc-mile-date {
  color: rgba(184, 215, 244, 0.7);
}

.gc-links {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.gc-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  font-size: 0.68rem;
  letter-spacing: 1.2px;
  color: #00f5ff;
  border: 1px solid rgba(0, 245, 255, 0.26);
  padding: 9px 14px;
  transition: border-color 0.2s, background 0.2s, transform 0.2s, color 0.2s;

  &.primary {
    background: rgba(0, 245, 255, 0.12);
    color: #f5fbff;
    border-color: rgba(0, 245, 255, 0.55);
  }

  &:hover {
    transform: translateY(-1px);
    background: rgba(0, 245, 255, 0.08);
    border-color: rgba(0, 245, 255, 0.65);
  }
}

.gc-footer {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 14px;
  border-top: 1px solid rgba(0, 245, 255, 0.08);
}

.gc-member {
  font-size: 0.7rem;
  color: rgba(184, 215, 244, 0.78);
  letter-spacing: 0.6px;
}

@media (max-width: 920px) {
  .gc-top,
  .gc-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .glass-card {
    padding: 24px 18px;
  }

  .gc-title {
    font-size: 1.5rem;
  }

  .gc-header {
    align-items: flex-start;
    flex-direction: column;
  }
}

:global(:root[data-theme='light']) {
  .glass-card,
  .gc-summary-card,
  .gc-cover-card,
  .gc-progress-card,
  .gc-metric,
  .gc-block {
    background: rgba(255, 255, 255, 0.92);
    border-color: rgba(0, 120, 200, 0.14);
  }

  .gc-badge,
  .gc-subtitle,
  .gc-block-title,
  .gc-summary-kicker,
  .gc-metric-label,
  .gc-pct,
  .cover-kicker {
    color: #0077cc;
  }

  .gc-title,
  .gc-summary,
  .gc-metric-value,
  .gc-mile-head,
  .cover-content strong {
    color: #1a2332;
  }

  .gc-status,
  .gc-desc,
  .gc-role,
  .gc-list,
  .gc-member,
  .gc-prog-header,
  .gc-mile-date,
  .cover-caption {
    color: #4a5568;
  }

  .gc-tag {
    border-color: rgba(0, 120, 200, 0.2);
    color: #4a5568;
    background: rgba(0, 120, 200, 0.05);
  }

  .gc-link {
    color: #0077cc;
    border-color: rgba(0, 120, 200, 0.3);
  }

  .gc-link.primary {
    color: #ffffff;
    background: #0077cc;
    border-color: #0077cc;
  }
}
</style>
