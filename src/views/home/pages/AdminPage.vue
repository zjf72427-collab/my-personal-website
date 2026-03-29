<template>
  <div class="admin-page">
    <div v-if="!unlocked" class="admin-lock">
      <div class="lock-box">
        <div class="lock-title">// ADMIN ACCESS</div>
        <input v-model="username" type="text" class="lock-input" placeholder="Username" autocomplete="username" @keydown.enter="unlock" />
        <input v-model="password" type="password" class="lock-input" placeholder="Password" autocomplete="current-password" @keydown.enter="unlock" />
        <button class="lock-btn" :disabled="logging" @click="unlock">
          {{ logging ? 'VERIFYING...' : 'ENTER' }}
        </button>
        <div v-if="lockErr" class="lock-err">{{ lockErr }}</div>
      </div>
    </div>

    <div v-else class="admin-panel">
      <div class="ap-header">
        <div>
          <div class="ap-title">// MUZ ADMIN PANEL</div>
          <div class="ap-subtitle">Draft, schedule and publish content without leaving the page.</div>
        </div>
        <div class="ap-tabs">
          <button class="ap-tab" :class="{ active: tab === 'article' }" @click="tab = 'article'">Articles</button>
          <button class="ap-tab" :class="{ active: tab === 'project' }" @click="tab = 'project'">Project Updates</button>
        </div>
        <button class="lock-btn small" @click="logout">Logout</button>
      </div>

      <div v-if="tab === 'article'" class="ap-body article-layout">
        <div class="ap-form">
          <div class="form-title">{{ editingArticle ? 'Edit article' : 'Create article' }}</div>

          <div class="form-grid two-col">
            <div class="form-row">
              <label>Title</label>
              <input v-model="articleForm.title" class="form-input" placeholder="Article title..." />
            </div>

            <div class="form-row">
              <label>Category</label>
              <select v-model="articleForm.category" class="form-select">
                <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
              </select>
            </div>
          </div>

          <div class="form-grid two-col">
            <div class="form-row">
              <label>Status</label>
              <select v-model="articleForm.status" class="form-select">
                <option v-for="status in articleStatuses" :key="status.value" :value="status.value">{{ status.label }}</option>
              </select>
            </div>

            <div class="form-row">
              <label>Publish At</label>
              <input v-model="articleForm.publishedAt" type="datetime-local" class="form-input" />
            </div>
          </div>

          <div class="form-row">
            <label>Visibility</label>
            <label class="toggle">
              <input v-model="articleForm.isPublic" type="checkbox" :disabled="articleForm.status === 'draft'" />
              <span>{{ articleVisibilityLabel }}</span>
            </label>
          </div>

          <div class="form-row col">
            <label>Summary</label>
            <textarea
              v-model="articleForm.summary"
              class="form-textarea short"
              placeholder="A short summary for cards and previews..."
              spellcheck="false"
            />
            <div class="field-hint">{{ articleForm.summary.length }}/140 recommended</div>
          </div>

          <div class="editor-toolbar">
            <button v-for="tool in markdownTools" :key="tool.label" type="button" class="tool-btn" @click="insertMarkdown(tool.template)">
              {{ tool.label }}
            </button>
            <span class="toolbar-status">{{ editorStatus }}</span>
          </div>

          <div class="editor-grid">
            <div class="editor-pane">
              <div class="pane-title">Markdown</div>
              <textarea
                ref="markdownInput"
                v-model="articleForm.content"
                class="form-textarea editor"
                placeholder="# Title&#10;&#10;Write your markdown here..."
                spellcheck="false"
              />
            </div>

            <div class="editor-pane preview-pane">
              <div class="pane-title">Live Preview</div>
              <div class="preview-body" v-html="articlePreviewHtml"></div>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-submit" :disabled="submitting" @click="submitArticle">
              {{ submitting ? 'SAVING...' : editingArticle ? 'UPDATE' : 'SAVE' }}
            </button>
            <button v-if="editingArticle" class="btn-cancel" @click="cancelArticleEdit">Cancel</button>
          </div>
          <div v-if="articleMessage" :class="['form-msg', articleMessageType]">{{ articleMessage }}</div>
        </div>

        <div class="ap-list">
          <div class="list-title">Articles ({{ articles.length }})</div>
          <div v-if="articles.length === 0" class="list-empty">No article yet.</div>
          <div v-for="article in articles" :key="article.id" class="list-item">
            <div class="li-main">
              <div class="li-meta">
                <span class="li-cat">{{ article.category }}</span>
                <span class="li-status" :class="article.status">{{ resolveStatusLabel(article.status) }}</span>
                <span class="li-pub" :class="{ private: !article.isPublic }">{{ article.isPublic ? 'Public' : 'Private' }}</span>
              </div>
              <div class="li-title">{{ article.title }}</div>
              <div class="li-sub">
                <span>{{ formatDate(article.updatedAt || article.createdAt) }}</span>
                <span v-if="article.publishedAt">Publish: {{ formatDate(article.publishedAt) }}</span>
              </div>
            </div>
            <div class="li-actions">
              <button class="btn-edit" @click="startArticleEdit(article.id)">Edit</button>
              <button class="btn-del" @click="deleteArticle(article.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="ap-body">
        <div class="ap-form">
          <div class="form-title">{{ editingProject ? 'Edit update' : 'Create update' }}</div>

          <div class="form-row">
            <label>Title</label>
            <input v-model="projectForm.title" class="form-input" placeholder="Update title..." />
          </div>

          <div class="form-row">
            <label>Stage</label>
            <select v-model="projectForm.stage" class="form-select">
              <option v-for="stage in stages" :key="stage" :value="stage">{{ stage }}</option>
            </select>
          </div>

          <div class="form-row col">
            <label>Details</label>
            <textarea v-model="projectForm.content" class="form-textarea" placeholder="Describe the latest progress..." spellcheck="false" />
          </div>

          <div class="form-actions">
            <button class="btn-submit" :disabled="submitting" @click="submitProject">
              {{ submitting ? 'SAVING...' : editingProject ? 'UPDATE' : 'SAVE' }}
            </button>
            <button v-if="editingProject" class="btn-cancel" @click="cancelProjectEdit">Cancel</button>
          </div>
          <div v-if="projectMessage" :class="['form-msg', projectMessageType]">{{ projectMessage }}</div>
        </div>

        <div class="ap-list">
          <div class="list-title">Updates ({{ projects.length }})</div>
          <div v-if="projects.length === 0" class="list-empty">No update yet.</div>
          <div v-for="project in projects" :key="project.id" class="list-item">
            <div class="li-main">
              <div class="li-meta">
                <span class="li-cat">{{ project.stage }}</span>
              </div>
              <div class="li-title">{{ project.title }}</div>
              <div class="li-sub">{{ formatDate(project.createdAt) }}</div>
            </div>
            <div class="li-actions">
              <button class="btn-edit" @click="startProjectEdit(project.id)">Edit</button>
              <button class="btn-del" @click="deleteProject(project.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import {
  siteApi,
  type ArticlePayload,
  type ArticleStatus,
  type ArticleSummary,
  type ProjectUpdatePayload,
  type ProjectUpdateSummary
} from '@/api/site'
import { renderMarkdown } from '../composables/useMarkdown'

