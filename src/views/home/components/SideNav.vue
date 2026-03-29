<template>
  <div class="side-nav" :class="{ visible: showNav }">
    <button
      v-for="item in sections"
      :key="item.id"
      type="button"
      class="sn-dot"
      :class="{ active: activeId === item.id }"
      :title="item.label"
      @click.stop="scrollTo(item.id)"
    >
      <span class="sn-label">{{ item.label }}</span>
      <span class="sn-pip"></span>
    </button>

    <button type="button" class="sn-help" title="查看快捷键" @click.stop="showKb = true">?</button>
  </div>

  <Transition name="kb-fade">
    <div v-if="showKb" class="kb-overlay" @click.self="showKb = false">
      <div class="kb-panel">
        <div class="kb-title">KEYBOARD SHORTCUTS</div>
        <div class="kb-subtitle">保持极简操作，快速跳到你想看的区域。</div>
        <div class="kb-list">
          <div v-for="shortcut in shortcuts" :key="shortcut.key" class="kb-row">
            <kbd class="kb-key">{{ shortcut.key }}</kbd>
            <span class="kb-desc">{{ shortcut.desc }}</span>
          </div>
        </div>
        <button type="button" class="kb-close" @click="showKb = false">CLOSE</button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const sections = [
  { id: 'hero', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'contest', label: 'PROJECT' },
  { id: 'geek', label: 'GEEK' },
  { id: 'lab', label: 'LAB' },
  { id: 'garden', label: 'GARDEN' },
  { id: 'posts', label: 'POSTS' },
  { id: 'guestbook', label: 'GUESTBOOK' },
  { id: 'contact', label: 'CONTACT' }
]

const shortcuts = [
  { key: 'G', desc: '跳转到 Geek Space' },
  { key: 'L', desc: '跳转到 Hard Lab' },
  { key: 'D', desc: '跳转到 Digital Garden' },
  { key: 'B', desc: '跳转到 Posts' },
  { key: 'C', desc: '跳转到 Contact' },
  { key: '/', desc: '聚焦 Garden 搜索框' },
  { key: '`', desc: '聚焦 Lab 终端输入框' },
  { key: 'T', desc: '切换暗黑模式' },
  { key: '?', desc: '打开快捷键帮助' },
  { key: 'Esc', desc: '关闭浮层' }
]

const activeId = ref('')
const showNav = ref(false)
const showKb = ref(false)

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onScroll() {
  showNav.value = window.scrollY > 100

  let current = ''
  for (const section of sections) {
    const el = document.getElementById(section.id)
    if (el && el.getBoundingClientRect().top <= 160) {
      current = section.id
    }
  }

  activeId.value = current
}

function onKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null
  const tag = target?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA') return

  const key = event.key
  if (key === 'Escape') {
    showKb.value = false
    return
  }

  if (key === '?') {
    event.preventDefault()
    showKb.value = !showKb.value
    return
  }

  const map: Record<string, string> = {
    g: 'geek',
    G: 'geek',
    l: 'lab',
    L: 'lab',
    d: 'garden',
    D: 'garden',
    b: 'posts',
    B: 'posts',
    c: 'contact',
    C: 'contact'
  }

  if (map[key]) {
    scrollTo(map[key])
    return
  }

  if (key === '/') {
    event.preventDefault()
    const input = document.querySelector('#garden .gs-input') as HTMLInputElement | null
    input?.focus()
    input?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }

  if (key === '`') {
    event.preventDefault()
    const input = document.querySelector('#lab .iterm-real-input') as HTMLInputElement | null
    input?.focus()
    input?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }

  if (key === 't' || key === 'T') {
    const btn = document.querySelector('.theme-toggle') as HTMLButtonElement | null
    btn?.click()
  }
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style lang="scss" scoped>
.side-nav {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;

  &.visible {
    opacity: 1;
    pointer-events: auto;
  }

  @media (max-width: 900px) {
    display: none;
  }
}

.sn-dot,
.sn-help {
  border: none;
  background: none;
}

