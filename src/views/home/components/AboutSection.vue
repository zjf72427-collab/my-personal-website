<template>
  <section id="about" class="w">
    <div class="sh rv">
      <span class="snum">01</span>
      <h2 class="stit">ABOUT</h2>
      <div class="sl2"></div>
    </div>
    <div class="ag">
      <div class="rv" style="display:flex;justify-content:center">
        <div class="ab">
          <div class="abr"></div>
          <div class="ai">木Z<small>{{ roleText }}<span class="role-cursor">_</span></small><div class="avsc"></div></div>
        </div>
      </div>
      <div class="rv">
        <div class="bdg"><div class="dot"></div><span>ONLINE &mdash; 正在创作中</span></div>
        <div class="at">
          <p>你好，我是 <span class="c1">木Z</span>。一个热爱探索数字世界边界的人。</p>
          <p>我喜欢在 <span class="c1">代码</span> 与 <span class="c2">创意</span> 的交汇处游荡，把脑海中的想法变成屏幕上 <span class="c3">真实存在</span> 的东西。</p>
          <p>这里是我的数字据点 &mdash; 记录思考、分享发现、留存折腾的痕迹。</p>
          <p style="font-family:monospace;font-size:.72rem;color:#8aaac8;letter-spacing:2px">// 欢迎进入我的世界</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const roles = ['前端开发者', '极客玩家', '内容创作者', '网络工程师', '独立折腾者']
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
      roleTimer = setTimeout(tickRole, 1800)
      return
    }
  } else {
    roleText.value = current.slice(0, --charIdx)
    if (charIdx <= 0) {
      deleting = false
      roleIdx = (roleIdx + 1) % roles.length
    }
  }
  roleTimer = setTimeout(tickRole, deleting ? 60 : 110)
}

let obs: IntersectionObserver
onMounted(() => {
  obs = new IntersectionObserver(
    es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('on') }),
    { threshold: .15 }
  )
  document.querySelectorAll('#about .rv').forEach(node => obs.observe(node))
  setTimeout(tickRole, 800)
})
onUnmounted(() => { obs?.disconnect(); clearTimeout(roleTimer) })
</script>

<style lang="scss" scoped>
.ag { display: grid; grid-template-columns: 1fr 1fr; gap: 52px; align-items: center; }
.ab { width: 255px; height: 255px; position: relative; margin: auto; }
.abr {
  position: absolute; inset: -2px;
  background: linear-gradient(135deg, #00f5ff, #7b2fff, #ff006e);
  clip-path: polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px);
  animation: hue 5s linear infinite;
}
@keyframes hue { to { filter: hue-rotate(360deg); } }
.ai {
  position: relative; z-index: 1; width: 100%; height: 100%;
  background: #0a1520;
  clip-path: polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
  font-family: 'Orbitron', monospace; font-size: 2.6rem; font-weight: 900;
  color: #00f5ff; text-shadow: 0 0 20px #00f5ff;
  small {
    font-size: .55rem; letter-spacing: 4px; color: #8aaac8; opacity: .6;
    .role-cursor { animation: rcblink .7s step-end infinite; }
  }
  @keyframes rcblink { 50% { opacity: 0; } }
}
.avsc {
  position: absolute; left: 0; right: 0; height: 1px; z-index: 2;
  background: linear-gradient(90deg, transparent, #00f5ff, transparent);
  animation: avs 3s ease-in-out infinite;
}
@keyframes avs { 0%,100% { top: 10%; opacity: 0; } 15%,85% { opacity: 1; } 50% { top: 88%; } }
.bdg {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 14px; border: 1px solid rgba(0,245,255,.2);
  background: rgba(0,245,255,.04); font-size: .68rem; letter-spacing: 2px; margin-bottom: 18px;
}
.dot {
  width: 7px; height: 7px; background: #00ff88; border-radius: 50%;
  box-shadow: 0 0 8px #00ff88; animation: bk 2s ease infinite;
}
@keyframes bk { 0%,100% { opacity: 1; } 50% { opacity: .2; } }
.at p { line-height: 1.95; color: #8aaac8; margin-bottom: 14px; font-size: .92rem; }
.c1 { color: #00f5ff; } .c2 { color: #ff006e; } .c3 { color: #7b2fff; }
@media (max-width: 768px) { .ag { grid-template-columns: 1fr; } }
</style>
