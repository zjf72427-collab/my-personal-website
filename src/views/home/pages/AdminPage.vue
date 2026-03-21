<template>
  <div class="admin-page">
    <!-- 密码锁屏 -->
    <div v-if="!unlocked" class="admin-lock">
      <div class="lock-box">
        <div class="lock-title">// ADMIN ACCESS</div>
        <input
          v-model="username"
          type="text"
          class="lock-input"
          placeholder="Username"
          autocomplete="username"
          @keydown.enter="unlock"
        />
        <input
          v-model="pwd"
          type="password"
          class="lock-input"
          placeholder="Password"
          autocomplete="current-password"
          @keydown.enter="unlock"
        />
        <button class="lock-btn" :disabled="logging" @click="unlock">
          {{ logging ? 'VERIFYING...' : 'ENTER' }}
        </button>
        <div v-if="lockErr" class="lock-err">{{ lockErr }}</div>
      </div>
    </div>

    <!-- 管理面板 -->
    <div v-else class="admin-panel">
      <div class="ap-header">
        <div class="ap-title">// 木Z ADMIN PANEL</div>
        <div class="ap-tabs">
          <button :class="['ap-tab', { active: tab === 'article' }]" @click="tab = 'article'">文章管理</button>
          <button :class="['ap-tab', { active: tab === 'project' }]" @click="tab = 'project'">大赛进度</button>
        </div>
        <button class="lock-btn small" @click="logout()">退出</button>
      </div>

      <!-- 文章管理 -->
      <div v-if="tab === 'article'" class="ap-body">
        <div class="ap-form">
          <div class="form-title">{{ editingArticle ? '编辑文章' : '发布新笔记' }}</div>

          <div class="form-row">
            <label>标题</label>
            <input v-model="aForm.title" class="form-input" placeholder="笔记标题..." />
          </div>

          <div class="form-row">
            <label>分类</label>
            <select v-model="aForm.category" class="form-select">
              <option value="通信电子线路">通信电子线路</option>
              <option value="CV论文">CV论文</option>
              <option value="底层算法">底层算法</option>
              <option value="网络工程">网络工程</option>
              <option value="杂记">杂记</option>
            </select>
          </div>

          <div class="form-row">
            <label>可见性</label>
            <label class="toggle">
              <input type="checkbox" v-model="aForm.isPublic" />
              <span>{{ aForm.isPublic ? '公开' : '私密' }}</span>
            </label>
          </div>

          <div class="form-row col">
            <label>Markdown 正文</label>
            <textarea
              v-model="aForm.content"
              class="form-textarea"
              placeholder="# 标题&#10;&#10;在这里写 Markdown 内容..."
              spellcheck="false"
            />
          </div>

          <div class="form-actions">
            <button class="btn-submit" :disabled="submitting" @click="submitArticle">
              {{ submitting ? 'PUBLISHING...' : (editingArticle ? 'UPDATE' : 'PUBLISH') }}
            </button>
            <button v-if="editingArticle" class="btn-cancel" @click="cancelEdit">取消</button>
          </div>
          <div v-if="aMsg" :class="['form-msg', aMsgType]">{{ aMsg }}</div>
        </div>

        <!-- 文章列表 -->
        <div class="ap-list">
          <div class="list-title">已有笔记 ({{ articles.length }})</div>
          <div v-if="articles.length === 0" class="list-empty">暂无数据 — 发布第一篇笔记</div>
          <div v-for="a in articles" :key="a.id" class="list-item">
            <div class="li-meta">
              <span class="li-cat">{{ a.category }}</span>
              <span class="li-title">{{ a.title }}</span>
              <span class="li-pub" :class="{ private: !a.isPublic }">{{ a.isPublic ? '公开' : '私密' }}</span>
            </div>
            <div class="li-actions">
              <button class="btn-edit" @click="startEdit(a)">编辑</button>
              <button class="btn-del" @click="deleteArticle(a.id)">删除</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 大赛进度 -->
      <div v-if="tab === 'project'" class="ap-body">
        <div class="ap-form">
          <div class="form-title">{{ editingProject ? '编辑进度' : '发布新进度' }}</div>

          <div class="form-row">
            <label>标题</label>
            <input v-model="pForm.title" class="form-input" placeholder="进度标题..." />
          </div>

          <div class="form-row">
            <label>阶段</label>
            <select v-model="pForm.stage" class="form-select">
              <option value="需求分析">需求分析</option>
              <option value="开发中">开发中</option>
              <option value="测试">测试</option>
              <option value="已完成">已完成</option>
            </select>
          </div>

          <div class="form-row col">
            <label>进度详情</label>
            <textarea v-model="pForm.content" class="form-textarea" placeholder="描述本次进展..." spellcheck="false" />
          </div>

          <div class="form-actions">
            <button class="btn-submit" :disabled="submitting" @click="submitProject">
              {{ submitting ? 'SAVING...' : (editingProject ? 'UPDATE' : 'SAVE') }}
            </button>
            <button v-if="editingProject" class="btn-cancel" @click="cancelProjectEdit">取消</button>
          </div>
          <div v-if="pMsg" :class="['form-msg', pMsgType]">{{ pMsg }}</div>
        </div>

        <div class="ap-list">
          <div class="list-title">进度记录 ({{ projects.length }})</div>
          <div v-if="projects.length === 0" class="list-empty">暂无记录</div>
          <div v-for="p in projects" :key="p.id" class="list-item">
            <div class="li-meta">
              <span class="li-cat">{{ p.stage }}</span>
              <span class="li-title">{{ p.title }}</span>
            </div>
            <div class="li-actions">
              <button class="btn-edit" @click="startProjectEdit(p)">编辑</button>
              <button class="btn-del" @click="deleteProject(p.id)">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const API = 'http://localhost:3008'
