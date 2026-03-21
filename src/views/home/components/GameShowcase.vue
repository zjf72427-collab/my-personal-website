<template>
  <section id="game" class="w">
    <div class="sh rv"><span class="snum">07</span><h2 class="stit">INDIE GAME</h2><div class="sl2"></div></div>
    <div class="game-card rv">
      <div class="game-pixel-border"></div>
      <div class="game-inner">
        <div class="game-screen">
          <div class="pixel-art">💰</div>
          <div class="game-scanline"></div>
          <div class="game-title-block">
            <div class="game-name">财源滚滚</div>
            <div class="game-name-en">WEALTH RUSH</div>
          </div>
          <div class="game-ver">v0.1.0 · ALPHA</div>
        </div>
        <div class="game-info">
          <div class="game-badge">🕹️ 独立游戏 · 开发中</div>
          <p class="game-desc">一款轻量级休闲小游戏。玩家操控角色收集金币，躲避障碍，挑战高分。纯前端实现，Canvas 渲染，零依赖。</p>
          <div class="game-features">
            <div class="gf-item"><span class="gf-icon">🎮</span> Canvas 物理引擎</div>
            <div class="gf-item"><span class="gf-icon">🏆</span> 本地排行榜</div>
            <div class="gf-item"><span class="gf-icon">📱</span> 移动端适配</div>
            <div class="gf-item"><span class="gf-icon">⚡</span> 零依赖纯 JS</div>
          </div>
          <div class="game-status">
            <span class="status-bar"><span class="status-inner" style="width:25%"></span></span>
            <span class="status-label">开发进度 25%</span>
          </div>
          <button class="game-btn" disabled>🚧 敬请期待</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
onMounted(() => {
  const obs = new IntersectionObserver(
    es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('on') }),
    { threshold: .15 }
  )
  document.querySelectorAll('#game .rv').forEach(el => obs.observe(el))
})
</script>

<style lang="scss" scoped>
.game-card {
  position: relative;
  background: linear-gradient(135deg, #0a1a10, #0a1520);
  border: 2px solid #00ff88;
  padding: 3px;
  box-shadow: 0 0 30px rgba(0,255,136,.1), inset 0 0 30px rgba(0,255,136,.03);
  transition: box-shadow .3s, transform .3s;
  &:hover {
    box-shadow: 0 0 60px rgba(0,255,136,.2), inset 0 0 40px rgba(0,255,136,.05);
    transform: translateY(-3px);
  }
}
.game-pixel-border {
  position: absolute; inset: -2px;
  background: repeating-linear-gradient(90deg, #00ff88 0, #00ff88 4px, transparent 4px, transparent 12px);
  opacity: .15; pointer-events: none;
}
.game-inner {
  display: grid; grid-template-columns: 1fr 1.4fr; gap: 0;
  background: #060c14;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
}
.game-screen {
  background: #000d04;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 40px 24px; position: relative; overflow: hidden; gap: 12px;
  border-right: 1px solid rgba(0,255,136,.15);
  @media (max-width: 768px) { border-right: none; border-bottom: 1px solid rgba(0,255,136,.15); }
}
.pixel-art {
  font-size: 5rem; filter: drop-shadow(0 0 20px #00ff88);
  animation: float 3s ease-in-out infinite;
}
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
.game-scanline {
  position: absolute; inset: 0; pointer-events: none;
  background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,136,.03) 3px, rgba(0,255,136,.03) 4px);
}
.game-title-block { text-align: center; }
.game-name {
  font-family: 'Orbitron', monospace; font-size: 1.4rem; font-weight: 900;
  color: #00ff88; text-shadow: 0 0 20px #00ff88; letter-spacing: 4px;
}
.game-name-en {
  font-family: 'Orbitron', monospace; font-size: .6rem; color: rgba(0,255,136,.5);
  letter-spacing: 6px; margin-top: 4px;
}
.game-ver { font-size: .6rem; color: rgba(0,255,136,.4); letter-spacing: 3px; font-family: monospace; }
.game-info { padding: 36px 32px; display: flex; flex-direction: column; gap: 18px; }
.game-badge { font-size: .72rem; color: #00ff88; letter-spacing: 2px; }
.game-desc { color: #8aaac8; font-size: .86rem; line-height: 1.9; }
.game-features { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.gf-item { font-size: .78rem; color: #8aaac8; display: flex; align-items: center; gap: 6px; }
.gf-icon { font-size: 1rem; }
.game-status { display: flex; align-items: center; gap: 12px; }
.status-bar {
  flex: 1; height: 4px; background: rgba(0,255,136,.15); border-radius: 2px; overflow: hidden;
}
.status-inner { display: block; height: 100%; background: #00ff88; border-radius: 2px; }
.status-label { font-size: .7rem; color: #00ff88; font-family: monospace; white-space: nowrap; }
.game-btn {
  padding: 12px 24px; border: 1px solid rgba(0,255,136,.3);
  background: rgba(0,255,136,.05); color: rgba(0,255,136,.5);
  font-family: 'Orbitron', monospace; font-size: .72rem; letter-spacing: 2px;
  cursor: not-allowed; transition: .2s;
  clip-path: polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);
}
</style>
