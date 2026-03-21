<template>
  <section id="garden" class="w"><a id="kb"></a>
    <div class="sh rv"><span class="snum">04</span><h2 class="stit">DIGITAL GARDEN</h2><div class="sl2"></div></div>
    <p class="garden-lead rv">// 持续生长的知识库 — Markdown 驱动，笔记即内容</p>

    <div class="garden-search rv">
      <span class="gs-icon">⌕</span>
      <input v-model="query" class="gs-input" placeholder="搜索笔记内容..." spellcheck="false" />
      <span v-if="query" class="gs-clear" @click="query = ''">×</span>
    </div>
    <div v-if="query && searchResults.length === 0" class="gs-empty">
      // 没有找到信号 — <span>{{ query }}</span>
    </div>
    <div v-if="query && searchResults.length > 0" class="gs-results">
      <div v-for="r in searchResults" :key="r.catId + r.index" class="gs-result" @click="openCat(r.catId)">
        <span class="gs-cat-icon">{{ r.catIcon }}</span>
        <div class="gs-result-body">
          <div class="gs-cat-name">{{ r.catName }}</div>
          <div class="gs-snippet" v-html="r.snippet"></div>
        </div>
      </div>
    </div>

    <div v-show="!query" class="accordion">
      <div v-for="cat in categories" :key="cat.id" class="acc-item rv" :class="{ active: cat.open }">
        <div class="acc-header" @click="toggle(cat)">
          <div class="acc-left">
            <span class="acc-icon">{{ cat.icon }}</span>
            <div class="acc-meta">
              <span class="acc-name">{{ cat.name }}</span>
              <span class="acc-sub">{{ cat.sub }}</span>
            </div>
          </div>
          <div class="acc-right">
            <span class="acc-file">{{ cat.file }}</span>
            <span class="acc-chevron" :class="{ open: cat.open }">›</span>
          </div>
        </div>

        <transition name="acc-slide">
          <div v-if="cat.open" class="acc-body">
            <div class="acc-body-inner">
              <div class="md-render" v-html="cat.html"></div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </section>

</template>

<script setup lang="ts">
import { renderMarkdown } from '../composables/useMarkdown'

// 本地 .md 文件作为兜底（离线可用）
import commRaw from '../content/communication-circuit.md?raw'
import cvRaw from '../content/cv-paper-01.md?raw'
import algoRaw from '../content/algorithms.md?raw'

const API = 'http://localhost:3008'

interface Category {
  id: string
  icon: string
  name: string
  sub: string
  file: string
  open: boolean
  html: string
  fromApi?: boolean
}

function toggle(cat: Category) {
  // 从 API 加载的条目，展开时再拉取完整内容
  if (cat.fromApi && cat.open === false && !cat.html) {
    fetchContent(cat)
  }
  cat.open = !cat.open
}

async function fetchContent(cat: Category) {
  try {
    const r = await fetch(`${API}/api/articles/${cat.id}`)
    if (!r.ok) return
    const data = await r.json()
    cat.html = renderMarkdown(data.content)
    cat.file = `DB #${data.id}`
  } catch {}
}

const query = ref('')

interface SearchResult {
  catId: string
  catIcon: string
  catName: string
  snippet: string
  index: number
}

// 本地静态文件 rawMap（用于搜索兜底）
const rawMap: Record<string, string> = {
  comm: commRaw,
  cv: cvRaw,
  algo: algoRaw,
}

const searchResults = computed<SearchResult[]>(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  const results: SearchResult[] = []
  categories.forEach(cat => {
    const raw = rawMap[cat.id] || ''
    const lines = raw.split('\n')
    lines.forEach((line, idx) => {
      if (line.toLowerCase().includes(q)) {
        const plain = line.replace(/^#+\s*/, '').replace(/[*`_]/g, '')
        const hi = plain.replace(
          new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
          '<mark>$1</mark>'
        )
        results.push({ catId: cat.id, catIcon: cat.icon, catName: cat.name, snippet: hi, index: idx })
      }
    })
  })
  return results.slice(0, 12)
})

