<template>
  <nav class="page-nav">
    <RouterLink to="/" class="logo">木<b>Z</b></RouterLink>
    <ul class="nl">
      <li><RouterLink to="/">💻 极客空间</RouterLink></li>
      <li><RouterLink to="/garden">🍃 数字花园</RouterLink></li>
      <li><RouterLink to="/lab">🔬 硬核实验室</RouterLink></li>
    </ul>
    <button class="theme-toggle" @click="toggleTheme" :title="isDark ? '切换亮色' : '切换暗色'">
      {{ isDark ? '☀️' : '🌙' }}
    </button>
  </nav>
</template>

<script setup lang="ts">
const isDark = ref(true)

function applyTheme(dark: boolean) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  localStorage.setItem('muz-theme', dark ? 'dark' : 'light')
}

function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
}

onMounted(() => {
  const saved = localStorage.getItem('muz-theme')
  isDark.value = saved !== 'light'
  applyTheme(isDark.value)
})
</script>

<style lang="scss" scoped>
.page-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 48px;
  background: linear-gradient(rgba(6,12,20,.95), transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0,245,255,.06);
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
    font-size: .75rem; letter-spacing: 2px;
    transition: .15s; position: relative; padding-bottom: 4px;
    &::after {
      content: ''; position: absolute; bottom: 0; left: 0;
      width: 0; height: 1px; background: #00f5ff; transition: width .15s;
    }
    &:hover { color: #00f5ff; }
    &:hover::after { width: 100%; }
    &.router-link-active, &.router-link-exact-active {
      color: #00f5ff;
      &::after { width: 100%; }
    }
  }
}
.theme-toggle {
  background: rgba(0,245,255,.08);
  border: 1px solid rgba(0,245,255,.2);
  color: #eaf4ff; font-size: 1rem;
  width: 36px; height: 36px; border-radius: 50%;
  cursor: pointer; transition: .15s;
  display: flex; align-items: center; justify-content: center;
  &:hover { background: rgba(0,245,255,.18); border-color: #00f5ff; }
}
@media (max-width: 768px) {
  .page-nav { padding: 14px 18px; }
  .nl { display: none; }
}
</style>
