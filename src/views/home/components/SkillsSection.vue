<template>
  <section id="skills" class="w">
    <div class="sh rv"><span class="snum">02</span><h2 class="stit">SKILLS</h2><div class="sl2"></div></div>
    <div class="sg">
      <button
        v-for="s in skills"
        :key="s.name"
        type="button"
        class="sc rv"
        :class="{ 'sc-active': s.active }"
        :aria-expanded="s.active"
        @click="s.active = !s.active"
      >
        <div class="sc-main">
          <span class="sic">{{ s.icon }}</span>
          <div class="sc-info">
            <div class="scn">{{ s.name }}</div>
            <div class="scd">{{ s.desc }}</div>
          </div>
          <span class="sc-toggle">{{ s.active ? '−' : '+' }}</span>
        </div>
        <div class="sbar">
          <div class="sbf" :style="{ width: `${s.pct}%` }"></div>
          <span class="spct">{{ s.pct }}%</span>
        </div>
        <transition name="expand">
          <div v-if="s.active" class="sc-detail">
            <div class="sc-detail-inner">
              <div v-for="tag in s.tags" :key="tag" class="sc-tag">{{ tag }}</div>
            </div>
            <div class="sc-level">
              <span class="sc-level-bar">
                <span
                  v-for="n in 5"
                  :key="n"
                  class="sc-dot"
                  :class="{ filled: n <= Math.round(s.pct / 20) }"
                ></span>
              </span>
              <span class="sc-level-label">{{ levelLabel(s.pct) }}</span>
            </div>
          </div>
        </transition>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
const skills = reactive([
  {
    icon: '⌘',
    name: 'Interface Engineering',
    desc: '把复杂结构做成清晰、稳定、可交付的前端界面。',
    pct: 88,
    active: false,
    tags: ['Vue 3', 'TypeScript', 'Vite', 'SCSS', '组件化设计']
  },
  {
    icon: '◎',
    name: 'Network & Systems',
    desc: '熟悉网络拓扑、协议观察和系统层面的实验环境搭建。',
    pct: 84,
    active: false,
    tags: ['TCP/IP', 'Wireshark', 'VLAN', 'OSPF', 'Linux']
  },
  {
    icon: '▣',
    name: 'Visual Communication',
    desc: '把界面风格、信息层级和交互反馈压成统一视觉语言。',
    pct: 80,
    active: false,
    tags: ['信息层级', '交互动效', '品牌表达', '布局系统']
  },
  {
    icon: '✎',
    name: 'Knowledge Structuring',
    desc: '把零散笔记、论文摘录和实验记录整理成长期可复用的知识资产。',
    pct: 86,
    active: false,
    tags: ['Markdown', '知识归档', '技术写作', '内容整理']
  },
  {
    icon: '⌬',
    name: 'Experiment Delivery',
    desc: '从想法、原型到可演示成果，习惯快速试错并持续复盘。',
    pct: 91,
    active: false,
    tags: ['原型验证', '项目推进', '持续迭代', '问题拆解']
  }
])

function levelLabel(pct: number): string {
  if (pct >= 90) return 'EXPERT'
  if (pct >= 80) return 'ADVANCED'
  if (pct >= 70) return 'PROFICIENT'
  return 'LEARNING'
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('on')
          entry.target.querySelectorAll('.sbf').forEach((bar: Element) => {
            bar.classList.remove('anim-reset')
            void (bar as HTMLElement).offsetWidth
            bar.classList.add('anim-reset')
          })
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15 }
  )

  document.querySelectorAll('#skills .sc').forEach((element) => observer.observe(element))
})
</script>

<style lang="scss" scoped>
.sg {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(285px, 1fr));
  gap: 20px;
}

.sc {
  background: #0a1520;
  border: 1px solid rgba(0, 245, 255, 0.08);
  padding: 22px 24px;
  position: relative;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s, background 0.2s;
  cursor: pointer;
  text-align: left;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 16px 16px 0;
    border-color: transparent var(--page-bg, #060c14) transparent transparent;
    z-index: 1;
    transition: border-color 0.2s;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #00f5ff, transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover {
    border-color: rgba(0, 245, 255, 0.3);
    transform: translateY(-3px);
    box-shadow: 0 4px 16px rgba(0, 245, 255, 0.1);

    &::before {
      opacity: 1;
    }
  }

  &:focus-visible {
    outline: 2px solid #00f5ff;
    outline-offset: 2px;
  }

  &.sc-active {
    border-color: #00f5ff;
    background: #0d1e30;
    box-shadow: 0 0 24px rgba(0, 245, 255, 0.18), inset 0 0 20px rgba(0, 245, 255, 0.04);
    transform: translateY(-3px);

    &::before {
      opacity: 1;
    }

    .sc-toggle {
      color: #ff006e;
      border-color: rgba(255, 0, 110, 0.4);
    }

    .scn {
      color: #00f5ff;
      text-shadow: 0 0 12px rgba(0, 245, 255, 0.4);
    }
  }
}

.sc-main {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
}

.sic {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 1px;
}

.sc-info {
  flex: 1;
  min-width: 0;
}

.scn {
  font-family: 'Orbitron', monospace;
  font-size: 0.75rem;
  color: #8aaac8;
  margin-bottom: 4px;
  letter-spacing: 2px;
  transition: color 0.2s, text-shadow 0.2s;
}

.scd {
  font-size: 0.76rem;
  color: #8aaac8;
  line-height: 1.6;
}

.sc-toggle {
  font-size: 1.1rem;
  color: rgba(0, 245, 255, 0.5);
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border: 1px solid rgba(0, 245, 255, 0.2);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: color 0.2s, border-color 0.2s;
  font-family: monospace;
  font-weight: 700;
}

.sbar {
  height: 3px;
  background: rgba(0, 245, 255, 0.1);
  position: relative;
  overflow: visible;
  margin-bottom: 2px;
}

.sbf {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #00f5ff, #7b2fff);
  animation: ld 1.4s ease both;
  border-radius: 2px;
}

.spct {
  position: absolute;
  right: 0;
  top: -18px;
  font-family: 'Orbitron', monospace;
  font-size: 0.55rem;
  color: rgba(0, 245, 255, 0.5);
  letter-spacing: 1px;
}

@keyframes ld {
  from {
    width: 0 !important;
  }
}

.sbf.anim-reset {
  animation: none;
}

.sbf {
  animation: ld 1.4s ease both;
}

.expand-enter-active {
  transition: max-height 0.3s ease, opacity 0.25s;
}

.expand-leave-active {
  transition: max-height 0.2s ease, opacity 0.15s;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 200px;
  opacity: 1;
}

.sc-detail {
  overflow: hidden;
}

.sc-detail-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 14px;
  margin-top: 12px;
  border-top: 1px dashed rgba(0, 245, 255, 0.12);
}

.sc-tag {
  font-size: 0.62rem;
  padding: 2px 10px;
  letter-spacing: 1px;
  border: 1px solid rgba(0, 245, 255, 0.2);
  color: #00f5ff;
  font-family: monospace;
  clip-path: polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%);
}

.sc-level {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 10px;
}

.sc-level-bar {
  display: flex;
  gap: 4px;
}

.sc-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(0, 245, 255, 0.15);
  border: 1px solid rgba(0, 245, 255, 0.2);
  transition: background 0.2s;

  &.filled {
    background: #00f5ff;
    box-shadow: 0 0 6px #00f5ff;
  }
}

.sc-level-label {
  font-family: 'Orbitron', monospace;
  font-size: 0.6rem;
  color: #00f5ff;
  letter-spacing: 2px;
}
</style>