function openCat(id: string) {
  query.value = ''
  const cat = categories.find(c => c.id === id)
  if (cat) cat.open = true
  nextTick(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

// 内置静态分类（本地 .md 驱动，始终可用）
const staticCategories: Category[] = [
  {
    id: 'comm', icon: '📡', name: '通信电子线路',
    sub: '高频电路 · 调制解调 · 振荡器', file: 'communication-circuit.md',
    open: false, html: renderMarkdown(commRaw),
  },
  {
    id: 'cv', icon: '👁️', name: '计算机视觉 · 论文摘要',
    sub: 'Transformer · 分割 · 多模态', file: 'cv-paper-01.md',
    open: false, html: renderMarkdown(cvRaw),
  },
  {
    id: 'algo', icon: '⚙️', name: '核心算法库',
    sub: '排序 · 动态规划 · 贪心', file: 'algorithms.md',
    open: false, html: renderMarkdown(algoRaw),
  },
]

const categories = reactive<Category[]>([...staticCategories])

// 从 API 加载笔记，追加到列表（不重复）
async function loadApiArticles() {
  try {
    const r = await fetch(`${API}/api/articles`)
    if (!r.ok) return
    const list: { id: number; title: string; category: string; createdAt: string }[] = await r.json()
    const CATEGORY_ICONS: Record<string, string> = {
      '通信电子线路': '📡', 'CV论文': '👁️', '底层算法': '⚙️',
      '网络工程': '🌐', '杂记': '📝',
    }
    for (const item of list) {
      const existsId = `api-${item.id}`
      if (categories.find(c => c.id === existsId)) continue
      categories.push({
        id: existsId,
        icon: CATEGORY_ICONS[item.category] || '📄',
        name: item.title,
        sub: `${item.category} · ${new Date(item.createdAt).toLocaleDateString('zh-CN')}`,
        file: `DB #${item.id}`,
        open: false,
        html: '', // 懒加载：展开时再拉取
        fromApi: true,
      })
    }
  } catch {
    // 后端未启动时静默失败，显示本地内容
  }
}

onMounted(() => {
  loadApiArticles()
  const obs = new IntersectionObserver(
    es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('on') }),
    { threshold: .1 }
  )
  document.querySelectorAll('#garden .rv').forEach(el => obs.observe(el))
})
</script>

<style lang="scss" scoped>
.garden-lead {
  font-family: 'Orbitron', monospace;
  font-size: .68rem; color: #00f5ff;
  letter-spacing: 3px; opacity: .6; margin-bottom: 24px;
}

