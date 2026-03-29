<template>
  <div class="home-page">
    <BootScreen />
    <BgSlideshow />
    <BgEffects />
    <SideNav />
    <NavBar />
    <HeroSection />
    <AboutSection />
    <SkillsSection />
    <ContestCard />
    <GeekSpace />
    <HardLab />
    <DigitalGarden />
    <PostsSection />
    <ContactSection />
    <GameShowcase />
    <GuestBook />
    <MusicPlayer />
    <footer class="home-footer">
      <div class="fl">M<b>Z</b></div>
      <div class="fc">&copy; 2026 Muz &mdash; All rights reserved</div>
      <div class="fcode">// SYSTEM v2.0.0</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import BgEffects from './components/BgEffects.vue'
import BgSlideshow from './components/BgSlideshow.vue'
import BootScreen from './components/BootScreen.vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import GeekSpace from './components/GeekSpace.vue'
import DigitalGarden from './components/DigitalGarden.vue'
import PostsSection from './components/PostsSection.vue'
import ContactSection from './components/ContactSection.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import HardLab from './components/HardLab.vue'
import ContestCard from './components/ContestCard.vue'
import GameShowcase from './components/GameShowcase.vue'
import GuestBook from './components/GuestBook.vue'
import SideNav from './components/SideNav.vue'
import { initializeSiteTheme } from './composables/useSiteTheme'

defineOptions({ name: 'HomePage' })

onMounted(() => {
  initializeSiteTheme()
  document.title = 'Muz | Home'
})
</script>

<style lang="scss">
@use './style';

:root[data-theme='light'] {
  .home-page {
    background: #f0f4f8;
    color: #1a2332;
  }

  .home-nav {
    background: linear-gradient(rgba(240, 244, 248, 0.97), transparent) !important;
    border-bottom-color: rgba(0, 120, 200, 0.1) !important;
  }

  .w {
    color: #1a2332;
  }

  .stit {
    color: #1a2332 !important;
    text-shadow: none !important;
  }

  .snum {
    color: #0077cc !important;
  }

  .sl2 {
    background: linear-gradient(90deg, #0077cc, transparent) !important;
  }

  .rv {
    color: #1a2332;
  }

  .sc,
  .pc,
  .acc-item,
  .algo-card,
  .contest-card,
  .player-card {
    background: #ffffff !important;
    border-color: rgba(0, 120, 200, 0.15) !important;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }

  .sc:hover,
  .pc:hover {
    border-color: #0077cc !important;
  }

  .scn,
  .algo-name,
  .cc-name,
  .track-title {
    color: #0077cc !important;
  }

  .scd,
  .algo-desc,
  .cc-desc,
  .ci p,
  .at p {
    color: #4a5568 !important;
  }

  .algo-meta,
  .pmeta,
  .contest-meta {
    color: #718096 !important;
  }

  .ptit {
    color: #1a2332 !important;
  }

  .pc:hover .ptit {
    color: #0077cc !important;
  }

  .home-footer {
    border-top-color: rgba(0, 120, 200, 0.1) !important;
    background: #e8edf2;

    .fl {
      color: #0077cc !important;
    }

    .fc,
    .fcode {
      color: #718096 !important;
    }
  }

  .fg input,
  .fg textarea {
    background: #f7fafc !important;
    border-color: rgba(0, 120, 200, 0.2) !important;
    color: #1a2332 !important;

    &:focus {
      border-color: #0077cc !important;
      box-shadow: 0 0 8px rgba(0, 119, 204, 0.15) !important;
    }
  }

  .fg label {
    color: #718096 !important;
  }

  .fg input:focus ~ label,
  .fg input:not(:placeholder-shown) ~ label,
  .fg textarea:focus ~ label,
  .fg textarea:not(:placeholder-shown) ~ label {
    color: #0077cc !important;
    background: #f0f4f8 !important;
  }

  #home-bg-img {
    filter: brightness(0.08) saturate(0.5) !important;
  }

  #home-cvs {
    opacity: 0.04 !important;
  }

  #home-bg-scan {
    opacity: 0.3 !important;
  }

  .bg-slideshow {
    opacity: 0.08 !important;
  }
}

.home-page {
  background: #060c14;
  color: #eaf4ff;
  font-family: 'Noto Sans SC', sans-serif;
  overflow-x: hidden;
  min-height: 100vh;

  .w {
    position: relative;
    z-index: 2;
    padding: 88px 48px;
    max-width: 1100px;
    margin: 0 auto;

    @media (max-width: 768px) {
      padding: 60px 18px;
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

  .c1 {
    color: #00f5ff;
  }

  .c2 {
    color: #ff006e;
  }

  .c3 {
    color: #7b2fff;
  }
}

.home-footer {
  position: relative;
  z-index: 2;
  border-top: 1px solid rgba(0, 245, 255, 0.07);
  padding: 26px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .fl {
    font-family: 'Orbitron', monospace;
    font-size: 1rem;
    color: #00f5ff;
    letter-spacing: 3px;

    b {
      color: #ff006e;
    }
  }

  .fc {
    font-size: 0.72rem;
    color: #8aaac8;
  }

  .fcode {
    font-family: monospace;
    font-size: 0.6rem;
    color: #8aaac8;
    opacity: 0.4;
    letter-spacing: 2px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    text-align: center;
    padding: 26px 18px;
  }
}
</style>
