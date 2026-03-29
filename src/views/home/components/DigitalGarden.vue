<template>
  <section id="garden" class="w">
    <a id="kb"></a>
    <div class="sh rv">
      <span class="snum">04</span>
      <h2 class="stit">DIGITAL GARDEN</h2>
      <div class="sl2"></div>
    </div>
    <p class="garden-lead rv">// 本地长期笔记与公开文章合流，支持搜索、内容过滤、目录导航与阅读进度。</p>

    <div class="garden-search rv">
      <span class="gs-icon">SEARCH</span>
      <input
        v-model="query"
        class="gs-input"
        placeholder="搜索笔记、关键词或文章标题..."
        spellcheck="false"
        aria-label="搜索数字花园内容"
      />
      <button v-if="query" type="button" class="gs-clear" aria-label="清空搜索" @click.stop="query = ''">CLEAR</button>
    </div>

    <div class="garden-filters rv">
      <button
        v-for="filter in typeFilters"
        :key="filter.value"
        type="button"
        class="filter-chip"
        :class="{ active: activeFilter === filter.value }"
        @click.stop="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <div v-if="query && searchResults.length === 0" class="gs-empty">
      // 没有找到和 <span>{{ query }}</span> 相关的内容。
    </div>

    <div v-if="query && searchResults.length > 0" class="gs-results">
      <button
        v-for="result in searchResults"
        :key="`${result.catId}-${result.index}`"
        type="button"
        class="gs-result"
        :aria-label="`打开 ${result.catName}`"
        @click.stop="openCat(result.catId, result.headingId)"
      >
        <span class="gs-cat-icon">{{ result.catIcon }}</span>
        <div class="gs-result-body">
          <div class="gs-cat-name">{{ result.catName }}</div>
          <div class="gs-snippet" v-html="result.snippet"></div>
        </div>
      </button>
    </div>

    <div v-if="loadError" class="garden-tip rv">// 动态文章暂时不可用，当前显示本地 Markdown 笔记。</div>

    <div v-show="!query" class="accordion">
      <div
        v-for="cat in filteredCategories"
        :id="cat.id"
        :key="cat.id"
        class="acc-item rv"
        :class="{ active: cat.open, focused: activeCategoryId === cat.id }"
      >
        <button type="button" class="acc-header" :aria-expanded="cat.open" @click="toggle(cat)">
          <div class="acc-left">
            <span class="acc-icon">{{ cat.icon }}</span>
            <div class="acc-meta">
              <span class="acc-name">{{ cat.name }}</span>
              <span class="acc-sub">{{ cat.sub }}</span>
            </div>
          </div>
          <div class="acc-right">
            <span class="acc-file">{{ cat.file }}</span>
            <span class="acc-chevron" :class="{ open: cat.open }">></span>
          </div>
        </button>

        <transition name="acc-slide">
          <div v-if="cat.open" class="acc-body">
            <div class="acc-body-inner">
              <div v-if="cat.loading" class="acc-loading">正在加载笔记内容...</div>
              <div v-else class="acc-layout">
                <aside v-if="cat.headings.length > 0" class="toc-card">
                  <div class="toc-top">
                    <span class="toc-kicker">ON THIS PAGE</span>
                    <span class="toc-progress">{{ cat.id === activeCategoryId ? `${readingProgress}%` : '0%' }}</span>
                  </div>
                  <div class="toc-bar">
                    <span class="toc-bar-inner" :style="{ width: `${cat.id === activeCategoryId ? readingProgress : 0}%` }"></span>
                  </div>
                  <button
                    v-for="heading in cat.headings"
                    :key="heading.id"
                    type="button"
                    class="toc-link"
                    :class="[`level-${heading.level}`, { active: activeHeadingId === heading.id }]"
                    @click.stop="scrollToHeading(cat.id, heading.id)"
                  >
                    {{ heading.text }}
                  </button>
                </aside>

                <div class="article-shell">
                  <div v-if="cat.id === activeCategoryId" class="read-progress">
                    <span>READING PROGRESS</span>
                    <strong>{{ readingProgress }}%</strong>
                  </div>
                  <div :id="`${cat.id}-content`" class="md-render" v-html="cat.html"></div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import { siteApi } from '@/api/site'
