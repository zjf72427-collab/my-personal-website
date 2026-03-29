<template>
  <section id="about" class="w">
    <div class="sh rv">
      <span class="snum">01</span>
      <h2 class="stit">ABOUT</h2>
      <div class="sl2"></div>
    </div>

    <div class="rv about-right">
      <div class="name-block">
        <div class="name-zh">Mu<span>Z</span></div>
        <div class="name-role">{{ roleText }}<span class="role-cursor">_</span></div>
      </div>
      <div class="bdg"><div class="dot"></div><span>ONLINE &mdash; 正在构建、记录与迭代</span></div>
      <div class="at">
        <p>你好，我是 <span class="c1">Muz</span>。我把这个站点当作自己的数字工作台，而不是单纯的展示页。</p>
        <p>我长期关注 <span class="c1">前端界面</span>、<span class="c2">网络工程</span> 和 <span class="c3">实验型项目</span> 的交叉地带，喜欢把抽象问题变成可读、可用、可复盘的内容和工具。</p>
        <p>这里会持续记录我的项目推进、实验过程、知识整理，以及那些值得被长期保存的阶段性判断。</p>
        <p class="at-mono">// Build clearly. Document honestly. Iterate continuously.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const roles = ['Front-End Developer', 'Network Engineer', 'Experiment Builder', 'Knowledge Gardener']
const roleText = ref('')

let roleIdx = 0
let charIdx = 0
let deleting = false
let roleTimer: ReturnType<typeof setTimeout>

function tickRole() {
  const current = roles[roleIdx]

  if (!deleting) {
    roleText.value = current.slice(0, ++charIdx)
    if (charIdx >= current.length) {
      deleting = true
      roleTimer = setTimeout(tickRole, 1600)
      return
    }
  } else {
    roleText.value = current.slice(0, --charIdx)
    if (charIdx <= 0) {
      deleting = false
      roleIdx = (roleIdx + 1) % roles.length
    }
  }

  roleTimer = setTimeout(tickRole, deleting ? 50 : 90)
}

let observer: IntersectionObserver

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('on')
        }
      })
    },
    { threshold: 0.1 }
  )

  document.querySelectorAll('#about .rv').forEach((element) => observer.observe(element))
  window.setTimeout(tickRole, 800)
})

onUnmounted(() => {
  observer?.disconnect()
  clearTimeout(roleTimer)
})
</script>

<style lang="scss" scoped>
.about-right {
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.name-block {
  margin-bottom: 24px;
}

.name-zh {
  font-family: 'Orbitron', monospace;
  font-size: 3rem;
  font-weight: 900;
  color: #eaf4ff;
  line-height: 1;
  margin-bottom: 8px;

  span {
    color: #00f5ff;
    text-shadow: 0 0 20px rgba(0, 245, 255, 0.6);
  }
}

.name-role {
  font-family: monospace;
  font-size: 0.8rem;
  letter-spacing: 4px;
  color: #8aaac8;
  opacity: 0.7;

  .role-cursor {
    animation: rcblink 0.7s step-end infinite;
  }
}

@keyframes rcblink {
  50% {
    opacity: 0;
  }
}

.bdg {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border: 1px solid rgba(0, 245, 255, 0.2);
  background: rgba(0, 245, 255, 0.04);
  font-size: 0.68rem;
  letter-spacing: 2px;
  margin-bottom: 20px;
  width: fit-content;
}

.dot {
  width: 7px;
  height: 7px;
  background: #00ff88;
  border-radius: 50%;
  box-shadow: 0 0 8px #00ff88;
  animation: bk 2s ease infinite;
}

@keyframes bk {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.2;
  }
}

.at p {
  line-height: 2;
  color: #8aaac8;
  margin-bottom: 12px;
  font-size: 0.92rem;
}

.at-mono {
  font-family: monospace;
  font-size: 0.72rem !important;
  color: #8aaac8;
  letter-spacing: 2px;
  opacity: 0.6;
}

.c1 {
  color: #00f5ff;
}

.c2 {
  color: #ff006e;
}

.c3 {
  color: #7b2fff;
}

:global(:root[data-theme='light']) {
  .name-zh {
    color: #1a2332;

    span {
      color: #0077cc;
      text-shadow: none;
    }
  }

  .name-role {
    color: #4a5568;
  }

  .bdg {
    border-color: rgba(0, 119, 204, 0.2);
    background: rgba(0, 119, 204, 0.04);
  }

  .at p {
    color: #4a5568;
  }
}
</style>
