<template>
  <section id="posts" class="w">
    <div class="sh rv">
      <span class="snum">05</span>
      <h2 class="stit">FIELD NOTES</h2>
      <div class="sl2"></div>
    </div>
    <p class="posts-lead rv">// 接入后端检索的前台文章区，支持关键词搜索与分类筛选。</p>

    <div class="posts-controls rv">
      <div class="posts-search">
        <span class="pc-label">QUERY</span>
        <input
          v-model="searchInput"
          class="pc-input"
          type="text"
          placeholder="搜索标题、摘要、分类..."
          spellcheck="false"
          aria-label="搜索文章"
        />
        <button v-if="searchInput" type="button" class="pc-clear" @click.stop="searchInput = ''">CLEAR</button>
      </div>

      <div class="posts-filters">
        <button
          v-for="item in filterOptions"
          :key="item.value"
          type="button"
          class="filter-chip"
          :class="{ active: selectedCategory === item.value }"
          @click.stop="selectedCategory = item.value"
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <div class="posts-status rv">
      <span>{{ statusText }}</span>
      <span v-if="selectedCategory !== 'all'">分类: {{ selectedCategory }}</span>
    </div>

    <div class="pl">
      <RouterLink
        v-for="(post, index) in posts"
        :key="post.id"
        :to="{ path: '/garden', hash: `#article-${post.id}` }"
        class="pc rv"
      >
        <div class="pnum">{{ String(index + 1).padStart(2, '0') }}</div>
        <div class="pbody">
          <div class="ptit">{{ post.title }}</div>
          <div class="pmeta">{{ formatDate(post.publishedAt || post.createdAt) }} / {{ post.category }}</div>
          <div class="psummary">{{ post.summary || '暂无摘要，点击进入阅读全文。' }}</div>
        </div>
        <span class="ptag" :class="tagClass(post.category)">{{ resolveTag(post.category) }}</span>
      </RouterLink>

      <div v-if="loadError" class="posts-error rv">
        // 文章服务暂时离线，当前无法完成检索。
      </div>

      <div v-if="!loading && posts.length === 0" class="posts-empty rv">
        // 当前筛选条件下没有命中文章。
      </div>

      <RouterLink to="/garden" class="posts-cta rv">查看全部笔记</RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { siteApi, type ArticleSummary } from '@/api/site'

const filterOptions = [
  { label: 'ALL', value: 'all' },
  { label: '算法', value: '算法与底层实现' },
  { label: 'CV', value: '计算机视觉论文' },
  { label: '电路', value: '通信电子线路' },
  { label: '网络', value: '网络工程' }
]

const posts = ref<ArticleSummary[]>([])
const loading = ref(true)
const loadError = ref(false)
const searchInput = ref('')
const selectedCategory = ref('all')
let searchTimer: number | undefined

const statusText = computed(() => {
  if (loading.value) return 'SYNCING ARTICLES...'
  if (loadError.value) return 'REMOTE INDEX OFFLINE'
  if (searchInput.value.trim()) {
    return `MATCHES FOR "${searchInput.value.trim()}"`
  }
  return `PUBLIC ARTICLES / ${posts.value.length} ITEMS`
})

function tagClass(category: string) {
  if (category.includes('算法') || category.includes('底层')) return 'ta'
  if (category.toLowerCase().includes('cv') || category.includes('视觉')) return 'tp'
  if (category.includes('通信') || category.includes('电路')) return 'te'
  return 'tc'
}

function resolveTag(category: string) {
  if (category.includes('算法') || category.includes('底层')) return 'ALGO'
  if (category.toLowerCase().includes('cv') || category.includes('视觉')) return 'CV'
  if (category.includes('通信') || category.includes('电路')) return 'EE'
  return 'NOTE'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

async function loadPosts() {
  loading.value = true
  loadError.value = false

  try {
    posts.value = await siteApi.getArticles({
      search: searchInput.value.trim() || undefined,
      category: selectedCategory.value === 'all' ? undefined : selectedCategory.value,
      limit: 6
    })
  } catch {
    posts.value = []
    loadError.value = true
  } finally {
    loading.value = false
  }
}

function queueLoad() {
  window.clearTimeout(searchTimer)
  searchTimer = window.setTimeout(() => {
    void loadPosts()
  }, 240)
}

watch([searchInput, selectedCategory], queueLoad)

onMounted(() => {
  void loadPosts()

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('on')
        }
      })
    },
    { threshold: 0.15 }
  )

  document.querySelectorAll('#posts .rv').forEach((element) => observer.observe(element))
})

onBeforeUnmount(() => {
  window.clearTimeout(searchTimer)
})
</script>