const TOKEN_KEY = 'muz-admin-token'

// ── 鉴权辅助 ──────────────────────────────────────
function getToken() { return localStorage.getItem(TOKEN_KEY) || '' }
function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }
}

// ── 登录 ──────────────────────────────────────────
const unlocked = ref(!!getToken())
const username = ref('')
const pwd = ref('')
const lockErr = ref('')
const logging = ref(false)

async function unlock() {
  if (!username.value || !pwd.value) { lockErr.value = '请输入账号和密码'; return }
  logging.value = true
  lockErr.value = ''
  try {
    const r = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: pwd.value })
    })
    if (!r.ok) { lockErr.value = 'ACCESS DENIED'; return }
    const data = await r.json()
    localStorage.setItem(TOKEN_KEY, data.token)
    unlocked.value = true
    loadArticles()
    loadProjects()
  } catch {
    lockErr.value = '服务器连接失败'
  } finally {
    logging.value = false
    pwd.value = ''
  }
}

function logout() {
  localStorage.removeItem(TOKEN_KEY)
  unlocked.value = false
  username.value = ''
}

const tab = ref<'article' | 'project'>('article')

// ── Articles ──────────────────────────────────────
interface Article { id: number; title: string; category: string; isPublic: boolean; createdAt: string }
const articles = ref<Article[]>([])
const aForm = reactive({ title: '', content: '', category: '底层算法', isPublic: true })
const editingArticle = ref<number | null>(null)
const submitting = ref(false)
const aMsg = ref('')
const aMsgType = ref('ok')

async function loadArticles() {
  const r = await fetch(`${API}/api/articles?admin=1`, { headers: { 'Authorization': `Bearer ${getToken()}` } })
  if (r.status === 401) { logout(); return }
  articles.value = await r.json()
}

async function submitArticle() {
  if (!aForm.title || !aForm.content) { aMsg.value = '标题和内容不能为空'; aMsgType.value = 'err'; return }
  submitting.value = true
  try {
    const url = editingArticle.value ? `${API}/api/articles/${editingArticle.value}` : `${API}/api/articles`
    const method = editingArticle.value ? 'PUT' : 'POST'
    const r = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(aForm) })
    if (r.status === 401) { logout(); return }
    if (!r.ok) throw new Error(await r.text())
    aMsg.value = editingArticle.value ? '更新成功 ✓' : '发布成功 ✓'
    aMsgType.value = 'ok'
    cancelEdit()
    loadArticles()
  } catch (e: any) {
    aMsg.value = '请求失败：' + e.message; aMsgType.value = 'err'
  } finally {
    submitting.value = false
  }
}

function startEdit(a: any) {
  editingArticle.value = a.id
  aForm.title = a.title
  aForm.category = a.category
  aForm.isPublic = a.isPublic
  aForm.content = ''
  // 加载完整内容
  fetch(`${API}/api/articles/${a.id}`).then(r => r.json()).then(d => { aForm.content = d.content })
}

function cancelEdit() {
  editingArticle.value = null
  aForm.title = ''; aForm.content = ''; aForm.category = '底层算法'; aForm.isPublic = true
  setTimeout(() => { aMsg.value = '' }, 3000)
}

