<template>
  <nav class="home-nav">
    <div class="scroll-progress" :style="{ width: scrollPct + '%' }"></div>
    <RouterLink to="/" class="logo">木<b>Z</b></RouterLink>
    <ul class="nl" :class="{ open: menuOpen }">
      <li v-for="item in navItems" :key="item.id">
        <a :href="'#' + item.id"
          @click.prevent="navClick(item.id)"
          :class="{ 'nav-active': activeSection === item.id }">
          {{ item.label }}
        </a>
      </li>
    </ul>
    <div class="nav-right">
      <button class="theme-toggle" @click="toggleTheme" :title="isDark ? '切换亮色' : '切换暗色'">
        {{ isDark ? '☀️' : '🌙' }}
      </button>
      <button class="hamburger" @click="menuOpen = !menuOpen" :class="{ open: menuOpen }">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>
  <div v-if="menuOpen" class="nav-backdrop" @click="menuOpen = false"></div>
</template>

<script setup lang="ts">
const isDark = ref(true)
const menuOpen = ref(false)
const scrollPct = ref(0)
const activeSection = ref('')

const navItems = [
  { id: 'geek',      label: '💻 极客空间' },
  { id: 'lab',       label: '🔬 硬核实验室' },
  { id: 'garden',    label: '🍃 数字花园' },
  { id: 'posts',     label: '📝 博客' },
  { id: 'guestbook', label: '💬 留言板' },
  { id: 'contact',   label: '📡 联系' },
]

function applyTheme(dark: boolean) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  localStorage.setItem('muz-theme', dark ? 'dark' : 'light')
}
function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
}
function navClick(id: string) {
  menuOpen.value = false
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
function onScroll() {
  const doc = document.documentElement
  scrollPct.value = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100
  // scroll spy
  const ids = navItems.map(n => n.id)
  let current = ''
  for (const id of ids) {
    const el = document.getElementById(id)
    if (el && el.getBoundingClientRect().top <= 120) current = id
  }
  activeSection.value = current
}

onMounted(() => {
  const saved = localStorage.getItem('muz-theme')
  isDark.value = saved !== 'light'
  applyTheme(isDark.value)
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style lang="scss" scoped>
.home-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 48px;
  background: linear-gradient(rgba(6,12,20,.97), rgba(6,12,20,.85));
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0,245,255,.06);
}
.scroll-progress {
  position: absolute; top: 0; left: 0; height: 2px;
  background: linear-gradient(90deg, #00f5ff, #7b2fff);
  box-shadow: 0 0 8px #00f5ff;
  transition: width .1s linear;
  z-index: 101;
}
.logo {
  font-family: 'Orbitron', monospace;
  font-size: 1.4rem; font-weight: 900;
  color: #00f5ff; text-decoration: none;
  letter-spacing: 4px; text-shadow: 0 0 20px #00f5ff;
  b { color: #ff006e; }
}
.nl {
  display: flex; gap: 20px; list-style: none;
  a {
    color: #8aaac8; text-decoration: none;
    font-size: .72rem; letter-spacing: 1.5px; text-transform: uppercase;
    transition: .15s; position: relative; padding-bottom: 4px;
    &::after {
      content: ''; position: absolute; bottom: 0; left: 0;
      width: 0; height: 1px; background: #00f5ff; transition: width .2s;
    }
    &:hover { color: #00f5ff; }
    &:hover::after { width: 100%; }
    &.nav-active { color: #00f5ff; &::after { width: 100%; } }
  }
}
.nav-right { display: flex; align-items: center; gap: 10px; }
.theme-toggle {
  background: rgba(0,245,255,.08); border: 1px solid rgba(0,245,255,.2);
  color: #eaf4ff; font-size: 1rem; width: 36px; height: 36px; border-radius: 50%;
  cursor: pointer; transition: .15s; display: flex; align-items: center; justify-content: center;
  &:hover { background: rgba(0,245,255,.18); border-color: #00f5ff; }
}
.hamburger {
  display: none; flex-direction: column; gap: 5px; justify-content: center;
  width: 36px; height: 36px; background: none; border: none; cursor: pointer; padding: 6px;
  span {
    display: block; height: 1.5px; background: #8aaac8;
    transition: transform .25s, opacity .25s, background .15s;
  }
  &:hover span { background: #00f5ff; }
  &.open {
    span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); background: #00f5ff; }
    span:nth-child(2) { opacity: 0; }
    span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); background: #00f5ff; }
  }
}
.nav-backdrop {
  display: none;
  position: fixed; inset: 0; z-index: 99;
}
@media (max-width: 768px) {
  .home-nav { padding: 14px 18px; }
  .hamburger { display: flex; }
  .nav-backdrop { display: block; }
  .nl {
    display: none;
    position: fixed; top: 58px; right: 0; width: 220px;
    flex-direction: column; gap: 0;
    background: rgba(6,12,20,.98); border: 1px solid rgba(0,245,255,.12);
    border-top: none; z-index: 100; padding: 8px 0;
    &.open { display: flex; }
    li a {
      display: block; padding: 12px 24px;
      font-size: .78rem; letter-spacing: 2px;
      &:hover { background: rgba(0,245,255,.06); }
      &::after { display: none; }
    }
  }
}
</style>
