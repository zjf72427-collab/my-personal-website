<template>
  <div class="page-wrap">
    <BgEffects />
    <PageNav />
    <HardLab />
    <MusicPlayer />
  </div>
</template>

<script setup lang="ts">
import BgEffects from '../components/BgEffects.vue'
import PageNav from '../components/PageNav.vue'
import HardLab from '../components/HardLab.vue'
import MusicPlayer from '../components/MusicPlayer.vue'

onMounted(() => { document.title = '木Z · 硬核实验室' })
</script>

<style lang="scss">
.page-wrap {
  background: #060c14;
  color: #eaf4ff;
  font-family: 'Noto Sans SC', sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
  padding-top: 70px;
  .w {
    position: relative; z-index: 2;
    padding: 60px 48px;
    max-width: 1100px;
    margin: 0 auto;
    @media (max-width: 768px) { padding: 40px 18px; }
  }
  .sh { display: flex; align-items: center; gap: 16px; margin-bottom: 50px; }
  .snum { font-family: 'Orbitron', monospace; font-size: .65rem; color: #00f5ff; letter-spacing: 2px; opacity: .5; }
  .stit { font-family: 'Orbitron', monospace; font-size: 1.8rem; font-weight: 700; color: #eaf4ff; }
  .sl2 { flex: 1; height: 1px; background: linear-gradient(90deg, #00f5ff, transparent); opacity: .2; }
  .rv { opacity: 0; transform: translateY(32px); transition: opacity .7s, transform .7s; }
  .rv.on { opacity: 1; transform: none; }
}
</style>