async function deleteArticle(id: number) {
  if (!confirm('确认删除？')) return
  await fetch(`${API}/api/articles/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${getToken()}` } })
  loadArticles()
}

// ── ProjectUpdates ────────────────────────────────
interface Project { id: number; title: string; stage: string; createdAt: string }
const projects = ref<Project[]>([])
const pForm = reactive({ title: '', content: '', stage: '开发中' })
const editingProject = ref<number | null>(null)
const pMsg = ref('')
const pMsgType = ref('ok')

async function loadProjects() {
  const r = await fetch(`${API}/api/project-updates`)
  projects.value = await r.json()
}

async function submitProject() {
  if (!pForm.title || !pForm.content) { pMsg.value = '标题和内容不能为空'; pMsgType.value = 'err'; return }
  submitting.value = true
  try {
    const url = editingProject.value ? `${API}/api/project-updates/${editingProject.value}` : `${API}/api/project-updates`
    const method = editingProject.value ? 'PUT' : 'POST'
    const r = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(pForm) })
    if (r.status === 401) { logout(); return }
    if (!r.ok) throw new Error(await r.text())
    pMsg.value = editingProject.value ? '更新成功 ✓' : '保存成功 ✓'
    pMsgType.value = 'ok'
    cancelProjectEdit()
    loadProjects()
  } catch (e: any) {
    pMsg.value = '请求失败：' + e.message; pMsgType.value = 'err'
  } finally {
    submitting.value = false
  }
}

function startProjectEdit(p: any) {
  editingProject.value = p.id
  pForm.title = p.title; pForm.stage = p.stage; pForm.content = p.content || ''
}
function cancelProjectEdit() {
  editingProject.value = null
  pForm.title = ''; pForm.content = ''; pForm.stage = '开发中'
  setTimeout(() => { pMsg.value = '' }, 3000)
}
async function deleteProject(id: number) {
  if (!confirm('确认删除？')) return
  await fetch(`${API}/api/project-updates/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${getToken()}` } })
  loadProjects()
}

onMounted(() => { document.title = '木Z · Admin' })
</script>

<style lang="scss" scoped>
.admin-page {
  min-height: 100vh;
  background: #060c14;
  color: #eaf4ff;
  font-family: 'Courier New', monospace;
}

