<template>
  <div class="page-wrap">
    <BgSlideshow />
    <BgEffects />
    <PageNav />
    <DigitalGarden />
    <MusicPlayer />
  </div>
</template>

<script setup lang="ts">
import BgEffects from '../components/BgEffects.vue'
import BgSlideshow from '../components/BgSlideshow.vue'
import PageNav from '../components/PageNav.vue'
import DigitalGarden from '../components/DigitalGarden.vue'
import MusicPlayer from '../components/MusicPlayer.vue'
import { initializeSiteTheme } from '../composables/useSiteTheme'

onMounted(() => {
  initializeSiteTheme()
  document.title = 'Muz | Digital Garden'
})
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
    position: relative;
    z-index: 2;
    padding: 60px 48px;
    max-width: 1100px;
    margin: 0 auto;

    @media (max-width: 768px) {
      padding: 40px 18px;
    }
  }

  .sh {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 50px;
  }

  .snum {
    font-family: 'Orbitron', monospace;
    font-size: 0.65rem;
    color: #00f5ff;
    letter-spacing: 2px;
    opacity: 0.5;
  }

  .stit {
    font-family: 'Orbitron', monospace;
    font-size: 1.8rem;
    font-weight: 700;
    color: #eaf4ff;
    text-shadow: 0 0 20px rgba(0, 245, 255, 0.27);
  }

  .sl2 {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, #00f5ff, transparent);
    opacity: 0.2;
  }

  .rv {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 0.7s, transform 0.7s;
  }

  .rv.on {
    opacity: 1;
    transform: none;
  }
}
</style>
