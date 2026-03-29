<template>
  <section id="guestbook" class="w">
    <div class="sh rv">
      <span class="snum">08</span>
      <h2 class="stit">GUESTBOOK</h2>
      <div class="sl2"></div>
    </div>
    <p class="gb-lead rv">// 留下一句信号。每一条留言，都会被认真收下。</p>

    <div class="gb-wrap">
      <div class="gb-list rv">
        <div v-if="loading" class="gb-loading">// 正在接收留言...</div>
        <div v-else-if="messages.length === 0" class="gb-empty">// 还没有留言，你可以成为第一个。</div>
        <article v-for="msg in messages" :key="msg.id" class="gb-msg">
          <div class="gb-msg-header">
            <span class="gb-avatar">{{ getAvatar(msg.name) }}</span>
            <span class="gb-name">{{ msg.name }}</span>
            <time class="gb-time" :datetime="msg.createdAt">{{ formatTimeAgo(msg.createdAt) }}</time>
          </div>
          <p class="gb-msg-body">{{ msg.body }}</p>
        </article>
      </div>

      <form class="gb-form rv" @submit.prevent="submit">
        <label class="gb-field">
          <span class="sr-only">你的名字</span>
          <input v-model.trim="form.name" maxlength="20" placeholder="你的名字" />
        </label>
        <label class="gb-field">
          <span class="sr-only">留言内容</span>
          <textarea v-model.trim="form.body" maxlength="200" rows="4" placeholder="留下一句想说的话..." />
          <span class="gb-count">{{ form.body.length }}/200</span>
        </label>
        <div v-if="submitErr" class="gb-err">{{ submitErr }}</div>
        <div v-if="submitOk" class="gb-ok">// 留言已发送</div>
        <button type="submit" :disabled="submitting" class="gb-btn">
          {{ submitting ? 'SENDING...' : 'SEND // 发送留言' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { siteApi, type GuestbookMessage } from '@/api/site'

const messages = ref<GuestbookMessage[]>([])
const loading = ref(true)
const submitting = ref(false)
const submitErr = ref('')
const submitOk = ref(false)
const form = reactive({
  name: '',
  body: ''
})

function getAvatar(name: string) {
  return name ? name[0].toUpperCase() : '?'
}

function formatTimeAgo(iso: string) {
  const diff = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`
  return `${Math.floor(diff / 86400)} 天前`
}

async function fetchMessages() {
  loading.value = true
  try {
    messages.value = await siteApi.getGuestbookMessages()
  } catch {
    messages.value = []
  } finally {
    loading.value = false
  }
}

async function submit() {
  submitErr.value = ''
  submitOk.value = false

  if (!form.name) {
    submitErr.value = '请先填写你的名字。'
    return
  }

  if (!form.body) {
    submitErr.value = '请先写下一句留言。'
    return
  }

  submitting.value = true

  try {
    await siteApi.createGuestbookMessage({
      name: form.name,
      body: form.body
    })
    submitOk.value = true
    form.name = ''
    form.body = ''
    await fetchMessages()
  } catch (error) {
    submitErr.value = error instanceof Error ? error.message : '发送失败，请稍后再试。'
  } finally {
    submitting.value = false
    window.setTimeout(() => {
      submitOk.value = false
    }, 3000)
  }
}

onMounted(() => {
  void fetchMessages()

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

  document.querySelectorAll('#guestbook .rv').forEach((element) => observer.observe(element))
})
</script>

<style lang="scss" scoped>
.gb-lead {
  font-family: 'Orbitron', monospace;
  font-size: 0.68rem;
  color: #00f5ff;
  letter-spacing: 3px;
  opacity: 0.6;
  margin-bottom: 32px;
}

.gb-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.gb-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 245, 255, 0.2);
  }
}

.gb-loading,
.gb-empty {
  font-family: monospace;
  font-size: 0.72rem;
  color: rgba(138, 170, 200, 0.4);
  letter-spacing: 2px;
  padding: 20px 0;
}

.gb-msg {
  background: #0a1520;
  border: 1px solid rgba(0, 245, 255, 0.08);
  padding: 14px 16px;
  transition: border-color 0.15s;

  &:hover {
    border-color: rgba(0, 245, 255, 0.25);
  }
}

.gb-msg-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.gb-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00f5ff, #7b2fff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  color: #000;
  flex-shrink: 0;
}

.gb-name {
  font-family: 'Orbitron', monospace;
  font-size: 0.65rem;
  color: #00f5ff;
  letter-spacing: 2px;
  flex: 1;
}

.gb-time {
  font-size: 0.6rem;
  color: rgba(138, 170, 200, 0.4);
  letter-spacing: 1px;
}

.gb-msg-body {
  font-size: 0.82rem;
  color: #8aaac8;
  line-height: 1.7;
}

.gb-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gb-field {
  position: relative;

  input,
  textarea {
    width: 100%;
    background: #0a1520;
    border: 1px solid rgba(0, 245, 255, 0.14);
    color: #eaf4ff;
    padding: 11px 14px;
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 0.85rem;
    outline: none;
    resize: none;
    display: block;
    transition: border-color 0.15s;

    &:focus {
      border-color: #00f5ff;
      box-shadow: 0 0 10px rgba(0, 245, 255, 0.1);
    }

    &::placeholder {
      color: rgba(138, 170, 200, 0.35);
    }
  }
}

.gb-count {
  position: absolute;
  right: 10px;
  bottom: 8px;
  font-size: 0.6rem;
  color: rgba(138, 170, 200, 0.3);
  font-family: monospace;
}

.gb-err {
  font-family: monospace;
  font-size: 0.7rem;
  color: #ff006e;
  letter-spacing: 1px;
}

.gb-ok {
  font-family: monospace;
  font-size: 0.7rem;
  color: #00f5ff;
  letter-spacing: 2px;
}

.gb-btn {
  padding: 11px 24px;
  font-family: 'Orbitron', monospace;
  font-size: 0.68rem;
  letter-spacing: 3px;
  background: #00f5ff;
  color: #000;
  border: none;
  cursor: pointer;
  font-weight: 700;
  box-shadow: 0 0 16px rgba(0, 245, 255, 0.3);
  transition: 0.15s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 245, 255, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