// ── 锁屏 ──────────────────────────────────────────
.admin-lock {
  display: flex; align-items: center; justify-content: center;
  min-height: 100vh;
}
.lock-box {
  display: flex; flex-direction: column; gap: 16px;
  border: 1px solid rgba(0,245,255,.2);
  padding: 48px; background: #0a1520; min-width: 320px; text-align: center;
}
.lock-title {
  font-family: 'Orbitron', monospace; font-size: .8rem;
  color: #00f5ff; letter-spacing: 4px; margin-bottom: 8px;
}
.lock-input {
  background: #060c14; border: 1px solid rgba(0,245,255,.25);
  color: #eaf4ff; padding: 10px 16px; font-family: monospace;
  font-size: .9rem; outline: none; width: 100%; box-sizing: border-box;
  &:focus { border-color: #00f5ff; }
}
.lock-btn {
  background: transparent; border: 1px solid #00f5ff;
  color: #00f5ff; padding: 10px 32px; font-family: 'Orbitron', monospace;
  font-size: .7rem; letter-spacing: 3px; cursor: pointer;
  transition: background .15s;
  &:hover { background: rgba(0,245,255,.1); }
  &.small { padding: 6px 16px; font-size: .6rem; }
}
.lock-err { color: #ff006e; font-size: .75rem; letter-spacing: 2px; }

// ── 面板布局 ──────────────────────────────────────
.ap-header {
  display: flex; align-items: center; gap: 20px;
  padding: 20px 32px; border-bottom: 1px solid rgba(0,245,255,.1);
  flex-wrap: wrap;
}
.ap-title {
  font-family: 'Orbitron', monospace; font-size: .8rem;
  color: #00f5ff; letter-spacing: 4px; margin-right: auto;
}
.ap-tabs { display: flex; gap: 8px; }
.ap-tab {
  background: transparent; border: 1px solid rgba(0,245,255,.2);
  color: #8aaac8; padding: 7px 20px; font-family: monospace;
  font-size: .78rem; cursor: pointer; transition: all .15s;
  &.active, &:hover { border-color: #00f5ff; color: #00f5ff; }
}
.ap-body { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; padding: 32px; }
@media (max-width: 900px) { .ap-body { grid-template-columns: 1fr; } }

// ── 表单 ──────────────────────────────────────────
.ap-form { display: flex; flex-direction: column; gap: 18px; }
.form-title {
  font-family: 'Orbitron', monospace; font-size: .72rem;
  color: #00f5ff; letter-spacing: 3px;
  border-bottom: 1px solid rgba(0,245,255,.1); padding-bottom: 10px;
}
.form-row {
  display: flex; align-items: center; gap: 14px;
  &.col { flex-direction: column; align-items: stretch; }
  label { font-size: .72rem; color: #8aaac8; letter-spacing: 1px; min-width: 60px; }
}
.form-input, .form-select {
  flex: 1; background: #0a1520; border: 1px solid rgba(0,245,255,.15);
  color: #eaf4ff; padding: 9px 14px; font-family: monospace; font-size: .82rem;
  outline: none; transition: border-color .15s;
  &:focus { border-color: rgba(0,245,255,.5); }
}
.form-select option { background: #0a1520; }
.form-textarea {
  background: #0a1520; border: 1px solid rgba(0,245,255,.15);
  color: #eaf4ff; padding: 14px; font-family: 'Courier New', monospace;
  font-size: .8rem; line-height: 1.7; outline: none; resize: vertical;
  min-height: 320px; transition: border-color .15s;
  &:focus { border-color: rgba(0,245,255,.5); }
}
.toggle {
  display: flex; align-items: center; gap: 8px; cursor: pointer;
  font-size: .8rem; color: #00f5ff;
  input { accent-color: #00f5ff; }
}
.form-actions { display: flex; gap: 12px; }
.btn-submit {
  background: rgba(0,245,255,.1); border: 1px solid #00f5ff;
  color: #00f5ff; padding: 10px 28px; font-family: 'Orbitron', monospace;
  font-size: .7rem; letter-spacing: 2px; cursor: pointer;
  transition: background .15s;
  &:hover:not(:disabled) { background: rgba(0,245,255,.2); }
  &:disabled { opacity: .4; cursor: not-allowed; }
}
.btn-cancel {
  background: transparent; border: 1px solid rgba(255,0,110,.3);
  color: #ff006e; padding: 10px 20px; font-family: monospace;
  font-size: .75rem; cursor: pointer;
  &:hover { background: rgba(255,0,110,.08); }
}
.form-msg {
  font-size: .75rem; letter-spacing: 1px; padding: 8px 12px;
  &.ok { color: #00ff88; background: rgba(0,255,136,.06); border: 1px solid rgba(0,255,136,.15); }
  &.err { color: #ff006e; background: rgba(255,0,110,.06); border: 1px solid rgba(255,0,110,.15); }
}

// ── 列表 ──────────────────────────────────────────
.ap-list { display: flex; flex-direction: column; gap: 10px; }
.list-title {
  font-family: 'Orbitron', monospace; font-size: .65rem;
  color: #8aaac8; letter-spacing: 3px;
  border-bottom: 1px solid rgba(0,245,255,.08); padding-bottom: 8px;
}
.list-empty { font-size: .75rem; color: rgba(138,170,200,.4); padding: 16px 0; }
.list-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px; border: 1px solid rgba(0,245,255,.08);
  background: #0a1520; gap: 12px;
  &:hover { border-color: rgba(0,245,255,.2); }
}
.li-meta { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.li-cat {
  font-size: .62rem; color: #00f5ff; border: 1px solid rgba(0,245,255,.2);
  padding: 2px 8px; white-space: nowrap; letter-spacing: 1px;
}
.li-title {
  font-size: .78rem; color: #eaf4ff;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.li-pub {
  font-size: .6rem; color: #00ff88; letter-spacing: 1px; white-space: nowrap;
  &.private { color: #ff006e; }
}
.li-actions { display: flex; gap: 8px; flex-shrink: 0; }
.btn-edit {
  background: transparent; border: 1px solid rgba(0,245,255,.2);
  color: #8aaac8; padding: 4px 12px; font-size: .68rem; cursor: pointer;
  &:hover { border-color: #00f5ff; color: #00f5ff; }
}
.btn-del {
  background: transparent; border: 1px solid rgba(255,0,110,.2);
  color: rgba(255,0,110,.6); padding: 4px 12px; font-size: .68rem; cursor: pointer;
  &:hover { border-color: #ff006e; color: #ff006e; }
}
</style>
