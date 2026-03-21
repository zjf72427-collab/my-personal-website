<template>
  <section id="guestbook" class="w">
    <div class="sh rv"><span class="snum">08</span><h2 class="stit">GUESTBOOK</h2><div class="sl2"></div></div>
    <p class="gb-lead rv">// 留下你的信号 — 每一条留言都会被记录</p>

    <div class="gb-wrap">
      <!-- Message list -->
      <div class="gb-list rv">
        <div v-if="loading" class="gb-loading">// 正在接收信号...</div>
        <div v-else-if="messages.length === 0" class="gb-empty">// 还没有留言，成为第一个！</div>
        <div v-for="msg in messages" :key="msg.id" class="gb-msg">
          <div class="gb-msg-header">
            <span class="gb-avatar">{{ msg.avatar }}</span>
            <span class="gb-name">{{ msg.name }}</span>
            <span class="gb-time">{{ msg.time }}</span>
          </div>
          <div class="gb-msg-body">{{ msg.body }}</div>
        </div>
      </div>

      <!-- Submit form -->
      <form class="gb-form rv" @submit.prevent="submit">
        <div class="gb-field">
          <input v-model="form.name" placeholder="你的名字" maxlength="20" />
        </div>
        <div class="gb-field">
          <textarea v-model="form.body" placeholder="留下你的信号..." maxlength="200" rows="3"></textarea>
          <span class="gb-count">{{ form.body.length }}/200</span>
        </div>
        <div v-if="submitErr" class="gb-err">{{ submitErr }}</div>
        <div v-if="submitOk" class="gb-ok">// 信号已发送 ✓</div>
        <button type="submit" :disabled="submitting" class="gb-btn">
          {{ submitting ? 'SENDING...' : 'SEND // 发送' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
// ── Config ────────────────────────────────────────────────────
// Replace with your GitHub username, repo name, and a public repo
// Create a fine-grained PAT with Issues:write scope and put it here
// WARNING: for a public site, use a serverless function to proxy this
const GH_OWNER = 'your-github-username'
const GH_REPO  = 'your-repo-name'
const GH_TOKEN = ''   // leave empty to disable submit; read is always public
const GH_LABEL = 'guestbook'
// ──────────────────────────────────────────────────────────────

interface Message { id: number; name: string; avatar: string; body: string; time: string }

const messages = ref<Message[]>([])
const loading = ref(true)
const form = reactive({ name: '', body: '' })
const submitting = ref(false)
const submitErr = ref('')
const submitOk = ref(false)

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`
  return `${Math.floor(diff / 86400)} 天前`
}

function nameToAvatar(name: string): string {
  return name ? name[0].toUpperCase() : '?'
}

async function fetchMessages() {
  loading.value = true
  try {
    const url = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/issues?labels=${GH_LABEL}&state=open&per_page=20&sort=created&direction=desc`
    const res = await fetch(url, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    })
    if (!res.ok) throw new Error('fetch failed')
    const data = await res.json()
    messages.value = data.map((issue: any) => {
      const lines = (issue.body || '').split('\n')
      const nameLine = lines.find((l: string) => l.startsWith('name:'))
      const bodyLine = lines.find((l: string) => l.startsWith('msg:'))
      const name = nameLine ? nameLine.replace('name:', '').trim() : issue.user.login
      const body = bodyLine ? bodyLine.replace('msg:', '').trim() : issue.body
      return {
        id: issue.id,
        name,
        avatar: nameToAvatar(name),
        body,
        time: timeAgo(issue.created_at),
      }
    })
  } catch {
    messages.value = []
  } finally {
    loading.value = false
  }
}

