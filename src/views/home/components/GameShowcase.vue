<template>
  <section id="game" class="w">
    <div class="sh rv">
      <span class="snum">07</span>
      <h2 class="stit">INDIE GAME</h2>
      <div class="sl2"></div>
    </div>
    <div class="game-card rv on">
      <div class="game-pixel-border"></div>
      <div class="game-inner">
        <div class="game-screen">
          <div class="pixel-art">¥</div>
          <div class="game-scanline"></div>
          <div class="game-grid"></div>
          <div class="game-title-block">
            <div class="game-name">财源滚滚</div>
            <div class="game-name-en">CAI YUAN GUN GUN</div>
          </div>
          <div class="game-ver">{{ showcase.version }}</div>
        </div>
        <div class="game-info">
          <div class="game-badge">{{ showcase.badge }}</div>
          <p class="game-desc">{{ showcase.description }}</p>
          <div class="game-features">
            <div v-for="feature in showcase.features" :key="feature.label" class="gf-item">
              <span class="gf-icon">{{ feature.icon }}</span>
              {{ feature.label }}
            </div>
          </div>
          <div class="game-status">
            <span class="status-bar"><span class="status-inner" :style="{ width: `${showcase.progress}%` }"></span></span>
            <span class="status-label">Dev Progress {{ showcase.progress }}%</span>
          </div>
          <div class="game-actions">
            <a v-for="action in showcase.actions" :key="action.label" class="game-btn" :href="action.href">{{ action.label }}</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface ShowcaseAction {
  label: string
  href: string
}

interface ShowcaseFeature {
  icon: string
  label: string
}

const showcase = reactive<{
  badge: string
  version: string
  description: string
  progress: number
  features: ShowcaseFeature[]
  actions: ShowcaseAction[]
}>({
  badge: '个人小游戏企划 | Canvas Prototype',
  version: 'v0.2.3 | Internal Playtest',
  description:
    '这是我的周末小项目，核心目标不是“做大”，而是把爽快反馈、金币节奏和短局回放做扎实。你可以把它当成我在玩法与前端性能之间找平衡的实验场。',
  progress: 42,
  features: [
    { icon: '▶', label: '60fps Canvas 循环与碰撞检测' },
    { icon: '↻', label: '局内事件驱动分数倍率系统' },
    { icon: '◆', label: '移动端触控优先的 HUD 设计' },
    { icon: 'JS', label: '零重依赖，便于快速迭代' }
  ],
  actions: [
    { label: '查看开发日志', href: '/garden' },
    { label: '联系我体验内测', href: '#contact' }
  ]
})

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('on')
        }
      })
    },
    { threshold: 0.15 }
  )

  document.querySelectorAll('#game .rv').forEach((element) => observer.observe(element))
})
</script>

<style lang="scss" scoped>
.game-card {
  position: relative;
  background: linear-gradient(135deg, #0a1a10, #0a1520);
  border: 2px solid #00ff88;
  padding: 3px;
  box-shadow: 0 0 30px rgba(0, 255, 136, 0.1), inset 0 0 30px rgba(0, 255, 136, 0.03);
  transition: box-shadow 0.3s, transform 0.3s, border-color 0.3s;
  overflow: hidden;

  &:hover {
    border-color: #67ffb8;
    box-shadow:
      0 0 60px rgba(0, 255, 136, 0.2),
      0 0 120px rgba(0, 255, 136, 0.07),
      inset 0 0 40px rgba(0, 255, 136, 0.05);
    transform: translateY(-4px);

    .game-pixel-border {
      opacity: 0.32;
      transform: translateX(6px);
    }

    .pixel-art {
      transform: translateY(-6px) scale(1.04);
      filter: drop-shadow(0 0 26px #00ff88);
    }

    .game-scanline {
      animation-duration: 2s;
    }

    .status-inner {
      filter: drop-shadow(0 0 10px rgba(0, 255, 136, 0.8));
    }
  }
}

.game-pixel-border {
  position: absolute;
  inset: -2px;
  background: repeating-linear-gradient(90deg, #00ff88 0, #00ff88 4px, transparent 4px, transparent 12px);
  opacity: 0.15;
  pointer-events: none;
  transition: opacity 0.3s, transform 0.3s;
}

.game-inner {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  background: #060c14;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.game-screen {
  background: #000d04;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  position: relative;
  overflow: hidden;
  gap: 12px;
  border-right: 1px solid rgba(0, 255, 136, 0.15);

  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid rgba(0, 255, 136, 0.15);
  }
}

.pixel-art {
  font-size: 5rem;
  filter: drop-shadow(0 0 20px #00ff88);
  animation: float 3s ease-in-out infinite;
  transition: transform 0.3s, filter 0.3s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-12px);
  }
}

.game-scanline {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 255, 136, 0.03) 3px, rgba(0, 255, 136, 0.03) 4px);
  animation: scanline 3.5s linear infinite;
}