const TOKEN_KEY = 'muz-admin-token'
const categories = ['通信电子线路', '计算机视觉论文', '算法与底层实现', '网络工程', '杂记']
const stages = ['需求分析', '开发中', '测试中', '已完成']
const articleStatuses: Array<{ value: ArticleStatus; label: string }> = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' }
]
const markdownTools = [
  { label: 'H2', template: '\n## Section\n' },
  { label: 'Code', template: '\n```ts\nconsole.log("demo")\n```\n' },
  { label: 'Quote', template: '\n> Key takeaway\n' },
  { label: 'List', template: '\n- item 1\n- item 2\n' },
  { label: 'Table', template: '\n| Key | Value |\n| --- | --- |\n| A | B |\n' }
]

const unlocked = ref(Boolean(localStorage.getItem(TOKEN_KEY)))
const username = ref('')
const password = ref('')
const lockErr = ref('')
const logging = ref(false)
const submitting = ref(false)
const tab = ref<'article' | 'project'>('article')

const articles = ref<ArticleSummary[]>([])
const projects = ref<ProjectUpdateSummary[]>([])
const markdownInput = ref<HTMLTextAreaElement | null>(null)

const articleForm = reactive<Required<ArticlePayload> & { publishedAt: string }>({
  title: '',
  summary: '',
  content: '',
  category: categories[2],
  status: 'draft',
  isPublic: false,
  publishedAt: ''
})

