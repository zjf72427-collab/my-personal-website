<template>
  <div class="music-player" :class="{ expanded }">
    <!-- Hidden HTML5 audio element -->
    <audio ref="audioEl" loop preload="none" @timeupdate="onTimeUpdate" @ended="onEnded">
      <!-- Put your .mp3 in public/music/spring-snow.mp3 and it will be loaded automatically -->
      <!-- Or replace the src below with any direct MP3 URL -->
      <source :src="trackSrc" type="audio/mpeg" />
    </audio>

    <div class="mp-toggle" @click="expanded = !expanded" :title="expanded ? '收起' : '展开播放器'">♫</div>

    <div class="mp-body">
      <div class="mp-top">
        <div class="mp-disc" :class="{ spinning: playing }">🌸</div>
        <div class="mp-info">
          <div class="mp-title">春雪 Spring Snow</div>
          <div class="mp-artist">10CM</div>
        </div>
        <div class="mp-controls">
          <button class="mp-btn" @click="togglePlay" :title="playing ? '暂停' : '播放'">
            {{ playing ? '⏸' : '▶' }}
          </button>
        </div>
      </div>
      <div class="mp-progress" @click="seek">
        <div class="mp-bar">
          <div class="mp-fill" :style="{ width: progressPct + '%' }"></div>
        </div>
        <div class="mp-times">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>
      <div class="mp-hint" v-if="noSrc">// 将 .mp3 放入 public/music/ 即可播放</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 音乐文件放置说明：
// 1. 将你的 .mp3 文件重命名为 spring-snow.mp3
// 2. 复制到 E:/wz/art-design-pro/public/music/spring-snow.mp3
// 3. 刷新页面即可播放，无需修改代码
//
// 测试用无版权音乐（需联网）：
// https://www.bensound.com/bensound-music/bensound-sunny.mp3

const trackSrc = '/music/spring-snow.mp3'

const audioEl = ref<HTMLAudioElement | null>(null)
const playing = ref(false)
const expanded = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const noSrc = ref(false)

const progressPct = computed(() =>
  duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
)

function togglePlay() {
  const el = audioEl.value
  if (!el) return
  if (playing.value) {
    el.pause()
    playing.value = false
  } else {
    el.play().then(() => {
      playing.value = true
      noSrc.value = false
      if (!duration.value && el.duration) duration.value = el.duration
    }).catch(() => {
      noSrc.value = true
      playing.value = false
    })
  }
}

function onTimeUpdate() {
  const el = audioEl.value
  if (!el) return
  currentTime.value = el.currentTime
  if (!duration.value && el.duration) duration.value = el.duration
}

function onEnded() {
  playing.value = false
  currentTime.value = 0
}

function seek(e: MouseEvent) {
  const el = audioEl.value
  if (!el || !duration.value) return
  const bar = (e.currentTarget as HTMLElement).querySelector('.mp-bar') as HTMLElement
  const rect = bar.getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  el.currentTime = ratio * duration.value
}

function formatTime(sec: number): string {
  if (!sec || isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
</script>

<style lang="scss" scoped>
.music-player {
  position: fixed; right: 24px; bottom: 24px; z-index: 999;
  display: flex; flex-direction: column; align-items: flex-end; gap: 8px;
}
.mp-toggle {
  width: 44px; height: 44px; border-radius: 50%;
  background: linear-gradient(135deg, #00f5ff, #7b2fff);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; cursor: pointer;
  box-shadow: 0 0 20px rgba(0,245,255,.4);
  transition: transform .2s;
  &:hover { transform: scale(1.1); }
}
.mp-body {
  background: rgba(6,12,20,.95);
  border: 1px solid rgba(0,245,255,.2);
  backdrop-filter: blur(12px);
  width: 240px;
  clip-path: polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));
  max-height: 0; overflow: hidden; opacity: 0;
  transition: max-height .35s ease, opacity .3s ease;
  .music-player.expanded & { max-height: 160px; opacity: 1; }
}
.mp-top {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 16px 8px;
}
.mp-disc {
  width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
  background: #0f1e34; border: 2px solid rgba(0,245,255,.3);
  display: flex; align-items: center; justify-content: center; font-size: 1.3rem;
  &.spinning { animation: spin 4s linear infinite; }
}
@keyframes spin { to { transform: rotate(360deg); } }
.mp-info { flex: 1; min-width: 0; }
.mp-title {
  font-family: 'Orbitron', monospace; font-size: .7rem;
  color: #eaf4ff; letter-spacing: 1px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.mp-artist { font-size: .62rem; color: #00f5ff; margin-top: 2px; }
.mp-btn {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  background: rgba(0,245,255,.1); border: 1px solid rgba(0,245,255,.3);
  color: #00f5ff; font-size: .9rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: .15s; &:hover { background: rgba(0,245,255,.25); }
}
.mp-progress {
  padding: 0 16px 12px; cursor: pointer;
}
.mp-bar {
  height: 3px; background: rgba(0,245,255,.1); border-radius: 2px; overflow: hidden;
  margin-bottom: 4px;
}
.mp-fill {
  height: 100%; background: linear-gradient(90deg, #00f5ff, #7b2fff);
  border-radius: 2px; transition: width .5s linear;
}
.mp-times {
  display: flex; justify-content: space-between;
  font-size: .58rem; color: rgba(0,245,255,.4); font-family: monospace;
}
.mp-hint {
  padding: 0 16px 10px;
  font-size: .6rem; color: rgba(0,245,255,.35);
  font-family: monospace; letter-spacing: 1px;
}
</style>