import { renderMarkdownDocument, type MarkdownHeading } from '../composables/useMarkdown'

import commRaw from '../content/communication-circuit.md?raw'
import cvRaw from '../content/cv-paper-01.md?raw'
import algoRaw from '../content/algorithms.md?raw'

type CategoryType = 'local' | 'article'

interface Category {
  id: string
  apiId?: number
  icon: string
  name: string
  sub: string
  file: string
  open: boolean
  html: string
  rawContent: string
  headings: MarkdownHeading[]
  type: CategoryType
  fromApi?: boolean
  loading?: boolean
}

interface SearchResult {
  catId: string
  catIcon: string
  catName: string
  snippet: string
  index: number
  headingId?: string
}

const typeFilters = [
  { label: 'ALL', value: 'all' },
  { label: 'LOCAL NOTES', value: 'local' },
  { label: 'PUBLIC ARTICLES', value: 'article' }
] as const

function createRenderedCategory(raw: string, prefix: string) {
  return renderMarkdownDocument(raw, prefix)
}

const commDocument = createRenderedCategory(commRaw, 'circuits')
const cvDocument = createRenderedCategory(cvRaw, 'cv-papers')
const algoDocument = createRenderedCategory(algoRaw, 'algorithms')

const localCategories: Category[] = [
  {
    id: 'circuits',
    icon: 'EE',
    name: '通信电子线路',
    sub: '滤波器、调制链路与基础电路设计',
    file: 'communication-circuit.md',
    open: false,
    html: commDocument.html,
    rawContent: commRaw,
    headings: commDocument.headings,
    type: 'local'
  },
  {
    id: 'cv-papers',
    icon: 'CV',
    name: '计算机视觉论文',
    sub: 'CV 论文阅读、方法拆解与实验记录',
    file: 'cv-paper-01.md',
    open: false,
    html: cvDocument.html,
    rawContent: cvRaw,
    headings: cvDocument.headings,
    type: 'local'
  },
  {
    id: 'algorithms',
    icon: 'ALG',
    name: '算法与底层实现',
    sub: '吉普车问题、希尔排序、归并排序、快速排序等笔记',
    file: 'algorithms.md',
    open: false,
    html: algoDocument.html,
    rawContent: algoRaw,
    headings: algoDocument.headings,
    type: 'local'
  }
]

const categories = reactive<Category[]>([...localCategories])
const query = ref('')
const activeFilter = ref<'all' | CategoryType>('all')
const loadError = ref(false)
const activeCategoryId = ref('')
const activeHeadingId = ref('')
const readingProgress = ref(0)

function safeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildSnippet(line: string, keyword: string) {
  const plain = line.replace(/^#+\s*/, '').replace(/[*`_]/g, '').trim()
  return plain.replace(new RegExp(`(${safeRegExp(keyword)})`, 'gi'), '<mark>$1</mark>')
}

function resolveCategoryIcon(category: string) {
  const normalized = category.toLowerCase()
  if (normalized.includes('cv') || category.includes('视觉')) return 'CV'
  if (category.includes('算法') || category.includes('底层')) return 'ALG'
  if (category.includes('通信') || category.includes('电路')) return 'EE'
  if (category.includes('网络')) return 'NET'
  return 'NOTE'
}

const filteredCategories = computed(() => {
  if (activeFilter.value === 'all') return categories
  return categories.filter((cat) => cat.type === activeFilter.value)
})

const searchResults = computed<SearchResult[]>(() => {
  const keyword = query.value.trim().toLowerCase()
  if (!keyword) return []

  const results: SearchResult[] = []

  filteredCategories.value.forEach((cat) => {
    cat.rawContent.split('\n').forEach((line, index) => {
      if (!line.toLowerCase().includes(keyword)) return

      const heading = cat.headings.find((item) => item.text.toLowerCase().includes(keyword))

      results.push({
        catId: cat.id,
        catIcon: cat.icon,
        catName: cat.name,
        snippet: buildSnippet(line, keyword),
        index,
        headingId: heading?.id
      })
    })
  })

  return results.slice(0, 12)
})

async function fetchContent(cat: Category) {
  if (!cat.fromApi || !cat.apiId || cat.loading || cat.html) return

  cat.loading = true

  try {
    const article = await siteApi.getArticle(cat.apiId)
    const rendered = renderMarkdownDocument(article.content, cat.id)
    cat.rawContent = article.content
    cat.html = rendered.html
    cat.headings = rendered.headings
    cat.file = `Article #${article.id}`
  } finally {
    cat.loading = false
  }
}

function setActiveCategory(id: string) {
  activeCategoryId.value = id
  activeHeadingId.value = ''
  readingProgress.value = 0
}

function updateReadingProgress() {
  if (!activeCategoryId.value) return

  const container = document.getElementById(`${activeCategoryId.value}-content`)
  if (!container) return

  const rect = container.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const total = Math.max(container.offsetHeight - viewportHeight * 0.35, 1)
  const progressed = Math.min(Math.max(viewportHeight * 0.4 - rect.top, 0), total)
  readingProgress.value = Math.round((progressed / total) * 100)

  let currentHeading = ''
  container.querySelectorAll<HTMLElement>('h1[id], h2[id], h3[id]').forEach((heading) => {
    const headingRect = heading.getBoundingClientRect()
    if (headingRect.top <= 140) {
      currentHeading = heading.id
    }
  })
  activeHeadingId.value = currentHeading
}

async function toggle(cat: Category) {
  if (cat.fromApi && !cat.open) {
    await fetchContent(cat)
  }

  cat.open = !cat.open
  if (cat.open) {
    setActiveCategory(cat.id)
    await nextTick()
    updateReadingProgress()
  } else if (activeCategoryId.value === cat.id) {
    activeCategoryId.value = ''
    activeHeadingId.value = ''
    readingProgress.value = 0
  }
}

function scrollToCategory(id: string) {
  nextTick(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

function scrollToHeading(catId: string, headingId: string) {
  activeCategoryId.value = catId
  activeHeadingId.value = headingId
  nextTick(() => {
    document.getElementById(headingId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

async function openCat(id: string, headingId?: string) {
  query.value = ''
  const target = categories.find((cat) => cat.id === id)
  if (!target) return

  if (!target.open) {
    await toggle(target)
  } else {
    setActiveCategory(target.id)
  }

  scrollToCategory(id)

  if (headingId) {
    window.setTimeout(() => {
      scrollToHeading(id, headingId)
    }, 260)
  }
}

async function loadApiArticles() {
  loadError.value = false

  try {
    const articles = await siteApi.getArticles({
      limit: 12
    })

    articles.forEach((item) => {
      const id = `article-${item.id}`
      if (categories.some((cat) => cat.id === id)) return

      categories.push({
        id,
        apiId: item.id,
        icon: resolveCategoryIcon(item.category),
        name: item.title,
        sub: `${item.category} / ${new Date(item.publishedAt || item.createdAt).toLocaleDateString('zh-CN')}`,
        file: `Article #${item.id}`,
        open: false,
        html: '',
        rawContent: [item.title, item.category, item.summary].filter(Boolean).join('\n'),
        headings: [],
        type: 'article',
        fromApi: true,
        loading: false
      })
    })
  } catch {
    loadError.value = true
  }
}

function openByHash() {
  const hash = window.location.hash.replace(/^#/, '')
  if (!hash) return
  const target = categories.find((cat) => cat.id === hash)
  if (!target) return
  void openCat(hash)
}

onMounted(async () => {
  await loadApiArticles()
  openByHash()

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('on')
        }
      })
    },
    { threshold: 0.1 }
  )

  document.querySelectorAll('#garden .rv').forEach((element) => observer.observe(element))
  window.addEventListener('hashchange', openByHash)
  window.addEventListener('scroll', updateReadingProgress, { passive: true })
  window.addEventListener('resize', updateReadingProgress)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', openByHash)
  window.removeEventListener('scroll', updateReadingProgress)
  window.removeEventListener('resize', updateReadingProgress)
})
</script>

<style lang="scss" scoped>
.garden-lead {
  font-family: 'Orbitron', monospace;
  font-size: 0.68rem;
  color: #00f5ff;
  letter-spacing: 2px;
  opacity: 0.6;
  margin-bottom: 24px;
}

.garden-search {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(0, 245, 255, 0.15);
  background: #0a1520;
  padding: 10px 16px;
  margin-bottom: 14px;
  transition: border-color 0.15s;

  &:focus-within {
    border-color: rgba(0, 245, 255, 0.5);
    box-shadow: 0 0 12px rgba(0, 245, 255, 0.08);
  }
}

.garden-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.filter-chip {
  border: 1px solid rgba(0, 245, 255, 0.16);
  background: rgba(0, 245, 255, 0.04);
  color: #8aaac8;
  font-family: 'Orbitron', monospace;
  font-size: 0.62rem;
  letter-spacing: 1.4px;
  padding: 7px 12px;
  cursor: pointer;
  transition: 0.18s ease;

  &.active,
  &:hover,
  &:focus-visible {
    color: #00f5ff;
    border-color: rgba(0, 245, 255, 0.45);
    background: rgba(0, 245, 255, 0.1);
    outline: none;
  }
}

.gs-icon {
  font-size: 0.6rem;
  letter-spacing: 1.4px;
  color: rgba(0, 245, 255, 0.6);
  flex-shrink: 0;
}

.gs-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: #eaf4ff;
  font-family: monospace;
  font-size: 0.82rem;
  letter-spacing: 1px;

  &::placeholder {
    color: rgba(138, 170, 200, 0.35);
  }
}

.gs-clear {
  border: none;
  background: none;
  color: rgba(0, 245, 255, 0.75);
  cursor: pointer;
  font-size: 0.6rem;
  letter-spacing: 1.4px;
  line-height: 1;

  &:hover,
  &:focus-visible {
    color: #ff006e;
    outline: none;
  }
}

.gs-empty {
  font-family: monospace;
  font-size: 0.75rem;
  color: rgba(138, 170, 200, 0.5);
  letter-spacing: 1px;
  padding: 20px 0;

  span {
    color: #00f5ff;
  }
}

.garden-tip {
  font-family: monospace;
  font-size: 0.7rem;
  color: rgba(255, 0, 110, 0.8);
  letter-spacing: 1px;
  margin-bottom: 14px;
}

.gs-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.gs-result {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 12px 16px;
  border: 1px solid rgba(0, 245, 255, 0.1);
  background: #0a1520;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  text-align: left;

  &:hover,
  &:focus-visible {
    border-color: rgba(0, 245, 255, 0.4);
    background: #0d1e30;
    outline: none;
  }
}

.gs-cat-icon {
  min-width: 40px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 245, 255, 0.18);
  color: #00f5ff;
  font-family: 'Orbitron', monospace;
  font-size: 0.6rem;
  letter-spacing: 1px;
  flex-shrink: 0;
  margin-top: 1px;
}

.gs-result-body {
  flex: 1;
  min-width: 0;
}

.gs-cat-name,
.toc-kicker,
.read-progress span {
  font-family: 'Orbitron', monospace;
}

.gs-cat-name {
  font-size: 0.62rem;
  color: #00f5ff;
  letter-spacing: 2px;
  margin-bottom: 5px;
}

.gs-snippet {
  font-size: 0.78rem;
  color: #8aaac8;
  line-height: 1.6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  :deep(mark) {
    background: rgba(0, 245, 255, 0.2);
    color: #00f5ff;
    padding: 0 2px;
    border-radius: 2px;
  }
}

.accordion {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.acc-item {
  border: 1px solid rgba(0, 245, 255, 0.12);
  transition: border-color 0.2s, box-shadow 0.2s;

  &.active,
  &.focused {
    border-color: rgba(0, 245, 255, 0.35);
    box-shadow: 0 0 20px rgba(0, 245, 255, 0.06);
  }
}

.acc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  cursor: pointer;
  user-select: none;
  width: 100%;
  background: none;
  border: none;
  text-align: left;

  &:hover .acc-name,
  &:focus-visible .acc-name {
    color: #00f5ff;
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 1px rgba(0, 245, 255, 0.28);
  }
}

.acc-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.acc-icon {
  min-width: 44px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 245, 255, 0.2);
  font-family: 'Orbitron', monospace;
  font-size: 0.64rem;
  color: #00f5ff;
}