const projectForm = reactive<ProjectUpdatePayload>({
  title: '',
  content: '',
  stage: stages[1]
})

const editingArticle = ref<number | null>(null)
const editingProject = ref<number | null>(null)
const articleMessage = ref('')
const articleMessageType = ref<'ok' | 'err'>('ok')
const projectMessage = ref('')
const projectMessageType = ref<'ok' | 'err'>('ok')

const articlePreviewHtml = computed(() =>
  articleForm.content.trim() ? renderMarkdown(articleForm.content) : '<p class="empty-preview">Start writing markdown to preview it here.</p>'
)

const articleVisibilityLabel = computed(() => {
  if (articleForm.status === 'draft') return 'Drafts are always private'
  return articleForm.isPublic ? 'Visible on public pages' : 'Saved but hidden from public pages'
})

const editorStatus = computed(() => {
  const wordCount = articleForm.content.trim() ? articleForm.content.trim().split(/\s+/).length : 0
  return `${wordCount} words · ${articleForm.content.length} chars`
})

function clearArticleMessageSoon() {
  window.setTimeout(() => {
    articleMessage.value = ''
  }, 3000)
}

function clearProjectMessageSoon() {
  window.setTimeout(() => {
    projectMessage.value = ''
  }, 3000)
}

function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

function resolveStatusLabel(status: ArticleStatus) {
  if (status === 'published') return 'Published'
  if (status === 'scheduled') return 'Scheduled'
  return 'Draft'
}

