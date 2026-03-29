<template>
  <section id="hero" class="hero-section">
    <div class="hero-bg">
      <div
        v-for="(img, i) in bgImgs"
        :key="img"
        class="hero-bg-slide"
        :class="{ active: i === bgIdx }"
        :style="{ backgroundImage: `url(${img})` }"
      ></div>
      <div class="hero-bg-mask"></div>
    </div>
    <div class="hg"></div>
    <div class="hs"></div>
    <div class="ht">{{ typeText }}<span class="cursor">_</span></div>
    <div class="hero-greeting">PERSONAL WORKSPACE // MUZ</div>
    <h1 class="hn">
      <span class="mu">Mu</span><span class="z">Z</span>
    </h1>
    <p class="hsu">前端开发 &middot; 网络工程 &middot; 实验型创作者</p>
    <div class="hero-desc">
      <span class="c1">// </span>
      我喜欢把网络、系统和前端交汇处的想法，做成真正可见、可操作、可记录的界面。
      <span class="c1"> //</span>
      <br />
      这里收录我的项目、实验、笔记和那些值得被长期保存的阶段性成果。
    </div>
    <div class="hb">
      <a class="btn bp" @click.prevent="scrollTo('#contest')">看项目</a>
      <a class="btn bo" @click.prevent="scrollTo('#garden')">进花园</a>
      <a class="btn bo" @click.prevent="scrollTo('#lab')">进实验室</a>
    </div>
    <div class="sind"><span>SCROLL</span><div class="sln"></div></div>
  </section>
</template>

<script setup lang="ts">
const bgImgs = ['/bg/bg1.jpg', '/bg/bg2.jpg', '/bg/bg3.jpg', '/bg/bg4.jpg', '/bg/bg5.jpg', '/bg/bg6.jpg', '/bg/bg7.jpg']
const bgIdx = ref(0)
const typeText = ref('')
const fullText = '// Booting Muz Workspace //'

let bgTimer: ReturnType<typeof setInterval>

function scrollTo(hash: string) {
  document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  let charIndex = 0
  const textTimer = window.setInterval(() => {
    typeText.value = fullText.slice(0, ++charIndex)
    if (charIndex >= fullText.length) {
      window.clearInterval(textTimer)
    }
  }, 55)

  bgTimer = setInterval(() => {
    bgIdx.value = (bgIdx.value + 1) % bgImgs.length
  }, 4500)
})

onUnmounted(() => {
  clearInterval(bgTimer)
})
</script>

<style lang="scss" scoped>
.hero-section {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 100px 20px 60px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-bg-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1.6s ease;
  transform: scale(1.04);

  &.active {
    opacity: 1;
    animation: bgzoom 5s ease forwards;
  }
}

@keyframes bgzoom {
  from {
    transform: scale(1.04);
  }

  to {
    transform: scale(1);
  }
}

.hero-bg-mask {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to bottom, rgba(6, 12, 20, 0.72) 0%, rgba(6, 12, 20, 0.55) 50%, rgba(6, 12, 20, 0.82) 100%),
    linear-gradient(135deg, rgba(0, 245, 255, 0.06) 0%, transparent 60%);
}

.hg {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image:
    linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px);
  background-size: 55px 55px;
  animation: gm 20s linear infinite;
}

@keyframes gm {
  to {
    background-position: 55px 55px;
  }
}

.hs {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 1;
  background: linear-gradient(90deg, transparent, #00f5ff, transparent);
  animation: sc 5s linear infinite;
  opacity: 0.3;
}

@keyframes sc {
  0% {
    top: 0;
  }

  100% {
    top: 100%;
  }
}

.ht {
  font-family: 'Orbitron', monospace;
  font-size: 0.65rem;
  letter-spacing: 8px;
  color: #00f5ff;
  margin-bottom: 12px;
  opacity: 0.7;
  text-transform: uppercase;
  animation: up 0.8s both;

  .cursor {
    display: inline-block;
    animation: blink 0.7s step-end infinite;
    color: #00f5ff;
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

.hero-greeting {
  font-size: 0.78rem;
  color: #7b2fff;
  letter-spacing: 4px;
  font-family: 'Orbitron', monospace;
  margin-bottom: 18px;
  animation: up 0.8s 0.1s both;
  opacity: 0.85;
}

.hn {
  font-family: 'Orbitron', monospace;
  font-size: clamp(3.5rem, 12vw, 9rem);
  font-weight: 900;
  line-height: 1;
  margin-bottom: 16px;
  animation: up 0.8s 0.2s both;

  .mu {
    -webkit-text-stroke: 2px #00f5ff;
    color: transparent;
    filter: drop-shadow(0 0 18px #00f5ff);
  }

  .z {
    color: #ff006e;
    text-shadow: 0 0 20px #ff006e;
    display: inline-block;
    animation: glitch 4s infinite;
  }
}

@keyframes glitch {
  0%,
  88%,
  100% {
    transform: none;
  }

  89% {
    transform: translate(-3px, 1px) skewX(-2deg);
    color: #00f5ff;
  }

  90% {
    transform: translate(3px, -1px) skewX(2deg);
    color: #7b2fff;
  }

  91% {
    transform: none;
    color: #ff006e;
  }
}

.hsu {
  font-size: 1rem;
  color: #8aaac8;
  letter-spacing: 5px;
  margin-bottom: 20px;
  animation: up 0.8s 0.4s both;
}

.hero-desc {
  max-width: 620px;
  color: #8aaac8;
  font-size: 0.9rem;
  line-height: 2;
  letter-spacing: 0.5px;
  margin-bottom: 32px;
  animation: up 0.8s 0.5s both;

  .c1 {
    color: #00f5ff;
  }
}

.hb {
  display: flex;
  gap: 14px;
  animation: up 0.8s 0.6s both;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 12px 30px;
  font-family: 'Orbitron', monospace;
  font-size: 0.7rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: 0.12s;
  clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
  cursor: pointer;
  border: none;
  font-weight: 700;

  &:hover {
    transform: translateY(-3px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
}

.bp {
  background: #00f5ff;
  color: #000;
  box-shadow: 0 0 20px #00f5ff55;
}

.bo {
  background: transparent;
  color: #00f5ff;
  border: 1px solid #00f5ff;

  &:hover {
    background: rgba(0, 245, 255, 0.07);
  }
}

.sind {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #8aaac8;
  font-size: 0.6rem;
  letter-spacing: 3px;
  animation: up 0.8s 1s both;
}

.sln {
  width: 1px;
  height: 40px;
  background: linear-gradient(#00f5ff, transparent);
  animation: sp 2s ease infinite;
}

@keyframes sp {
  0%,
  100% {
    opacity: 0.3;
  }

  50% {
    opacity: 1;
  }
}

@keyframes up {
  from {
    opacity: 0;
    transform: translateY(28px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding-top: 120px;
  }

  .ht {
    letter-spacing: 4px;
  }

  .hero-desc {
    font-size: 0.82rem;
    line-height: 1.85;
  }
}
</style>
