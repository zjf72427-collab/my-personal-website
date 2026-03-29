<template>
  <nav class="home-nav">
    <div class="scroll-progress" :style="{ width: `${scrollPct}%` }"></div>
    <RouterLink to="/" class="logo">
      M<span>Z</span>
      <small>geek archive</small>
    </RouterLink>
    <ul class="nl" :class="{ open: menuOpen }">
      <li v-for="item in navItems" :key="item.id">
        <a
          :href="`#${item.id}`"
          :class="{ 'nav-active': activeSection === item.id }"
          @click.prevent="navClick(item.id)"
        >
          <span class="nav-label">{{ item.label }}</span>
          <small>{{ item.hint }}</small>
        </a>
      </li>
    </ul>
    <div class="nav-right">
      <button
        type="button"
        class="theme-toggle"
        :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
        @click.stop="toggleTheme"
      >
        {{ isDark ? 'LIGHT' : 'DARK' }}
      </button>
      <button
        type="button"
        class="hamburger"
        :class="{ open: menuOpen }"
        :aria-expanded="menuOpen"
        aria-label="切换导航菜单"
        @click.stop="menuOpen = !menuOpen"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>
  <div v-if="menuOpen" class="nav-backdrop" @click="menuOpen = false"></div>
</template>

<script setup lang="ts">
import { useSiteTheme } from '../composables/useSiteTheme'

const { isDark, toggleTheme } = useSiteTheme()

const menuOpen = ref(false)
const scrollPct = ref(0)
const activeSection = ref('')

const navItems = [
  { id: 'geek', label: 'Geek Space', hint: 'stack' },
  { id: 'lab', label: 'Hard Lab', hint: 'notes' },
  { id: 'garden', label: 'Garden', hint: 'archive' },
  { id: 'posts', label: 'Posts', hint: 'latest' },
  { id: 'guestbook', label: 'Guestbook', hint: 'talk' },
  { id: 'contact', label: 'Contact', hint: 'reach me' }
]

function navClick(id: string) {
  menuOpen.value = false
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function onScroll() {
  const doc = document.documentElement
  const scrollableHeight = Math.max(doc.scrollHeight - doc.clientHeight, 1)
  scrollPct.value = (doc.scrollTop / scrollableHeight) * 100

  let current = ''
  for (const { id } of navItems) {
    const element = document.getElementById(id)
    if (element && element.getBoundingClientRect().top <= 120) {
      current = id
    }
  }

  activeSection.value = current
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style lang="scss" scoped>
.home-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 48px;
  background: linear-gradient(rgba(6, 12, 20, 0.97), rgba(6, 12, 20, 0.85));
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 245, 255, 0.06);
}

.scroll-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #00f5ff, #7b2fff);
  box-shadow: 0 0 8px #00f5ff;
  transition: width 0.1s linear;
  z-index: 101;
}

.logo {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  font-family: 'Orbitron', monospace;
  font-size: 1.4rem;
  font-weight: 900;
  color: #00f5ff;
  text-decoration: none;
  letter-spacing: 4px;
  text-shadow: 0 0 20px #00f5ff;

  span {
    color: #ff006e;
  }

  small {
    font-size: 0.45rem;
    letter-spacing: 2px;
    color: rgba(138, 170, 200, 0.7);
    text-transform: uppercase;
  }
}

.nl {
  display: flex;
  gap: 20px;
  list-style: none;

  a {
    color: #8aaac8;
    text-decoration: none;
    font-size: 0.72rem;
    letter-spacing: 1.5px;
    transition: 0.15s;
    position: relative;
    padding-bottom: 4px;
    display: flex;
    flex-direction: column;
    gap: 3px;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 1px;
      background: #00f5ff;
      transition: width 0.2s;
    }

    &:hover,
    &:focus-visible {
      color: #00f5ff;
      outline: none;
    }

    &:hover::after,
    &:focus-visible::after {
      width: 100%;
    }

    &.nav-active {
      color: #00f5ff;

      &::after {
        width: 100%;
      }
    }

    small {
      font-size: 0.52rem;
      letter-spacing: 1.4px;
      opacity: 0.55;
      text-transform: uppercase;
    }
  }
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.theme-toggle {
  background: rgba(0, 245, 255, 0.08);
  border: 1px solid rgba(0, 245, 255, 0.2);
  color: #eaf4ff;
  font-size: 0.62rem;
  letter-spacing: 1.4px;
  min-width: 68px;
  height: 36px;
  border-radius: 999px;
  cursor: pointer;
  transition: 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 245, 255, 0.18);
    border-color: #00f5ff;
  }

  &:focus-visible {
    outline: 2px solid #00f5ff;
    outline-offset: 2px;
  }
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;

  span {
    display: block;
    height: 1.5px;
    background: #8aaac8;
    transition: transform 0.25s, opacity 0.25s, background 0.15s;
  }

  &:hover span,
  &:focus-visible span {
    background: #00f5ff;
  }

  &:focus-visible {
    outline: 2px solid #00f5ff;
    outline-offset: 2px;
  }

  &.open {
    span:nth-child(1) {
      transform: translateY(6.5px) rotate(45deg);
      background: #00f5ff;
    }

    span:nth-child(2) {
      opacity: 0;
    }

    span:nth-child(3) {
      transform: translateY(-6.5px) rotate(-45deg);
      background: #00f5ff;
    }
  }
}

:global(:root[data-theme='light']) {
  .home-nav {
    background: linear-gradient(rgba(240, 244, 248, 0.97), rgba(240, 244, 248, 0.9));
    border-bottom-color: rgba(0, 120, 200, 0.1);
  }

  .home-nav .logo {
    color: #0077cc;
    text-shadow: none;
  }

  .home-nav .logo small,
  .home-nav .nl a small {
    color: #718096;
  }

  .home-nav .nl a {
    color: #4a5568;
  }

  .home-nav .nl a:hover,
  .home-nav .nl a.nav-active {
    color: #0077cc;
  }

  .home-nav .theme-toggle {
    background: rgba(0, 119, 204, 0.08);
    border-color: rgba(0, 119, 204, 0.25);
    color: #0077cc;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.7) inset;
  }

  .home-nav .theme-toggle:hover {
    background: rgba(0, 119, 204, 0.14);
    border-color: #0077cc;
  }

  .home-nav .hamburger span {
    background: #4a5568;
  }

  .home-nav .hamburger:hover span,
  .home-nav .hamburger.open span {
    background: #0077cc;
  }
}

.nav-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 99;
}

@media (max-width: 768px) {
  .home-nav {
    padding: 14px 18px;
  }

  .logo small {
    display: none;
  }

  .hamburger {
    display: flex;
  }

  .nav-backdrop {
    display: block;
  }

  .nl {
    display: none;
    position: fixed;
    top: 58px;
    right: 0;
    width: 220px;
    flex-direction: column;
    gap: 0;
    background: rgba(6, 12, 20, 0.98);
    border: 1px solid rgba(0, 245, 255, 0.12);
    border-top: none;
    z-index: 100;
    padding: 8px 0;

    &.open {
      display: flex;
    }

    li a {
      display: block;
      padding: 12px 24px;
      font-size: 0.78rem;
      letter-spacing: 2px;

      &:hover {
        background: rgba(0, 245, 255, 0.06);
      }

      &::after {
        display: none;
      }
    }
  }
}
</style>
