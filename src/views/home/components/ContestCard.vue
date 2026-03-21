<template>
  <section id="contest" class="w">
    <div class="sh rv"><span class="snum">03</span><h2 class="stit">FEATURED PROJECT</h2><div class="sl2"></div></div>
    <div class="glass-card rv" @mouseenter="glowing = true" @mouseleave="glowing = false" :class="{ glowing }">
      <div class="gc-glow"></div>
      <div class="gc-corner tl"></div>
      <div class="gc-corner tr"></div>
      <div class="gc-corner bl"></div>
      <div class="gc-corner br"></div>
      <div class="gc-header">
        <div class="gc-badge">{{ project.badge }}</div>
        <div class="gc-status"><span class="status-dot"></span>{{ project.status }}</div>
      </div>
      <h3 class="gc-title">{{ project.title }}</h3>
      <p class="gc-subtitle">{{ project.subtitle }}</p>
      <p class="gc-desc">{{ project.desc }}</p>
      <div class="gc-progress">
        <div class="gc-prog-header">
          <span>项目进度</span>
          <span class="gc-pct">{{ pct }}%</span>
        </div>
        <div class="gc-bar"><div class="gc-fill" :style="{ width: pct + '%' }"></div></div>
      </div>
      <div class="gc-tags">
        <span v-for="t in project.tags" :key="t" class="gc-tag">{{ t }}</span>
      </div>
      <div class="gc-footer">
        <span class="gc-member" v-for="m in project.members" :key="m">{{ m }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { contestProject as project } from '../data/contestProject'

const glowing = ref(false)
const pct = ref(0)

onMounted(() => {
  const obs = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('on')
        setTimeout(() => {
          const t = setInterval(() => {
            if (pct.value >= project.progress) clearInterval(t)
            else pct.value++
          }, 18)
        }, 400)
        obs.unobserve(e.target)
      }
    })
  }, { threshold: .2 })
  document.querySelectorAll('#contest .rv').forEach(el => obs.observe(el))
})
</script>

<style lang="scss" scoped>
.glass-card {
  position: relative;
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 245, 255, 0.15);
  border-radius: 2px;
  padding: 40px;
  transition: border-color .3s, box-shadow .3s, transform .3s;
  overflow: hidden;
  &.glowing {
    border-color: rgba(0, 245, 255, 0.5);
    box-shadow: 0 0 40px rgba(0,245,255,.12), 0 0 80px rgba(123,47,255,.08), inset 0 0 40px rgba(0,245,255,.03);
    transform: translateY(-3px);
    .gc-glow { opacity: 1; }
    .gc-fill { box-shadow: 0 0 12px #00f5ff; }
  }
}
.gc-glow {
  position: absolute; inset: 0; opacity: 0; transition: opacity .3s;
  background: radial-gradient(ellipse at 50% 0%, rgba(0,245,255,.06) 0%, transparent 70%);
  pointer-events: none;
}
.gc-corner {
  position: absolute; width: 14px; height: 14px;
  &.tl { top: 0; left: 0; border-top: 2px solid #00f5ff; border-left: 2px solid #00f5ff; }
  &.tr { top: 0; right: 0; border-top: 2px solid #7b2fff; border-right: 2px solid #7b2fff; }
  &.bl { bottom: 0; left: 0; border-bottom: 2px solid #7b2fff; border-left: 2px solid #7b2fff; }
  &.br { bottom: 0; right: 0; border-bottom: 2px solid #00f5ff; border-right: 2px solid #00f5ff; }
}
.gc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.gc-badge { font-family: 'Orbitron', monospace; font-size: .65rem; color: #00f5ff; letter-spacing: 3px; }
.gc-status {
  display: flex; align-items: center; gap: 6px;
  font-size: .65rem; letter-spacing: 2px; color: #8aaac8;
}
.status-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #00f5ff;
  animation: pulse 2s infinite;
}
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.8)} }
.gc-title {
  font-size: 2rem; font-weight: 700; color: #eaf4ff;
  margin-bottom: 6px; letter-spacing: 1px;
}
.gc-subtitle { font-size: .72rem; color: #00f5ff; letter-spacing: 4px; margin-bottom: 18px; font-family: 'Orbitron', monospace; }
.gc-desc { color: #8aaac8; line-height: 1.9; font-size: .88rem; margin-bottom: 28px; }
.gc-progress { margin-bottom: 24px; }
.gc-prog-header { display: flex; justify-content: space-between; font-size: .72rem; color: #8aaac8; margin-bottom: 8px; letter-spacing: 1px; }
.gc-pct { color: #00f5ff; font-family: 'Orbitron', monospace; font-weight: 700; }
.gc-bar { height: 4px; background: rgba(0,245,255,.1); border-radius: 2px; overflow: hidden; }
.gc-fill { height: 100%; background: linear-gradient(90deg, #00f5ff, #7b2fff); border-radius: 2px; transition: width .05s linear; }
.gc-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.gc-tag {
  padding: 4px 12px; font-size: .68rem; letter-spacing: 1px;
  border: 1px solid rgba(0,245,255,.2); color: #8aaac8;
  clip-path: polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%);
  transition: .15s;
  &:hover { border-color: #00f5ff; color: #00f5ff; }
}
.gc-footer { display: flex; gap: 20px; flex-wrap: wrap; padding-top: 20px; border-top: 1px solid rgba(0,245,255,.06); }
.gc-member { font-size: .75rem; color: #8aaac8; letter-spacing: 1px; }
</style>
