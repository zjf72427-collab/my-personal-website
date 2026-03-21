<template>
  <div>
    <div id="home-bg-img"></div>
    <div id="home-bg-overlay"></div>
    <div id="home-bg-scan"></div>
    <canvas ref="cvs" id="home-cvs"></canvas>
  </div>
</template>

<script setup lang="ts">
const cvs = ref<HTMLCanvasElement | null>(null)

let animId: number
let mouseX = -999
let mouseY = -999

function initMatrix() {
  const el = cvs.value
  if (!el) return
  const ctx = el.getContext('2d')!
  el.width = window.innerWidth
  el.height = window.innerHeight

  const COL_W = 20
  const cols = Math.floor(el.width / COL_W)
  const chars = '01アイウエオカキクケコ木Z'

  // Each column: y position + individual velocity for repulsion
  const drops = Array.from({ length: cols }, () => ({
    y: Math.random() * (el.height / COL_W),
    vy: 1,
    offsetX: 0,
  }))

  // Ripple particles on click
  const ripples: { x: number; y: number; r: number; alpha: number }[] = []

  function onMouseMove(e: MouseEvent) {
    mouseX = e.clientX
    mouseY = e.clientY
  }
  function onClick(e: MouseEvent) {
    ripples.push({ x: e.clientX, y: e.clientY, r: 0, alpha: 1 })
  }
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('click', onClick)

  function draw() {
    ctx.fillStyle = 'rgba(2,4,8,0.05)'
    ctx.fillRect(0, 0, el.width, el.height)

    drops.forEach((drop, i) => {
      const cx = i * COL_W
      const cy = drop.y * COL_W
      const dx = cx - mouseX
      const dy = cy - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const RADIUS = 120

      // Repulsion: push column offset away from mouse
      if (dist < RADIUS) {
        const force = (1 - dist / RADIUS) * 18
        drop.offsetX += (dx / dist) * force * 0.15
      }
      // Decay offset back to 0
      drop.offsetX *= 0.88

      const c = chars[Math.floor(Math.random() * chars.length)]
      // Near mouse: brighter, white flash
      if (dist < RADIUS) {
        const t = 1 - dist / RADIUS
        ctx.fillStyle = `rgba(${Math.floor(200 + 55 * t)},${Math.floor(245 * (1 - t * 0.5))},255,${0.5 + t * 0.5})`
      } else {
        ctx.fillStyle = Math.random() > .97 ? '#fff' : '#00f5ff'
      }
      ctx.globalAlpha = Math.random() * .7 + .2
      ctx.font = '14px monospace'
      ctx.fillText(c, cx + drop.offsetX, cy)

      if (cy > el.height && Math.random() > .95) drop.y = 0
      else drop.y += drop.vy
    })
    ctx.globalAlpha = 1

    // Draw ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i]
      rp.r += 6
      rp.alpha -= 0.03
      if (rp.alpha <= 0) { ripples.splice(i, 1); continue }
      ctx.beginPath()
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(0,245,255,${rp.alpha})`
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    animId = requestAnimationFrame(draw)
  }

  cancelAnimationFrame(animId)
  draw()

  // Cleanup listeners stored for unmount
  ;(el as any)._cleanup = () => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('click', onClick)
  }
}

onMounted(() => {
  initMatrix()
  window.addEventListener('resize', initMatrix)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  window.removeEventListener('resize', initMatrix)
  ;(cvs.value as any)?._cleanup?.()
})
</script>

<style lang="scss" scoped>
#home-bg-img {
  position: fixed; inset: 0; z-index: 0;
  background: url('/bg.jpg') center/cover no-repeat;
  filter: brightness(.35) saturate(1.4);
  animation: bgpulse 8s ease-in-out infinite;
}
@keyframes bgpulse {
  0%,100% { filter: brightness(.35) saturate(1.4) hue-rotate(0deg); }
  50% { filter: brightness(.45) saturate(1.8) hue-rotate(15deg); }
}
#home-bg-overlay {
  position: fixed; inset: 0; z-index: 1;
  background: linear-gradient(135deg, rgba(0,245,255,.04) 0%, transparent 50%, rgba(255,0,110,.04) 100%);
  pointer-events: none;
  animation: ovpulse 6s ease-in-out infinite alternate;
}
@keyframes ovpulse { from { opacity: .6; } to { opacity: 1; } }
#home-bg-scan {
  position: fixed; inset: 0; z-index: 1;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,.015) 2px, rgba(0,245,255,.015) 4px);
  pointer-events: none;
  animation: scanmove 20s linear infinite;
}
@keyframes scanmove { from { background-position: 0 0; } to { background-position: 0 100px; } }
#home-cvs {
  position: fixed; inset: 0; z-index: 1; opacity: .18; pointer-events: none;
}
#home-char-wrap {
  position: fixed; right: 0; bottom: 0; width: 320px;
  z-index: 3; pointer-events: none;
  transform-origin: bottom center;
  animation: charFloat 5s ease-in-out infinite;
  filter: drop-shadow(0 0 22px rgba(0,245,255,.5)) drop-shadow(0 0 50px rgba(0,245,255,.15));
  transition: transform .15s ease-out;
  img { width: 100%; height: auto; display: block; }
}
@keyframes charFloat {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@media (max-width: 768px) { #home-char-wrap { width: 180px; } }
</style>