function toLocalDateTimeInput(date?: string | null) {
  if (!date) return ''
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return ''
  const offset = parsed.getTimezoneOffset()
  const local = new Date(parsed.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

function formatDate(date?: string | null) {
  if (!date) return '--'
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function normalizedArticlePayload(): ArticlePayload {
  const publishedAt = articleForm.status === 'draft' ? null : articleForm.publishedAt || null
  return {
    title: articleForm.title.trim(),
    summary: articleForm.summary.trim(),
    content: articleForm.content,
    category: articleForm.category,
    status: articleForm.status,
    isPublic: articleForm.status === 'draft' ? false : articleForm.isPublic,
    publishedAt
  }
}

function resetArticleForm() {
  articleForm.title = ''
  articleForm.summary = ''
  articleForm.content = ''
  articleForm.category = categories[2]
  articleForm.status = 'draft'
  articleForm.isPublic = false
  articleForm.publishedAt = ''
}

async function loadArticles() {
  try {
    articles.value = await siteApi.getArticles(true)
  } catch {
    logout()
  }
}

async function loadProjects() {
  projects.value = await siteApi.getProjectUpdates()
}

async function unlock() {
  if (!username.value || !password.value) {
    lockErr.value = 'Username and password are required.'
    return
  }

  logging.value = true
  lockErr.value = ''

  try {
    const data = await siteApi.login({ username: username.value, password: password.value })
    setToken(data.token)
    unlocked.value = true
    await Promise.all([loadArticles(), loadProjects()])
  } catch (error) {
    lockErr.value = error instanceof Error ? error.message : 'Login failed.'
  } finally {
    logging.value = false
    password.value = ''
  }
}

function logout() {
  clearToken()
  unlocked.value = false
  username.value = ''
  password.value = ''
}

function cancelArticleEdit() {
  editingArticle.value = null
  resetArticleForm()
  articleMessage.value = ''
}

function cancelProjectEdit() {
  editingProject.value = null
  projectForm.title = ''
  projectForm.content = ''
  projectForm.stage = stages[1]
  projectMessage.value = ''
}

async function submitArticle() {
  const payload = normalizedArticlePayload()
  if (!payload.title || !payload.content) {
    articleMessage.value = 'Title and content are required.'
    articleMessageType.value = 'err'
    return
  }

  submitting.value = true

  try {
    if (editingArticle.value) {
      await siteApi.updateArticle(editingArticle.value, payload)
      articleMessage.value = 'Article updated.'
    } else {
      await siteApi.createArticle(payload)
      articleMessage.value = 'Article saved.'
    }

    articleMessageType.value = 'ok'
    await loadArticles()
    cancelArticleEdit()
  } catch (error) {
    articleMessage.value = error instanceof Error ? error.message : 'Failed to save article.'
    articleMessageType.value = 'err'
    clearArticleMessageSoon()
  } finally {
    submitting.value = false
  }
}

async function submitProject() {
  if (!projectForm.title || !projectForm.content) {
    projectMessage.value = 'Title and details are required.'
    projectMessageType.value = 'err'
    return
  }

  submitting.value = true

  try {
    if (editingProject.value) {
      await siteApi.updateProjectUpdate(editingProject.value, projectForm)
      projectMessage.value = 'Update saved.'
    } else {
      await siteApi.createProjectUpdate(projectForm)
      projectMessage.value = 'Update created.'
    }

    projectMessageType.value = 'ok'
    await loadProjects()
    cancelProjectEdit()
  } catch (error) {
    projectMessage.value = error instanceof Error ? error.message : 'Failed to save update.'
    projectMessageType.value = 'err'
    clearProjectMessageSoon()
  } finally {
    submitting.value = false
  }
}

async function startArticleEdit(id: number) {
  const article = await siteApi.getArticle(id, true)
  editingArticle.value = id
  articleForm.title = article.title
  articleForm.summary = article.summary
  articleForm.content = article.content
  articleForm.category = article.category
  articleForm.status = article.status
  articleForm.isPublic = article.isPublic
  articleForm.publishedAt = toLocalDateTimeInput(article.publishedAt)
  await nextTick()
  markdownInput.value?.focus()
}

async function startProjectEdit(id: number) {
  const project = await siteApi.getProjectUpdate(id)
  editingProject.value = id
  projectForm.title = project.title
  projectForm.content = project.content || ''
  projectForm.stage = project.stage
}

async function deleteArticle(id: number) {
  if (!confirm('Delete this article?')) return
  await siteApi.deleteArticle(id)
  await loadArticles()
}

async function deleteProject(id: number) {
  if (!confirm('Delete this update?')) return
  await siteApi.deleteProjectUpdate(id)
  await loadProjects()
}

function insertMarkdown(template: string) {
  articleForm.content += template
  nextTick(() => markdownInput.value?.focus())
}

onMounted(async () => {
  document.title = 'Muz | Admin'

  if (unlocked.value) {
    await Promise.all([loadArticles(), loadProjects()])
  }
})
</script>

<style lang="scss" scoped>
.admin-page {
  min-height: 100vh;
  background: #060c14;
  color: #eaf4ff;
  font-family: 'Courier New', monospace;
}

.admin-lock {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.lock-box {
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid rgba(0, 245, 255, 0.2);
  padding: 48px;
  background: #0a1520;
  min-width: 320px;
  text-align: center;
}

.lock-title,
.ap-title,
.form-title,
.list-title,
.pane-title {
  font-family: 'Orbitron', monospace;
}

.lock-title {
  font-size: 0.8rem;
  color: #00f5ff;
  letter-spacing: 4px;
  margin-bottom: 8px;
}

.lock-input,
.form-input,
.form-select,
.form-textarea {
  background: #0a1520;
  border: 1px solid rgba(0, 245, 255, 0.15);
  color: #eaf4ff;
  font-family: monospace;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: rgba(0, 245, 255, 0.5);
  }
}

.lock-input {
  padding: 10px 16px;
  font-size: 0.9rem;
}

.lock-btn,
.btn-submit,
.btn-cancel,
.ap-tab,
.btn-edit,
.btn-del,
.tool-btn {
  cursor: pointer;
}

.lock-btn {
  background: transparent;
  border: 1px solid #00f5ff;
  color: #00f5ff;
  padding: 10px 32px;
  font-family: 'Orbitron', monospace;
  font-size: 0.7rem;
  letter-spacing: 3px;
  transition: background 0.15s;

  &:hover {
    background: rgba(0, 245, 255, 0.1);
  }

  &.small {
    padding: 6px 16px;
    font-size: 0.6rem;
  }
}

.lock-err {
  color: #ff006e;
  font-size: 0.75rem;
  letter-spacing: 1px;
}

.ap-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 32px;
  border-bottom: 1px solid rgba(0, 245, 255, 0.1);
  flex-wrap: wrap;
}

.ap-title {
  font-size: 0.8rem;
  color: #00f5ff;
  letter-spacing: 4px;
}

.ap-subtitle {
  margin-top: 6px;
  color: #8aaac8;
  font-size: 0.74rem;
}

.ap-tabs {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.ap-tab {
  background: transparent;
  border: 1px solid rgba(0, 245, 255, 0.2);
  color: #8aaac8;
  padding: 7px 20px;
  font-family: monospace;
  font-size: 0.78rem;
  transition: all 0.15s;

  &.active,
  &:hover {
    border-color: #00f5ff;
    color: #00f5ff;
  }
}

.ap-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  padding: 32px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
}

.article-layout {
  grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.85fr);
}

.ap-form,
.ap-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-title {
  font-size: 0.72rem;
  color: #00f5ff;
  letter-spacing: 3px;
  border-bottom: 1px solid rgba(0, 245, 255, 0.1);
  padding-bottom: 10px;
}

.form-grid {
  display: grid;
  gap: 14px;
}

.two-col {
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
}

.form-row {
  display: flex;
  align-items: center;
  gap: 14px;

  &.col {
    flex-direction: column;
    align-items: stretch;
  }

  label {
    font-size: 0.72rem;
    color: #8aaac8;
    letter-spacing: 1px;
    min-width: 80px;
  }
}

.form-input,
.form-select {
  flex: 1;
  padding: 9px 14px;
  font-size: 0.82rem;
}

.form-select option {
  background: #0a1520;
}

.form-textarea {
  padding: 14px;
  font-size: 0.8rem;
  line-height: 1.7;
  resize: vertical;
  min-height: 320px;

  &.short {
    min-height: 96px;
  }

  &.editor {
    min-height: 460px;
  }
}

.field-hint,
.toolbar-status,
.li-sub {
  font-size: 0.68rem;
  color: rgba(138, 170, 200, 0.75);
}

.toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  color: #00f5ff;

  input {
    accent-color: #00f5ff;
  }
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tool-btn {
  border: 1px solid rgba(0, 245, 255, 0.2);
  background: rgba(0, 245, 255, 0.05);
  color: #8aaac8;
  padding: 6px 10px;
  font-size: 0.72rem;

  &:hover {
    color: #00f5ff;
    border-color: rgba(0, 245, 255, 0.45);
  }
}

.toolbar-status {
  margin-left: auto;
}

.editor-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
}