.acc-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.acc-name {
  font-family: 'Orbitron', monospace;
  font-size: 0.8rem;
  color: #eaf4ff;
  letter-spacing: 2px;
  transition: color 0.15s;
}

.acc-sub {
  font-size: 0.65rem;
  color: #8aaac8;
  letter-spacing: 1px;
}

.acc-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.acc-file {
  font-family: monospace;
  font-size: 0.62rem;
  color: rgba(0, 245, 255, 0.35);
}

.acc-chevron {
  font-size: 1rem;
  color: #00f5ff;
  line-height: 1;
  transition: transform 0.3s ease;
  display: inline-block;

  &.open {
    transform: rotate(90deg);
  }
}

.acc-slide-enter-active {
  transition: max-height 0.4s ease, opacity 0.3s;
}

.acc-slide-leave-active {
  transition: max-height 0.3s ease, opacity 0.2s;
}

.acc-slide-enter-from,
.acc-slide-leave-to {
  max-height: 0 !important;
  opacity: 0;
}

.acc-slide-enter-to,
.acc-slide-leave-from {
  max-height: 6000px;
  opacity: 1;
}

.acc-body {
  overflow: hidden;
}

.acc-body-inner {
  padding: 8px 32px 32px;
  border-top: 1px solid rgba(0, 245, 255, 0.06);
}