.sn-dot {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  justify-content: flex-end;

  &:hover .sn-label,
  &:focus-visible .sn-label,
  &.active .sn-label {
    opacity: 1;
    transform: translateX(0);
  }

  &:hover .sn-pip,
  &:focus-visible .sn-pip,
  &.active .sn-pip {
    background: #00f5ff;
    box-shadow: 0 0 6px #00f5ff;
    transform: scale(1.4);
  }

  &:focus-visible {
    outline: none;
  }
}

.sn-label {
  font-family: 'Orbitron', monospace;
  font-size: 0.5rem;
  color: #00f5ff;
  letter-spacing: 2px;
  opacity: 0;
  transform: translateX(8px);
  transition: opacity 0.2s, transform 0.2s;
  white-space: nowrap;
}

.sn-pip {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(0, 245, 255, 0.3);
  border: 1px solid rgba(0, 245, 255, 0.4);
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  flex-shrink: 0;
}

.sn-help {
  margin-top: 8px;
  width: 28px;
  height: 28px;
  align-self: flex-end;
  border-radius: 50%;
  border: 1px solid rgba(0, 245, 255, 0.22);
  color: rgba(0, 245, 255, 0.78);
  font-family: 'Orbitron', monospace;
  font-size: 0.78rem;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s, background 0.15s;

  &:hover,
  &:focus-visible {
    transform: scale(1.08);
    background: rgba(0, 245, 255, 0.08);
    border-color: #00f5ff;
    outline: none;
  }
}

.kb-overlay {
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(2, 4, 8, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.kb-panel {
  background: #0a1520;
  border: 1px solid rgba(0, 245, 255, 0.2);
  padding: 32px 40px;
  min-width: 340px;
  max-width: min(92vw, 520px);
  box-shadow: 0 0 40px rgba(0, 245, 255, 0.1);
}

.kb-title {
  font-family: 'Orbitron', monospace;
  font-size: 0.72rem;
  color: #00f5ff;
  letter-spacing: 4px;
  margin-bottom: 10px;
}

.kb-subtitle {
  font-size: 0.75rem;
  color: #8aaac8;
  line-height: 1.7;
  margin-bottom: 24px;
}

.kb-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.kb-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

kbd.kb-key {
  font-family: monospace;
  font-size: 0.72rem;
  background: rgba(0, 245, 255, 0.08);
  border: 1px solid rgba(0, 245, 255, 0.3);
  color: #00f5ff;
  padding: 3px 10px;
  min-width: 40px;
  text-align: center;
  border-radius: 2px;
}

.kb-desc {
  font-size: 0.78rem;
  color: #8aaac8;
}

.kb-close {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid rgba(0, 245, 255, 0.2);
  background: rgba(0, 245, 255, 0.05);
  color: #00f5ff;
  font-family: 'Orbitron', monospace;
  font-size: 0.64rem;
  letter-spacing: 2px;
  cursor: pointer;
}

.kb-fade-enter-active,
.kb-fade-leave-active {
  transition: opacity 0.2s;
}

.kb-fade-enter-from,
.kb-fade-leave-to {
  opacity: 0;
}

:global(:root[data-theme='light']) {
  .sn-label,
  .sn-help {
    color: #0077cc;
  }

  .sn-pip {
    background: rgba(0, 119, 204, 0.28);
    border-color: rgba(0, 119, 204, 0.3);
  }

  .sn-dot:hover .sn-pip,
  .sn-dot.active .sn-pip {
    background: #0077cc;
    box-shadow: 0 0 6px rgba(0, 119, 204, 0.45);
  }

  .sn-help {
    border-color: rgba(0, 119, 204, 0.22);
  }

  .sn-help:hover {
    background: rgba(0, 119, 204, 0.08);
    border-color: #0077cc;
  }

  .kb-panel {
    background: #ffffff;
    border-color: rgba(0, 120, 200, 0.18);
  }

  .kb-title,
  .kb-close {
    color: #0077cc;
  }

  .kb-subtitle,
  .kb-desc {
    color: #4a5568;
  }

  kbd.kb-key {
    background: rgba(0, 119, 204, 0.08);
    border-color: rgba(0, 119, 204, 0.3);
    color: #0077cc;
  }

  .kb-close {
    border-color: rgba(0, 120, 200, 0.18);
    background: rgba(0, 119, 204, 0.05);
  }
}
</style>