.editor-pane {
  border: 1px solid rgba(0, 245, 255, 0.1);
  background: rgba(10, 21, 32, 0.78);
}

.pane-title {
  padding: 12px 14px;
  border-bottom: 1px solid rgba(0, 245, 255, 0.08);
  font-size: 0.64rem;
  letter-spacing: 2px;
  color: #00f5ff;
}

.preview-body {
  padding: 16px 18px;
  min-height: 460px;
  color: #c5d8ee;
  font-size: 0.82rem;
  line-height: 1.8;
  overflow: auto;

  :deep(h1),
  :deep(h2),
  :deep(h3) {
    color: #eaf4ff;
    font-family: 'Orbitron', monospace;
  }

  :deep(code) {
    background: rgba(0, 245, 255, 0.08);
    padding: 1px 6px;
  }

  :deep(pre) {
    background: #06111e;
    padding: 12px;
    overflow: auto;
  }

  :deep(blockquote) {
    margin: 0;
    padding-left: 12px;
    border-left: 3px solid rgba(0, 245, 255, 0.3);
    color: #8aaac8;
  }
}

.form-actions {
  display: flex;
  gap: 12px;
}

.btn-submit {
  background: rgba(0, 245, 255, 0.1);
  border: 1px solid #00f5ff;
  color: #00f5ff;
  padding: 10px 28px;
  font-family: 'Orbitron', monospace;
  font-size: 0.7rem;
  letter-spacing: 2px;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: rgba(0, 245, 255, 0.2);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.btn-cancel {
  background: transparent;
  border: 1px solid rgba(255, 0, 110, 0.3);
  color: #ff006e;
  padding: 10px 20px;
  font-family: monospace;
  font-size: 0.75rem;

  &:hover {
    background: rgba(255, 0, 110, 0.08);
  }
}

.form-msg {
  font-size: 0.75rem;
  letter-spacing: 1px;
  padding: 8px 12px;

  &.ok {
    color: #00ff88;
    background: rgba(0, 255, 136, 0.06);
    border: 1px solid rgba(0, 255, 136, 0.15);
  }

  &.err {
    color: #ff006e;
    background: rgba(255, 0, 110, 0.06);
    border: 1px solid rgba(255, 0, 110, 0.15);
  }
}

.list-title {
  font-size: 0.65rem;
  color: #8aaac8;
  letter-spacing: 3px;
  border-bottom: 1px solid rgba(0, 245, 255, 0.08);
  padding-bottom: 8px;
}

.list-empty {
  font-size: 0.75rem;
  color: rgba(138, 170, 200, 0.4);
  padding: 16px 0;
}

.list-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px 14px;
  border: 1px solid rgba(0, 245, 255, 0.08);
  background: #0a1520;
  gap: 12px;

  &:hover {
    border-color: rgba(0, 245, 255, 0.2);
  }
}

