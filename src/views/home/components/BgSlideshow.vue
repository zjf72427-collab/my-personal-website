<template>
  <div class="bg-slideshow">
    <div
      v-for="(img, i) in imgs"
      :key="img"
      class="bg-slide"
      :class="{ active: i === idx }"
      :style="{ backgroundImage: `url(${img})` }"
    ></div>
    <div class="bg-mask"></div>
  </div>
</template>

<script setup lang="ts">
const imgs = [
  '/bg/bg1.jpg','/bg/bg2.jpg','/bg/bg3.jpg','/bg/bg4.jpg',
  '/bg/bg5.jpg','/bg/bg6.jpg','/bg/bg7.jpg',
]
const idx = ref(0)
let timer: ReturnType<typeof setInterval>
onMounted(() => { timer = setInterval(() => { idx.value = (idx.value + 1) % imgs.length }, 4500) })
onUnmounted(() => clearInterval(timer))
</script>

<style lang="scss" scoped>
.bg-slideshow {
  position: fixed; inset: 0; z-index: 0;
  pointer-events: none;
}
.bg-slide {
  position: absolute; inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1.6s ease;
  transform: scale(1.04);
  &.active {
    opacity: 1;
    animation: bgz 5s ease forwards;
  }
}
@keyframes bgz {
  from { transform: scale(1.04); }
  to   { transform: scale(1); }
}
.bg-mask {
  position: absolute; inset: 0;
  background:
    linear-gradient(to bottom, rgba(6,12,20,.78) 0%, rgba(6,12,20,.62) 50%, rgba(6,12,20,.85) 100%),
    linear-gradient(135deg, rgba(0,245,255,.05) 0%, transparent 60%);
}
</style>