.acc-loading {
  font-family: monospace;
  color: #8aaac8;
  padding-top: 6px;
}

.acc-layout {
  display: grid;
  grid-template-columns: minmax(220px, 260px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.toc-card {
  position: sticky;
  top: 92px;
  padding: 16px;
  background: rgba(6, 17, 30, 0.82);
  border: 1px solid rgba(0, 245, 255, 0.1);
}

.toc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.toc-kicker {
  font-size: 0.6rem;
  color: #00f5ff;
  letter-spacing: 2px;
}

.toc-progress {
  font-size: 0.68rem;
  color: #8aaac8;
}

.toc-bar {
  height: 5px;
  background: rgba(0, 245, 255, 0.08);
  margin: 12px 0 14px;
  overflow: hidden;
}

.toc-bar-inner {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #00f5ff, #00ff88);
}

.toc-link {
  display: block;
  width: 100%;
  text-align: left;
  border: none;
  background: none;
  color: rgba(138, 170, 200, 0.88);
  font-size: 0.74rem;
  line-height: 1.5;
  padding: 7px 0;
  cursor: pointer;

  &.level-2 {
    padding-left: 10px;
  }

  &.level-3 {
    padding-left: 20px;
  }

  &.active,
  &:hover,
  &:focus-visible {
    color: #00f5ff;
    outline: none;
  }
}

.read-progress {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding: 10px 12px;
  border: 1px solid rgba(0, 245, 255, 0.12);
  background: rgba(10, 21, 32, 0.6);

  span {
    font-size: 0.62rem;
    color: #00f5ff;
    letter-spacing: 1.6px;
  }

  strong {
    font-size: 0.9rem;
    color: #eaf4ff;
  }
}

.md-render {
  color: #c5d8ee;
  font-size: 0.85rem;
  line-height: 1.95;

  :deep(h1) {
    font-family: 'Orbitron', monospace;
    font-size: 1.1rem;
    color: #eaf4ff;
    margin: 28px 0 6px;
    letter-spacing: 2px;
    border-bottom: 1px solid rgba(0, 245, 255, 0.12);
    padding-bottom: 8px;
    scroll-margin-top: 110px;
  }

  :deep(h2) {
    font-size: 0.95rem;
    color: #00f5ff;
    margin: 24px 0 10px;
    letter-spacing: 1px;
    font-weight: 700;
    scroll-margin-top: 110px;
  }

  :deep(h3) {
    font-size: 0.85rem;
    color: #eaf4ff;
    margin: 18px 0 8px;
    font-weight: 600;
    scroll-margin-top: 110px;
  }

  :deep(p) {
    margin: 0 0 12px;
  }

  :deep(strong) {
    color: #eaf4ff;
  }

  :deep(em) {
    color: #00f5ff;
    font-style: italic;
  }

  :deep(blockquote) {
    margin: 12px 0;
    padding: 10px 16px;
    border-left: 3px solid rgba(0, 245, 255, 0.4);
    background: rgba(0, 245, 255, 0.03);
    color: #8aaac8;
    font-size: 0.82rem;
  }

  :deep(hr) {
    border: none;
    border-top: 1px solid rgba(0, 245, 255, 0.1);
    margin: 24px 0;
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    font-size: 0.78rem;
  }

  :deep(th) {
    background: rgba(0, 245, 255, 0.08);
    color: #00f5ff;
    padding: 8px 12px;
    border: 1px solid rgba(0, 245, 255, 0.15);
    font-family: 'Orbitron', monospace;
    font-size: 0.65rem;
    letter-spacing: 1px;
  }

  :deep(td) {
    padding: 7px 12px;
    color: #8aaac8;
    border: 1px solid rgba(0, 245, 255, 0.08);
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 20px;
    margin: 8px 0 12px;
  }

  :deep(li) {
    margin: 4px 0;
    color: #8aaac8;
  }

  :deep(code:not(.hljs)) {
    background: rgba(0, 245, 255, 0.08);
    color: #00ff88;
    padding: 1px 6px;
    font-family: 'Courier New', monospace;
    font-size: 0.82em;
    border-radius: 2px;
  }

  :deep(.hljs-pre) {
    background: #020a04;
    border: 1px solid rgba(0, 255, 136, 0.15);
    border-left: 3px solid #00ff88;
    margin: 14px 0;
    overflow-x: auto;
  }

  :deep(.hljs) {
    background: transparent;
    padding: 14px 18px;
    font-family: 'Courier New', Consolas, monospace;
    font-size: 0.78rem;
    line-height: 1.7;
    display: block;
  }
}

@media (max-width: 980px) {
  .acc-layout {
    grid-template-columns: 1fr;
  }

  .toc-card {
    position: static;
  }
}

:global(:root[data-theme='light']) {
  .garden-lead,
  .gs-cat-name,
  .toc-kicker,
  .read-progress span {
    color: #0077cc;
  }

  .garden-search,
  .gs-result,
  .toc-card,
  .read-progress,
  .acc-item {
    background: #ffffff;
    border-color: rgba(0, 120, 200, 0.12);
  }

  .acc-item.active,
  .acc-item.focused {
    border-color: #0077cc;
    box-shadow: 0 0 16px rgba(0, 119, 204, 0.08);
  }

  .filter-chip {
    color: #4a5568;
    border-color: rgba(0, 120, 200, 0.16);
  }

  .filter-chip.active,
  .filter-chip:hover,
  .filter-chip:focus-visible {
    color: #0077cc;
    border-color: rgba(0, 120, 200, 0.4);
    background: rgba(0, 120, 200, 0.08);
  }

  .gs-input,
  .acc-name,
  .read-progress strong {
    color: #1a2332;
  }

  .acc-sub,
  .md-render,
  .garden-tip,
  .gs-snippet,
  .toc-link,
  .toc-progress {
    color: #4a5568;
  }

  .acc-file {
    color: rgba(0, 119, 204, 0.4);
  }

  .acc-chevron,
  .acc-icon,
  .gs-cat-icon {
    color: #0077cc;
    border-color: rgba(0, 120, 200, 0.2);
  }

  .acc-body-inner {
    border-top-color: rgba(0, 120, 200, 0.08);
  }

  .md-render {
    :deep(h1) {
      color: #1a2332;
      border-bottom-color: rgba(0, 120, 200, 0.15);
    }

    :deep(h2) {
      color: #0077cc;
    }

    :deep(h3),
    :deep(strong) {
      color: #1a2332;
    }

    :deep(em) {
      color: #0077cc;
    }

    :deep(blockquote) {
      border-left-color: #0077cc;
      background: rgba(0, 119, 204, 0.04);
      color: #4a5568;
    }

    :deep(hr) {
      border-top-color: rgba(0, 120, 200, 0.1);
    }

    :deep(th) {
      background: rgba(0, 119, 204, 0.06);
      color: #0077cc;
      border-color: rgba(0, 120, 200, 0.2);
    }

    :deep(td),
    :deep(li) {
      color: #4a5568;
      border-color: rgba(0, 120, 200, 0.1);
    }

    :deep(code:not(.hljs)) {
      background: rgba(0, 119, 204, 0.08);
      color: #276749;
    }

    :deep(.hljs-pre) {
      background: #f7fafc;
      border-color: rgba(45, 138, 78, 0.2);
    }
  }
}
</style>
