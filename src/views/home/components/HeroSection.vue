<template>
  <section id="hero" class="hero-section">
    <div class="hg"></div>
    <div class="hs"></div>
    <div class="ht">{{ typeText }}<span class="cursor">_</span></div>
    <div class="hero-greeting">你好，我是</div>
    <h1 class="hn">
      <span class="mu">木</span><span class="z">Z</span>
    </h1>
    <p class="hsu">探索 &middot; 创造 &middot; <b>突破边界</b></p>
    <div class="hero-desc">
      <span class="c1">// </span>一个热衷于用代码构建想象力的人<span class="c1"> //</span><br />
      在这里记录技术思考、创作实验与那些值得被留下的瞬间
    </div>
    <div class="hb">
      <a class="btn bp" @click.prevent="scrollTo('#posts')">阅读博客</a>
      <a class="btn bo" @click.prevent="scrollTo('#about')">了解我</a>
    </div>
    <div class="sind"><span>SCROLL</span><div class="sln"></div></div>
  </section>
</template>

<script setup lang="ts">
const typeText = ref('')
const fullText = '// SYSTEM ONLINE — WELCOME TO MY WORLD //'

function scrollTo(hash: string) {
  document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  let i = 0
  const tick = setInterval(() => {
    typeText.value = fullText.slice(0, ++i)
    if (i >= fullText.length) clearInterval(tick)
  }, 55)
})
</script>

<style lang="scss" scoped>
.hero-section {
  position: relative; z-index: 2;
  min-height: 100vh;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; padding: 100px 20px 60px; overflow: hidden;
}
.hg {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(0,245,255,.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,245,255,.03) 1px, transparent 1px);
  background-size: 55px 55px;
  animation: gm 20s linear infinite;
}
@keyframes gm { to { background-position: 55px 55px; } }
.hs {
  position: absolute; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, #00f5ff, transparent);
  animation: sc 5s linear infinite; opacity: .3;
}
@keyframes sc { 0% { top: 0; } 100% { top: 100%; } }
.ht {
  font-family: 'Orbitron', monospace; font-size: .65rem;
  letter-spacing: 8px; color: #00f5ff; margin-bottom: 12px;
  opacity: .7; text-transform: uppercase;
  animation: up .8s both;
  .cursor {
    display: inline-block;
    animation: blink .7s step-end infinite;
    color: #00f5ff;
  }
}
@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
.hero-greeting {
  font-size: .78rem; color: #7b2fff; letter-spacing: 4px;
  font-family: 'Orbitron', monospace; margin-bottom: 18px;
  animation: up .8s .1s both; opacity: .85;
}
.hn {
  font-family: 'Orbitron', monospace;
  font-size: clamp(3.5rem, 12vw, 9rem);
  font-weight: 900; line-height: 1; margin-bottom: 16px;
  animation: up .8s .2s both;
  .mu { -webkit-text-stroke: 2px #00f5ff; color: transparent; filter: drop-shadow(0 0 18px #00f5ff); }
  .z { color: #ff006e; text-shadow: 0 0 20px #ff006e; display: inline-block; animation: glitch 4s infinite; }
}
@keyframes glitch {
  0%,88%,100% { transform: none; }
  89% { transform: translate(-3px,1px) skewX(-2deg); color: #00f5ff; }
  90% { transform: translate(3px,-1px) skewX(2deg); color: #7b2fff; }
  91% { transform: none; color: #ff006e; }
}
.hsu {
  font-size: 1rem; color: #8aaac8; letter-spacing: 5px;
  margin-bottom: 20px; animation: up .8s .4s both;
  b { color: #7b2fff; }
}
.hero-desc {
  max-width: 560px; color: #8aaac8; font-size: .85rem;
  line-height: 2; letter-spacing: .5px; margin-bottom: 32px;
  animation: up .8s .5s both;
  .c1 { color: #00f5ff; }
}
.hb { display: flex; gap: 14px; animation: up .8s .6s both; }
.btn {
  padding: 12px 30px; font-family: 'Orbitron', monospace;
  font-size: .7rem; letter-spacing: 3px; text-transform: uppercase;
  text-decoration: none; position: relative; overflow: hidden;
  transition: .12s; clip-path: polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%);
  cursor: pointer; border: none; font-weight: 700;
  &:hover { transform: translateY(-3px); }
  &::before {
    content: ''; position: absolute; top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);
    transition: .5s;
  }
  &:hover::before { left: 100%; }
}
.bp { background: #00f5ff; color: #000; box-shadow: 0 0 20px #00f5ff55; }
.bo { background: transparent; color: #00f5ff; border: 1px solid #00f5ff; &:hover { background: rgba(0,245,255,.07); } }
.sind {
  position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  color: #8aaac8; font-size: .6rem; letter-spacing: 3px;
  animation: up .8s 1s both;
}
.sln {
  width: 1px; height: 40px;
  background: linear-gradient(#00f5ff, transparent);
  animation: sp 2s ease infinite;
}
@keyframes sp { 0%,100% { opacity: .3; } 50% { opacity: 1; } }
@keyframes up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
</style>
