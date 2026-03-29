<template>
  <div class="music-player" :class="{ expanded }">
    <audio
      ref="audioEl"
      preload="metadata"
      loop
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @play="playing = true"
      @pause="playing = false"
      @ended="onEnded"
      @error="onError"
    >
      <source :src="trackSrc" type="audio/mpeg" />
    </audio>

    <button
      type="button"
      class="mp-toggle"
      :title="expanded ? '收起播放器' : '展开播放器'"
      @click.stop="expanded = !expanded"
    >
      MUSIC
    </button>

    <div class="mp-body">
      <div class="mp-top">
        <div class="mp-disc" :class="{ spinning: playing }">10CM</div>
        <div class="mp-info">
          <div class="mp-title">Spring Snow</div>
          <div class="mp-artist">10CM · personal loop</div>
        </div>
        <div class="mp-controls">
          <button type="button" class="mp-btn" :title="playing ? '暂停' : '播放'" @click.stop="togglePlay">
            {{ playing ? 'PAUSE' : 'PLAY' }}
          </button>
        </div>
      </div>
      <div class="mp-progress" @click.stop="seek">
        <div ref="progressBarEl" class="mp-bar">
          <div class="mp-fill" :style="{ width: `${progressPct}%` }"></div>
        </div>
        <div class="mp-times">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>
      <div class="mp-caption">Late-night coding companion</div>
      <div v-if="errorMessage" class="mp-hint">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const trackSrc = '/music/spring-snow.mp3'

const audioEl = ref<HTMLAudioElement | null>(null)
const progressBarEl = ref<HTMLElement | null>(null)
const playing = ref(false)
const expanded = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const errorMessage = ref('将 `spring-snow.mp3` 放到 `public/music/` 后即可启用真实播放。')

const progressPct = computed(() => (duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0))

async function togglePlay() {
  const element = audioEl.value
  if (!element) return

  if (playing.value) {
    element.pause()
    return
  }

  try {
    await element.play()
    errorMessage.value = ''
  } catch {
    playing.value = false
    errorMessage.value = '浏览器阻止了自动播放，请再次点击 PLAY。'
  }
}

function onLoadedMetadata() {
  if (!audioEl.value) return
  duration.value = Number.isFinite(audioEl.value.duration) ? audioEl.value.duration : 0
}

function onTimeUpdate() {
  if (!audioEl.value) return
  currentTime.value = audioEl.value.currentTime
}

function onEnded() {
  playing.value = false
  currentTime.value = 0
}

function onError() {
  errorMessage.value = '未找到音频文件，请添加 `public/music/spring-snow.mp3`。'
}

function seek(event: MouseEvent) {
  const element = audioEl.value
  const bar = progressBarEl.value
  if (!element || !bar || !duration.value) return

  const rect = bar.getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
  element.currentTime = ratio * duration.value
  currentTime.value = element.currentTime
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remain = Math.floor(seconds % 60)
  return `${minutes}:${remain.toString().padStart(2, '0')}`
}

onUnmounted(() => {
  if (!audioEl.value) return
  audioEl.value.pause()
  audioEl.value.currentTime = 0
})
</script>

<style lang="scss" scoped>
.music-player {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.mp-toggle {
  min-width: 76px;
  height: 44px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid rgba(0, 245, 255, 0.4);
  background: linear-gradient(135deg, #00f5ff, #7b2fff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.62rem;
  letter-spacing: 1.8px;
  color: #04111f;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(0, 245, 255, 0.4);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  &:focus-visible {
    outline: 2px solid #00f5ff;
    outline-offset: 2px;
  }
}

.mp-body {
  background: rgba(6, 12, 20, 0.95);
  border: 1px solid rgba(0, 245, 255, 0.2);
  backdrop-filter: blur(12px);
  width: 260px;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.35s ease, opacity 0.3s ease;

  .music-player.expanded & {
    max-height: 190px;
    opacity: 1;
  }
}

.mp-top {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px 8px;
}

.mp-disc {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
  background: #0f1e34;
  border: 2px solid rgba(0, 245, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-family: 'Orbitron', monospace;
  color: #00f5ff;

  &.spinning {
    animation: spin 4s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.mp-info {
  flex: 1;
  min-width: 0;
}

.mp-title {
  font-family: 'Orbitron', monospace;
  font-size: 0.7rem;
  color: #eaf4ff;
  letter-spacing: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mp-artist {
  font-size: 0.62rem;
  color: #00f5ff;
  margin-top: 2px;
}

.mp-btn {
  min-width: 58px;
  height: 32px;
  border-radius: 999px;
  flex-shrink: 0;
  background: rgba(0, 245, 255, 0.1);
  border: 1px solid rgba(0, 245, 255, 0.3);
  color: #00f5ff;
  font-size: 0.58rem;
  letter-spacing: 1.4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.15s;

  &:hover {
    background: rgba(0, 245, 255, 0.25);
  }

  &:focus-visible {
    outline: 2px solid #00f5ff;
    outline-offset: 2px;
  }
}

.mp-progress {
  padding: 0 16px 8px;
  cursor: pointer;
}

.mp-bar {
  height: 3px;
  background: rgba(0, 245, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.mp-fill {
  height: 100%;
  background: linear-gradient(90deg, #00f5ff, #7b2fff);
  border-radius: 2px;
  transition: width 0.2s linear;
}

.mp-times {
  display: flex;
  justify-content: space-between;
  font-size: 0.58rem;
  color: rgba(0, 245, 255, 0.4);
  font-family: monospace;
}

.mp-caption {
  padding: 0 16px 2px;
  font-size: 0.6rem;
  color: rgba(234, 244, 255, 0.72);
  letter-spacing: 0.8px;
}

.mp-hint {
  padding: 0 16px 12px;
  font-size: 0.6rem;
  color: rgba(0, 245, 255, 0.45);
  font-family: monospace;
  letter-spacing: 0.6px;
}

:global(:root[data-theme='light']) {
  .music-player .mp-body {
    background: rgba(255, 255, 255, 0.96);
    border-color: rgba(0, 119, 204, 0.18);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  }

  .music-player .mp-title,
  .music-player .mp-caption {
    color: #1a2332;
  }

  .music-player .mp-artist,
  .music-player .mp-btn,
  .music-player .mp-disc {
    color: #0077cc;
  }

  .music-player .mp-btn {
    background: rgba(0, 119, 204, 0.08);
    border-color: rgba(0, 119, 204, 0.2);
  }

  .music-player .mp-btn:hover {
    background: rgba(0, 119, 204, 0.16);
  }

  .music-player .mp-bar {
    background: rgba(0, 119, 204, 0.12);
  }

  .music-player .mp-times,
  .music-player .mp-hint {
    color: rgba(0, 119, 204, 0.5);
  }
}
</style>