<style lang="scss" scoped>
.posts-lead {
  font-family: 'Orbitron', monospace;
  font-size: 0.68rem;
  color: #00f5ff;
  letter-spacing: 3px;
  opacity: 0.6;
  margin-bottom: 24px;
}

.posts-controls {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 16px;
}

.posts-search {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #0a1520;
  border: 1px solid rgba(0, 245, 255, 0.12);

  &:focus-within {
    border-color: rgba(0, 245, 255, 0.45);
    box-shadow: 0 0 18px rgba(0, 245, 255, 0.08);
  }
}

.pc-label,
.posts-status,
.filter-chip,
.ptag,
.posts-cta {
  font-family: 'Orbitron', monospace;
}

.pc-label {
  font-size: 0.6rem;
  letter-spacing: 2px;
  color: rgba(0, 245, 255, 0.7);
}

.pc-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: #eaf4ff;
  font-size: 0.84rem;
  font-family: monospace;
}

.pc-clear {
  border: none;
  background: none;
  color: rgba(255, 0, 110, 0.82);
  font-size: 0.65rem;
  cursor: pointer;
  letter-spacing: 1px;
}

.posts-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-chip {
  border: 1px solid rgba(0, 245, 255, 0.16);
  background: rgba(0, 245, 255, 0.04);
  color: #8aaac8;
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

.posts-status {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
  font-size: 0.62rem;
  letter-spacing: 1.4px;
  color: rgba(138, 170, 200, 0.76);
}

.pl {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pc {
  background: #0a1520;
  border: 1px solid rgba(0, 245, 255, 0.07);
  padding: 22px 28px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 20px;
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
  transition: border-color 0.15s, transform 0.15s, background 0.3s;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);

  &:hover {
    border-color: rgba(0, 245, 255, 0.35);
    background: #0f1e34;
    transform: translateX(6px);

    .ptit {
      color: #00f5ff;
    }
  }

  &:focus-visible {
    outline: 2px solid #00f5ff;
    outline-offset: 3px;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, #00f5ff, #7b2fff);
    transform: scaleY(0);
    transition: 0.15s;
  }

  &:hover::before {
    transform: scaleY(1);
  }
}

.pnum {
  font-size: 1.8rem;
  font-weight: 900;
  color: rgba(0, 245, 255, 0.1);
  line-height: 1;
  min-width: 40px;
}

.pbody {
  min-width: 0;
}

.ptit {
  font-size: 0.98rem;
  font-weight: 700;
  color: #eaf4ff;
  margin-bottom: 5px;
  transition: color 0.15s;
}

.pmeta {
  font-size: 0.68rem;
  color: #8aaac8;
  letter-spacing: 1px;
  line-height: 1.6;
}

.psummary {
  margin-top: 4px;
  font-size: 0.74rem;
  color: rgba(197, 216, 238, 0.86);
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ptag {
  padding: 4px 10px;
  font-size: 0.62rem;
  letter-spacing: 2px;
  border: 1px solid;
  text-transform: uppercase;
  white-space: nowrap;
}

.tc {
  border-color: #00f5ff;
  color: #00f5ff;
}

.tp {
  border-color: #ff006e;
  color: #ff006e;
}

.ta {
  border-color: #7b2fff;
  color: #7b2fff;
}

.te {
  border-color: #ffd166;
  color: #ffd166;
}

.posts-error,
.posts-empty {
  font-family: monospace;
  font-size: 0.72rem;
  color: rgba(138, 170, 200, 0.6);
  letter-spacing: 2px;
  padding: 12px 0 4px;
}

.posts-error {
  color: rgba(255, 0, 110, 0.75);
}

.posts-cta {
  width: fit-content;
  text-decoration: none;
  color: #00f5ff;
  border: 1px solid rgba(0, 245, 255, 0.3);
  padding: 8px 12px;
  font-size: 0.68rem;
  letter-spacing: 1.5px;
  transition: border-color 0.2s, background 0.2s, transform 0.2s;

  &:hover {
    border-color: #00f5ff;
    background: rgba(0, 245, 255, 0.08);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid #00f5ff;
    outline-offset: 2px;
  }
}

@media (max-width: 768px) {
  .pc {
    grid-template-columns: 1fr;
  }

  .pnum {
    display: none;
  }
}

:global(:root[data-theme='light']) {
  .posts-lead,
  .pc-label,
  .posts-cta {
    color: #0077cc;
  }

  .posts-search,
  .pc {
    background: #ffffff;
    border-color: rgba(0, 120, 200, 0.15);
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

  .pc-input,
  .ptit {
    color: #1a2332;
  }

  .pmeta,
  .psummary,
  .posts-status {
    color: #4a5568;
  }

  .posts-cta {
    border-color: rgba(0, 120, 200, 0.3);
  }
}
</style>