.game-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 255, 136, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 136, 0.04) 1px, transparent 1px);
  background-size: 22px 22px;
  opacity: 0.5;
}

@keyframes scanline {
  from {
    transform: translateY(-10px);
  }

  to {
    transform: translateY(10px);
  }
}

.game-title-block {
  text-align: center;
}

.game-name {
  font-family: 'Orbitron', monospace;
  font-size: 1.4rem;
  font-weight: 900;
  color: #00ff88;
  text-shadow: 0 0 20px #00ff88;
  letter-spacing: 3px;
}

.game-name-en {
  font-family: 'Orbitron', monospace;
  font-size: 0.56rem;
  color: rgba(0, 255, 136, 0.5);
  letter-spacing: 4px;
  margin-top: 4px;
}

.game-ver {
  font-size: 0.6rem;
  color: rgba(0, 255, 136, 0.45);
  letter-spacing: 2px;
  font-family: monospace;
}

.game-info {
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.game-badge {
  font-size: 0.72rem;
  color: #00ff88;
  letter-spacing: 2px;
}

.game-desc {
  color: #8aaac8;
  font-size: 0.86rem;
  line-height: 1.9;
}

.game-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.gf-item {
  font-size: 0.78rem;
  color: #8aaac8;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: transform 0.2s, color 0.2s;

  .game-card:hover & {
    color: #c9ffe3;
    transform: translateX(3px);
  }
}

.gf-icon {
  font-size: 0.95rem;
  width: 16px;
  text-align: center;
}

.game-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-bar {
  flex: 1;
  height: 4px;
  background: rgba(0, 255, 136, 0.15);
  border-radius: 2px;
  overflow: hidden;
}

.status-inner {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #00ff88, #9cffc8);
  border-radius: 2px;
  transition: filter 0.3s;
}

.status-label {
  font-size: 0.7rem;
  color: #00ff88;
  font-family: monospace;
  white-space: nowrap;
}

.game-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.game-btn {
  text-decoration: none;
  padding: 10px 16px;
  border: 1px solid rgba(0, 255, 136, 0.3);
  background: rgba(0, 255, 136, 0.05);
  color: rgba(0, 255, 136, 0.86);
  font-family: 'Orbitron', monospace;
  font-size: 0.66rem;
  letter-spacing: 1.4px;
  transition: border-color 0.2s, background 0.2s, transform 0.2s;
  clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);

  &:hover {
    border-color: rgba(0, 255, 136, 0.7);
    background: rgba(0, 255, 136, 0.11);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid #00ff88;
    outline-offset: 2px;
  }
}

:global(:root[data-theme='light']) {
  .game-card {
    background: linear-gradient(135deg, #f6fff8, #eef7ff);
    border-color: rgba(45, 138, 78, 0.45);
  }

  .game-inner {
    background: #ffffff;
  }

  .game-screen {
    background: #f4fcf7;
    border-right-color: rgba(45, 138, 78, 0.2);
  }

  .game-name,
  .game-badge,
  .status-label {
    color: #2d8a4e;
    text-shadow: none;
  }

  .game-desc,
  .gf-item {
    color: #4a5568;
  }

  .game-btn {
    color: #2d8a4e;
    border-color: rgba(45, 138, 78, 0.35);
    background: rgba(45, 138, 78, 0.06);
  }
}
</style>
