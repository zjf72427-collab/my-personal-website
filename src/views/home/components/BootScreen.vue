<template>
  <Transition name="boot-fade">
    <div v-if="visible" class="boot-screen">
      <div class="boot-inner">
        <div class="boot-logo">木<span>Z</span></div>
        <div class="boot-log">
          <div
            v-for="(line, i) in visibleLines"
            :key="i"
            class="boot-log-line"
            :class="line.type"
          >
            <span class="tag">{{ line.tag }}</span>
            <span class="msg">{{ line.msg }}</span>
          </div>
        </div>
        <div class="boot-bar-wrap">
          <div class="boot-bar">
            <div class="boot-bar-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <span class="boot-pct">{{ Math.floor(progress) }}%</span>
        </div>
        <div class="boot-status">{{ statusText }}</div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const visible = ref(true)
const progress = ref(0)
const visibleLines = ref<{ tag: string; msg: string; type: string }[]>([])

const lines = [
  { tag: '[ OK ]', msg: 'Initializing kernel modules...', type: 'ok' },
  { tag: '[ OK ]', msg: 'Mounting virtual filesystem...', type: 'ok' },
  { tag: '[ ** ]', msg: 'Loading neural interface drivers...', type: 'info' },
  { tag: '[ OK ]', msg: 'Establishing encrypted tunnel...', type: 'ok' },
  { tag: '[ ** ]', msg: 'Calibrating holographic renderer...', type: 'info' },
  { tag: '[ OK ]', msg: 'Syncing digital garden database...', type: 'ok' },
  { tag: '[ OK ]', msg: 'Starting geek-space daemon...', type: 'ok' },
  { tag: '[ ** ]', msg: 'Compiling personality matrix...', type: 'info' },
  { tag: '[ OK ]', msg: 'All systems nominal. Welcome, traveler.', type: 'ok' },
]

const statusTexts = [
  'BOOTING...', 'LOADING...', 'CALIBRATING...', 'ONLINE'
]
const statusText = ref('BOOTING...')

onMounted(() => {
  // Check if already booted this session
  if (sessionStorage.getItem('muz-booted')) {
    visible.value = false
    return
  }

  let lineIdx = 0
  const totalDuration = 2800
  const lineInterval = totalDuration / lines.length

  // Progress bar
  const startTime = Date.now()
  const progressTick = setInterval(() => {
    const elapsed = Date.now() - startTime
    progress.value = Math.min((elapsed / totalDuration) * 100, 100)
    if (elapsed < 900) statusText.value = statusTexts[0]
    else if (elapsed < 1800) statusText.value = statusTexts[1]
    else if (elapsed < 2500) statusText.value = statusTexts[2]
    else statusText.value = statusTexts[3]
    if (progress.value >= 100) clearInterval(progressTick)
  }, 16)

  // Boot log lines
  const lineTick = setInterval(() => {
    if (lineIdx < lines.length) {
      visibleLines.value.push(lines[lineIdx++])
    } else {
      clearInterval(lineTick)
    }
  }, lineInterval)

  // Dismiss
  setTimeout(() => {
    sessionStorage.setItem('muz-booted', '1')
    visible.value = false
  }, totalDuration + 400)
})
</script>

<style lang="scss" scoped>
.boot-screen {
  position: fixed; inset: 0; z-index: 9999;
  background: #020408;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Courier New', monospace;
}
.boot-inner {
  width: min(540px, 90vw);
  display: flex; flex-direction: column; gap: 20px;
}
.boot-logo {
  font-family: 'Orbitron', monospace;
  font-size: 2.8rem; font-weight: 900;
  color: #00f5ff; letter-spacing: 8px;
  text-shadow: 0 0 30px #00f5ff, 0 0 60px rgba(0,245,255,.3);
  text-align: center;
  span { color: #ff006e; text-shadow: 0 0 20px #ff006e; }
  animation: logopulse 1.5s ease-in-out infinite alternate;
}
@keyframes logopulse {
  from { filter: brightness(1); }
  to   { filter: brightness(1.3) drop-shadow(0 0 12px #00f5ff); }
}
.boot-log {
  min-height: 180px;
  border: 1px solid rgba(0,245,255,.1);
  background: rgba(0,245,255,.02);
  padding: 14px 16px;
  display: flex; flex-direction: column; gap: 4px;
  overflow: hidden;
}
.boot-log-line {
  font-size: .72rem; letter-spacing: .5px; line-height: 1.6;
  display: flex; gap: 10px;
  animation: linein .15s ease both;
  .tag { flex-shrink: 0; width: 50px; }
  .msg { color: #8aaac8; }
  &.ok   .tag { color: #00f5ff; }
  &.info .tag { color: #7b2fff; }
  &.warn .tag { color: #ff006e; }
}
@keyframes linein {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: none; }
}
.boot-bar-wrap {
  display: flex; align-items: center; gap: 12px;
}
.boot-bar {
  flex: 1; height: 3px; background: rgba(0,245,255,.1);
  position: relative; overflow: hidden;
}
.boot-bar-fill {
  position: absolute; left: 0; top: 0; height: 100%;
  background: linear-gradient(90deg, #00f5ff, #7b2fff);
  box-shadow: 0 0 8px #00f5ff;
  transition: width .1s linear;
}
.boot-pct {
  font-size: .65rem; color: #00f5ff; letter-spacing: 2px;
  width: 36px; text-align: right; flex-shrink: 0;
}
.boot-status {
  font-size: .58rem; color: rgba(0,245,255,.4);
  letter-spacing: 4px; text-align: center;
  animation: blink 1s step-end infinite;
}
@keyframes blink { 50% { opacity: 0; } }

.boot-fade-leave-active { transition: opacity .6s ease, transform .6s ease; }
.boot-fade-leave-to { opacity: 0; transform: scale(1.04); }
</style>
