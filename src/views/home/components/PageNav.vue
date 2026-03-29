<template>
  <nav class="page-nav">
    <RouterLink to="/" class="logo">
      M<span>Z</span>
      <small>field manual</small>
    </RouterLink>

    <ul class="nl" :class="{ open: menuOpen }">
      <li v-for="item in navItems" :key="item.to">
        <RouterLink :to="item.to" @click="menuOpen = false">
          <span class="nav-label">{{ item.label }}</span>
          <span class="nav-desc">{{ item.desc }}</span>
        </RouterLink>
      </li>
    </ul>

    <div class="nav-actions">
      <button
        type="button"
        class="theme-toggle"
        :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
        @click.stop="toggleTheme"
      >
        <span class="toggle-mode">{{ isDark ? 'LIGHT' : 'DARK' }}</span>
      </button>
      <button
        type="button"
        class="hamburger"
        :class="{ open: menuOpen }"
        :aria-expanded="menuOpen"
        aria-label="切换页面导航"
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

const navItems = [
  { to: '/', label: 'Geek Space', desc: '首页' },
  { to: '/garden', label: 'Digital Garden', desc: '笔记库' },
  { to: '/lab', label: 'Hard Lab', desc: '实验室' }
]

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    menuOpen.value = false
  }
}

watch(menuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style lang="scss" scoped>
.page-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 48px;
  background: linear-gradient(rgba(6, 12, 20, 0.95), rgba(6, 12, 20, 0.76));
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 245, 255, 0.06);
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
    display: flex;
    flex-direction: column;
    gap: 2px;
    color: #8aaac8;
    text-decoration: none;
    transition: 0.15s;
    position: relative;
    padding-bottom: 4px;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 1px;
      background: #00f5ff;
      transition: width 0.15s;
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

    &.router-link-active,
    &.router-link-exact-active {
      color: #00f5ff;

      &::after {
        width: 100%;
      }
    }
  }
}

.nav-label {
  font-size: 0.75rem;
  letter-spacing: 2px;
}

.nav-desc {
  font-size: 0.56rem;
  opacity: 0.58;
  letter-spacing: 1px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.theme-toggle {
  background: rgba(0, 245, 255, 0.08);
  border: 1px solid rgba(0, 245, 255, 0.2);
  color: #eaf4ff;
  min-width: 68px;
  height: 36px;
  border-radius: 999px;
  cursor: pointer;
  transition: 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;

  &:hover {
    background: rgba(0, 245, 255, 0.18);
    border-color: #00f5ff;
  }

  &:focus-visible {
    outline: 2px solid #00f5ff;
    outline-offset: 2px;
  }
}

.toggle-mode {
  font-family: 'Orbitron', monospace;
  font-size: 0.6rem;
  letter-spacing: 1.8px;
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

  &:hover span {
    background: #00f5ff;
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
  .page-nav {
    background: linear-gradient(rgba(240, 244, 248, 0.95), rgba(240, 244, 248, 0.82));
    border-bottom-color: rgba(0, 120, 200, 0.1);
  }

  .page-nav .logo {
    color: #0077cc;
    text-shadow: none;
  }

  .page-nav .logo small {
    color: #718096;
  }

  .page-nav .nl a {
    color: #4a5568;
  }

  .page-nav .nl a:hover,
  .page-nav .nl a.router-link-active,
  .page-nav .nl a.router-link-exact-active {
    color: #0077cc;
  }

  .page-nav .theme-toggle {
    background: rgba(0, 119, 204, 0.08);
    border-color: rgba(0, 119, 204, 0.25);
    color: #0077cc;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.7) inset;
  }

  .page-nav .theme-toggle:hover {
    background: rgba(0, 119, 204, 0.14);
    border-color: #0077cc;
  }

  .page-nav .hamburger span {
    background: #4a5568;
  }

  .page-nav .hamburger:hover span,
  .page-nav .hamburger.open span {
    background: #0077cc;
  }
}

.nav-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99;
  background: rgba(3, 8, 16, 0.42);
}

@media (max-width: 768px) {
  .page-nav {
    padding: 14px 18px;
  }

  .logo small {
    display: none;
  }

  .hamburger {
    display: flex;
  }

  .nl {
    display: none;
    position: fixed;
    top: 58px;
    right: 18px;
    width: min(280px, calc(100vw - 36px));
    flex-direction: column;
    gap: 0;
    background: rgba(6, 12, 20, 0.98);
    border: 1px solid rgba(0, 245, 255, 0.12);
    z-index: 100;
    padding: 8px 0;
    box-shadow: 0 20px 36px rgba(0, 0, 0, 0.35);

    &.open {
      display: flex;
    }

    li a {
      display: block;
      padding: 12px 18px;

      &::after {
        display: none;
      }
    }
  }
}
</style>