// Search
.garden-search {
  display: flex; align-items: center; gap: 10px;
  border: 1px solid rgba(0,245,255,.15); background: #0a1520;
  padding: 10px 16px; margin-bottom: 20px;
  transition: border-color .15s;
  &:focus-within { border-color: rgba(0,245,255,.5); box-shadow: 0 0 12px rgba(0,245,255,.08); }
}
.gs-icon { font-size: 1.1rem; color: rgba(0,245,255,.4); flex-shrink: 0; }
.gs-input {
  flex: 1; background: none; border: none; outline: none;
  color: #eaf4ff; font-family: monospace; font-size: .82rem; letter-spacing: 1px;
  &::placeholder { color: rgba(138,170,200,.35); }
}
.gs-clear {
  color: rgba(0,245,255,.4); cursor: pointer; font-size: 1.1rem; line-height: 1;
  &:hover { color: #ff006e; }
}
.gs-empty {
  font-family: monospace; font-size: .75rem; color: rgba(138,170,200,.5);
  letter-spacing: 2px; padding: 20px 0;
  span { color: #00f5ff; }
}
.gs-results {
  display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px;
}
.gs-result {
  display: flex; gap: 14px; align-items: flex-start;
  padding: 12px 16px; border: 1px solid rgba(0,245,255,.1);
  background: #0a1520; cursor: pointer; transition: border-color .15s, background .15s;
  &:hover { border-color: rgba(0,245,255,.4); background: #0d1e30; }
}
.gs-cat-icon { font-size: 1.2rem; flex-shrink: 0; margin-top: 1px; }
.gs-result-body { flex: 1; min-width: 0; }
.gs-cat-name {
  font-family: 'Orbitron', monospace; font-size: .62rem;
  color: #00f5ff; letter-spacing: 2px; margin-bottom: 5px;
}
.gs-snippet {
  font-size: .78rem; color: #8aaac8; line-height: 1.6;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  :deep(mark) {
    background: rgba(0,245,255,.2); color: #00f5ff;
    padding: 0 2px; border-radius: 2px;
  }
}

// Accordion shell
.accordion { display: flex; flex-direction: column; gap: 10px; }
.acc-item {
  border: 1px solid rgba(0,245,255,.12);
  transition: border-color .2s, box-shadow .2s;
  &.active {
    border-color: rgba(0,245,255,.35);
    box-shadow: 0 0 20px rgba(0,245,255,.06);
  }
}
.acc-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px; cursor: pointer; user-select: none;
  &:hover .acc-name { color: #00f5ff; }
}
.acc-left { display: flex; align-items: center; gap: 14px; }
.acc-icon { font-size: 1.3rem; }
.acc-meta { display: flex; flex-direction: column; gap: 3px; }
.acc-name {
  font-family: 'Orbitron', monospace; font-size: .8rem;
  color: #eaf4ff; letter-spacing: 2px; transition: color .15s;
}
.acc-sub { font-size: .65rem; color: #8aaac8; letter-spacing: 1px; }
.acc-right { display: flex; align-items: center; gap: 14px; }
.acc-file { font-family: monospace; font-size: .62rem; color: rgba(0,245,255,.35); }
.acc-chevron {
  font-size: 1.4rem; color: #00f5ff; line-height: 1;
  transition: transform .3s ease; display: inline-block;
  &.open { transform: rotate(90deg); }
}

// Slide transition
.acc-slide-enter-active { transition: max-height .4s ease, opacity .3s; }
.acc-slide-leave-active { transition: max-height .3s ease, opacity .2s; }
.acc-slide-enter-from, .acc-slide-leave-to { max-height: 0 !important; opacity: 0; }
.acc-slide-enter-to, .acc-slide-leave-from { max-height: 6000px; opacity: 1; }

.acc-body { overflow: hidden; }
.acc-body-inner {
  padding: 8px 32px 32px;
  border-top: 1px solid rgba(0,245,255,.06);
}

// ── Markdown rendered output ──────────────────────────────
.md-render {
  color: #c5d8ee;
  font-size: .85rem;
  line-height: 1.95;

  :deep(h1) {
    font-family: 'Orbitron', monospace;
    font-size: 1.1rem; color: #eaf4ff;
    margin: 28px 0 6px; letter-spacing: 2px;
    border-bottom: 1px solid rgba(0,245,255,.12);
    padding-bottom: 8px;
  }
  :deep(h2) {
    font-size: .95rem; color: #00f5ff;
    margin: 24px 0 10px; letter-spacing: 1px;
    font-weight: 700;
  }
  :deep(h3) {
    font-size: .85rem; color: #eaf4ff;
    margin: 18px 0 8px; font-weight: 600;
  }
  :deep(p) { margin: 0 0 12px; }
  :deep(strong) { color: #eaf4ff; }
  :deep(em) { color: #00f5ff; font-style: italic; }

  :deep(blockquote) {
    margin: 12px 0; padding: 10px 16px;
    border-left: 3px solid rgba(0,245,255,.4);
    background: rgba(0,245,255,.03);
    color: #8aaac8; font-size: .82rem;
    p { margin: 0; }
  }

  :deep(hr) {
    border: none; border-top: 1px solid rgba(0,245,255,.1);
    margin: 24px 0;
  }

  // Tables
  :deep(table) {
    width: 100%; border-collapse: collapse;
    margin: 16px 0; font-size: .78rem;
  }
  :deep(th) {
    background: rgba(0,245,255,.08);
    color: #00f5ff; padding: 8px 12px;
    border: 1px solid rgba(0,245,255,.15);
    font-family: 'Orbitron', monospace; font-size: .65rem; letter-spacing: 1px;
  }
  :deep(td) {
    padding: 7px 12px; color: #8aaac8;
    border: 1px solid rgba(0,245,255,.08);
  }
  :deep(tr:hover td) { background: rgba(0,245,255,.03); }

  // Lists
  :deep(ul), :deep(ol) {
    padding-left: 20px; margin: 8px 0 12px;
  }
  :deep(li) { margin: 4px 0; color: #8aaac8; }
  :deep(li strong) { color: #eaf4ff; }

  // Inline code
  :deep(code:not(.hljs)) {
    background: rgba(0,245,255,.08);
    color: #00ff88; padding: 1px 6px;
    font-family: 'Courier New', monospace;
    font-size: .82em; border-radius: 2px;
  }

  // Code blocks (highlight.js)
  :deep(.hljs-pre) {
    background: #020a04;
    border: 1px solid rgba(0,255,136,.15);
    border-left: 3px solid #00ff88;
    margin: 14px 0; overflow-x: auto;
  }
  :deep(.hljs) {
    background: transparent;
    padding: 14px 18px;
    font-family: 'Courier New', Consolas, monospace;
    font-size: .78rem; line-height: 1.7;
    display: block;
  }
}

// ── Light theme ──────────────────────────────────────────
:global(:root[data-theme='light']) {
  .garden-lead { color: #0077cc; }
  .acc-item { background: #ffffff; border-color: rgba(0,120,200,.12); }
  .acc-item.active { border-color: #0077cc; box-shadow: 0 0 16px rgba(0,119,204,.08); }
  .acc-name { color: #1a2332; }
  .acc-sub { color: #718096; }
  .acc-file { color: rgba(0,119,204,.4); }
  .acc-chevron { color: #0077cc; }
  .acc-body-inner { border-top-color: rgba(0,120,200,.08); }
  .md-render {
    color: #3d4f63;
    :deep(h1) { color: #1a2332; border-bottom-color: rgba(0,120,200,.15); }
    :deep(h2) { color: #0077cc; }
    :deep(h3) { color: #1a2332; }
    :deep(strong) { color: #1a2332; }
    :deep(em) { color: #0077cc; }
    :deep(blockquote) { border-left-color: #0077cc; background: rgba(0,119,204,.04); color: #4a5568; }
    :deep(hr) { border-top-color: rgba(0,120,200,.1); }
    :deep(th) { background: rgba(0,119,204,.06); color: #0077cc; border-color: rgba(0,120,200,.2); }
    :deep(td) { color: #4a5568; border-color: rgba(0,120,200,.1); }
    :deep(li) { color: #4a5568; }
    :deep(code:not(.hljs)) { background: rgba(0,119,204,.08); color: #276749; }
    :deep(.hljs-pre) { background: #f7fafc; border-color: rgba(45,138,78,.2); }
  }
}
</style>