async function submit() {
  submitErr.value = ''
  submitOk.value = false
  if (!form.name.trim()) { submitErr.value = '请填写名字'; return }
  if (!form.body.trim()) { submitErr.value = '请填写留言'; return }
  if (!GH_TOKEN) { submitErr.value = '// 留言功能暂未开放，请通过邮件联系'; return }
  submitting.value = true
  try {
    const res = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `token ${GH_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `[guestbook] ${form.name}`,
        body: `name: ${form.name}\nmsg: ${form.body}`,
        labels: [GH_LABEL],
      }),
    })
    if (!res.ok) throw new Error('submit failed')
    submitOk.value = true
    form.name = ''
    form.body = ''
    setTimeout(() => fetchMessages(), 800)
  } catch {
    submitErr.value = '// 发送失败，请稍后再试'
  } finally {
    submitting.value = false
    setTimeout(() => { submitOk.value = false }, 4000)
  }
}

onMounted(() => {
  fetchMessages()
  const obs = new IntersectionObserver(
    es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('on') }),
    { threshold: .1 }
  )
  document.querySelectorAll('#guestbook .rv').forEach(el => obs.observe(el))
})
</script>

<style lang="scss" scoped>
.gb-lead {
  font-family: 'Orbitron', monospace; font-size: .68rem;
  color: #00f5ff; letter-spacing: 3px; opacity: .6; margin-bottom: 32px;
}
.gb-wrap {
  display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
}
.gb-list {
  display: flex; flex-direction: column; gap: 12px;
  max-height: 420px; overflow-y: auto; padding-right: 4px;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(0,245,255,.2); }
}
.gb-loading, .gb-empty {
  font-family: monospace; font-size: .72rem;
  color: rgba(138,170,200,.4); letter-spacing: 2px; padding: 20px 0;
}
.gb-msg {
  background: #0a1520; border: 1px solid rgba(0,245,255,.08);
  padding: 14px 16px; transition: border-color .15s;
  &:hover { border-color: rgba(0,245,255,.25); }
}
.gb-msg-header {
  display: flex; align-items: center; gap: 10px; margin-bottom: 8px;
}
.gb-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(135deg, #00f5ff, #7b2fff);
  display: flex; align-items: center; justify-content: center;
  font-size: .72rem; font-weight: 700; color: #000; flex-shrink: 0;
}
.gb-name {
  font-family: 'Orbitron', monospace; font-size: .65rem;
  color: #00f5ff; letter-spacing: 2px; flex: 1;
}
.gb-time { font-size: .6rem; color: rgba(138,170,200,.4); letter-spacing: 1px; }
.gb-msg-body { font-size: .82rem; color: #8aaac8; line-height: 1.7; }

.gb-form {
  display: flex; flex-direction: column; gap: 12px;
}
.gb-field {
  position: relative;
  input, textarea {
    width: 100%; background: #0a1520; border: 1px solid rgba(0,245,255,.14);
    color: #eaf4ff; padding: 11px 14px; font-family: 'Noto Sans SC', sans-serif;
    font-size: .85rem; outline: none; resize: none; display: block;
    transition: border-color .15s;
    &:focus { border-color: #00f5ff; box-shadow: 0 0 10px rgba(0,245,255,.1); }
    &::placeholder { color: rgba(138,170,200,.35); }
  }
}
.gb-count {
  position: absolute; right: 10px; bottom: 8px;
  font-size: .6rem; color: rgba(138,170,200,.3); font-family: monospace;
}
.gb-err { font-family: monospace; font-size: .7rem; color: #ff006e; letter-spacing: 1px; }
.gb-ok  { font-family: monospace; font-size: .7rem; color: #00f5ff; letter-spacing: 2px; }
.gb-btn {
  padding: 11px 24px; font-family: 'Orbitron', monospace; font-size: .68rem;
  letter-spacing: 3px; background: #00f5ff; color: #000;
  border: none; cursor: pointer; font-weight: 700;
  box-shadow: 0 0 16px rgba(0,245,255,.3); transition: .15s;
  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,245,255,.4); }
  &:disabled { opacity: .5; cursor: not-allowed; }
}
</style>
