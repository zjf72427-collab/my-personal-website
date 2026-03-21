<template>
  <div class="side-nav" :class="{ visible: showNav }">
    <div
      v-for="item in sections"
      :key="item.id"
      class="sn-dot"
      :class="{ active: activeId === item.id }"
      @click="scrollTo(item.id)"
      :title="item.label"
    >
      <span class="sn-label">{{ item.label }}</span>
      <span class="sn-pip"></span>
    </div>
  </div>

  <!-- Keyboard shortcut overlay -->
  <Transition name="kb-fade">
    <div v-if="showKb" class="kb-overlay" @click.self="showKb = false">
      <div class="kb-panel">
        <div class="kb-title">// KEYBOARD SHORTCUTS</div>
        <div class="kb-list">
          <div v-for="s in shortcuts" :key="s.key" class="kb-row">
            <kbd class="kb-key">{{ s.key }}</kbd>
            <span class="kb-desc">{{ s.desc }}</span>
          </div>
        </div>
        <div class="kb-close" @click="showKb = false">[ ESC ] 关闭</div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const sections = [
  { id: 'hero',      label: 'HOME' },
  { id: 'about',     label: 'ABOUT' },
  { id: 'skills',    label: 'SKILLS' },
  { id: 'contest',   label: 'PROJECT' },
  { id: 'geek',      label: 'GEEK' },
  { id: 'lab',       label: 'LAB' },
  { id: 'garden',    label: 'GARDEN' },
  { id: 'posts',     label: 'BLOG' },
  { id: 'guestbook', label: 'GUESTBOOK' },
  { id: 'contact',   label: 'CONTACT' },
]

const shortcuts = [
  { key: 'G', desc: '跳转到极客空间' },
  { key: 'L', desc: '跳转到硬核实验室' },
  { key: 'D', desc: '跳转到数字花园' },
  { key: 'B', desc: '跳转到博客' },
  { key: 'C', desc: '跳转到联系' },
  { key: '/', desc: '聚焦数字花园搜索' },
  { key: '`', desc: '聚焦终端输入' },
  { key: 'T', desc: '切换主题' },
  { key: '?', desc: '显示快捷键帮助' },
  { key: 'Esc', desc: '关闭弹窗' },
]

const activeId = ref('')
const showNav = ref(false)
const showKb = ref(false)

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onScroll() {
  const scrolled = window.scrollY > 100
  showNav.value = scrolled
  let current = ''
  for (const s of sections) {
    const el = document.getElementById(s.id)
    if (el && el.getBoundingClientRect().top <= 160) current = s.id
  }
  activeId.value = current
}

function onKeydown(e: KeyboardEvent) {
  const tag = (e.target as HTMLElement).tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA') return

  const key = e.key
  if (key === 'Escape') { showKb.value = false; return }
  if (key === '?') { e.preventDefault(); showKb.value = !showKb.value; return }

  const map: Record<string, string> = {
    g: 'geek', G: 'geek',
    l: 'lab',  L: 'lab',
    d: 'garden', D: 'garden',
    b: 'posts',  B: 'posts',
    c: 'contact', C: 'contact',
  }
  if (map[key]) { scrollTo(map[key]); return }

  if (key === '/') {
    e.preventDefault()
    const input = document.querySelector('#garden .gs-input') as HTMLInputElement
    input?.focus()
    input?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }
  if (key === '`') {
    e.preventDefault()
    const input = document.querySelector('#lab .iterm-real-input') as HTMLInputElement
    input?.focus()
    input?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }
  if (key === 't' || key === 'T') {
    const btn = document.querySelector('.theme-toggle') as HTMLButtonElement
    btn?.click()
  }
}

onMounted(() => {
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
  position: fixed; right: 20px; top: 50%; transform: translateY(-50%);
  z-index: 50; display: flex; flex-direction: column; gap: 10px;
  opacity: 0; pointer-events: none; transition: opacity .3s;
  &.visible { opacity: 1; pointer-events: auto; }
  @media (max-width: 900px) { display: none; }
}
.sn-dot {
  display: flex; align-items: center; gap: 8px; cursor: pointer;
  justify-content: flex-end;
  &:hover .sn-label, &.active .sn-label { opacity: 1; transform: translateX(0); }
  &:hover .sn-pip, &.active .sn-pip {
    background: #00f5ff;
    box-shadow: 0 0 6px #00f5ff;
    transform: scale(1.4);
  }
}
.sn-label {
  font-family: 'Orbitron', monospace; font-size: .5rem;
  color: #00f5ff; letter-spacing: 2px;
  opacity: 0; transform: translateX(8px);
  transition: opacity .2s, transform .2s;
  white-space: nowrap;
}
.sn-pip {
  width: 6px; height: 6px; border-radius: 50%;
  background: rgba(0,245,255,.3); border: 1px solid rgba(0,245,255,.4);
  transition: background .2s, box-shadow .2s, transform .2s;
  flex-shrink: 0;
}
.active .sn-pip {
  background: #00f5ff;
  box-shadow: 0 0 6px #00f5ff;
  transform: scale(1.3);
}

// Keyboard overlay
.kb-overlay {
  position: fixed; inset: 0; z-index: 9000;
  background: rgba(2,4,8,.85); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
}
.kb-panel {
  background: #0a1520; border: 1px solid rgba(0,245,255,.2);
  padding: 32px 40px; min-width: 320px;
  box-shadow: 0 0 40px rgba(0,245,255,.1);
}
.kb-title {
  font-family: 'Orbitron', monospace; font-size: .72rem;
  color: #00f5ff; letter-spacing: 4px; margin-bottom: 24px;
}
.kb-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
.kb-row { display: flex; align-items: center; gap: 16px; }
kbd.kb-key {
  font-family: monospace; font-size: .72rem;
  background: rgba(0,245,255,.08); border: 1px solid rgba(0,245,255,.3);
  color: #00f5ff; padding: 3px 10px; min-width: 32px; text-align: center;
  border-radius: 2px;
}
.kb-desc { font-size: .78rem; color: #8aaac8; }
.kb-close {
  font-family: monospace; font-size: .65rem;
  color: rgba(138,170,200,.4); letter-spacing: 2px;
  cursor: pointer; text-align: center;
  &:hover { color: #00f5ff; }
}

.kb-fade-enter-active, .kb-fade-leave-active { transition: opacity .2s; }
.kb-fade-enter-from, .kb-fade-leave-to { opacity: 0; }
</style>