.li-main {
  min-width: 0;
  flex: 1;
}

.li-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.li-cat,
.li-status {
  font-size: 0.62rem;
  border: 1px solid rgba(0, 245, 255, 0.2);
  padding: 2px 8px;
  white-space: nowrap;
  letter-spacing: 1px;
}

.li-cat {
  color: #00f5ff;
}

.li-status {
  color: #8aaac8;

  &.published {
    color: #00ff88;
    border-color: rgba(0, 255, 136, 0.25);
  }

  &.scheduled {
    color: #ffd166;
    border-color: rgba(255, 209, 102, 0.3);
  }

  &.draft {
    color: #ff006e;
    border-color: rgba(255, 0, 110, 0.25);
  }
}

.li-title {
  margin-top: 8px;
  font-size: 0.84rem;
  color: #eaf4ff;
}

.li-pub {
  font-size: 0.6rem;
  color: #00ff88;
  letter-spacing: 1px;
  white-space: nowrap;

  &.private {
    color: #ff006e;
  }
}

.li-sub {
  margin-top: 6px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.li-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.btn-edit,
.btn-del {
  background: transparent;
  padding: 4px 12px;
  font-size: 0.68rem;
}

.btn-edit {
  border: 1px solid rgba(0, 245, 255, 0.2);
  color: #8aaac8;

  &:hover {
    border-color: #00f5ff;
    color: #00f5ff;
  }
}

.btn-del {
  border: 1px solid rgba(255, 0, 110, 0.2);
  color: rgba(255, 0, 110, 0.6);

  &:hover {
    border-color: #ff006e;
    color: #ff006e;
  }
}

:global(:root[data-theme='light']) {
  .admin-page {
    background: #f0f4f8;
    color: #1a2332;
  }

  .lock-box,
  .list-item,
  .editor-pane {
    background: #ffffff;
    border-color: rgba(0, 119, 204, 0.12);
  }

  .lock-input,
  .form-input,
  .form-select,
  .form-textarea {
    background: #f7fafc;
    color: #1a2332;
    border-color: rgba(0, 119, 204, 0.16);
  }

  .ap-title,
  .form-title,
  .pane-title,
  .lock-title {
    color: #0077cc;
  }

  .ap-subtitle,
  .field-hint,
  .toolbar-status,
  .li-sub {
    color: #4a5568;
  }

  .preview-body,
  .li-title {
    color: #1a2332;
  }
}
</style>
