<template>
  <section id="contact" class="w">
    <div class="sh rv">
      <span class="snum">06</span>
      <h2 class="stit">CONTACT</h2>
      <div class="sl2"></div>
    </div>
    <div class="cw">
      <div class="ci rv">
        <p>
          如果你想聊项目合作、技术交流、站点反馈，或者只是想打个招呼，都可以直接给我发消息。
          这个入口会把内容送进站内收件箱，我会在看到后回复。
        </p>
        <div class="contact-notes">
          <div class="note-item">
            <span class="note-key">合作</span>
            <span class="note-val">Web 前端、交互页面、个人站点改造</span>
          </div>
          <div class="note-item">
            <span class="note-key">交流</span>
            <span class="note-val">网络工程、知识管理、实验型项目</span>
          </div>
          <div class="note-item">
            <span class="note-key">备注</span>
            <span class="note-val">建议留下常用邮箱，方便我回信</span>
          </div>
        </div>
      </div>

      <form class="cf rv" @submit.prevent="handleSubmit">
        <div class="fg">
          <input id="nm" v-model.trim="form.name" type="text" placeholder="x" />
          <label for="nm">你的名字</label>
        </div>
        <div class="fg">
          <input id="em" v-model.trim="form.email" type="email" placeholder="x" />
          <label for="em">邮箱地址</label>
        </div>
        <div class="fg">
          <textarea id="mg" v-model.trim="form.message" placeholder="x"></textarea>
          <label for="mg">想说的话</label>
        </div>
        <div v-if="errorMessage" class="error-tip">{{ errorMessage }}</div>
        <div v-if="successMessage" class="sent-tip">{{ successMessage }}</div>
        <button type="submit" class="btn bp" :disabled="submitting" style="width: 100%">
          {{ submitting ? 'SENDING...' : 'SEND // 发送消息' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { siteApi } from '@/api/site'

const form = reactive({
  name: '',
  email: '',
  message: ''
})

const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.name || !form.email || !form.message) {
    errorMessage.value = '请完整填写名字、邮箱和内容。'
    return
  }

  submitting.value = true

  try {
    await siteApi.createContactMessage(form)
    successMessage.value = '// 消息已发送，我会尽快查看。'
    form.name = ''
    form.email = ''
    form.message = ''
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '发送失败，请稍后重试。'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
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

  document.querySelectorAll('#contact .rv').forEach((element) => observer.observe(element))
})
</script>

<style lang="scss" scoped>
.cw {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  align-items: start;
}

.ci p {
  color: #8aaac8;
  line-height: 1.9;
  margin-bottom: 26px;
  font-size: 0.92rem;
}

.contact-notes {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.note-item {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid rgba(0, 245, 255, 0.1);
  color: #8aaac8;
  font-size: 0.8rem;
  letter-spacing: 1px;
  clip-path: polygon(7px 0, 100% 0, calc(100% - 7px) 100%, 0 100%);
}

.note-key {
  color: #00f5ff;
  font-family: 'Orbitron', monospace;
}

.cf {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fg {
  position: relative;
}

.fg input,
.fg textarea {
  width: 100%;
  background: #0a1520;
  border: 1px solid rgba(0, 245, 255, 0.14);
  color: #eaf4ff;
  padding: 12px 15px;
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 0.87rem;
  outline: none;
  transition: 0.15s;
  resize: none;
  display: block;

  &:focus {
    border-color: #00f5ff;
    box-shadow: 0 0 12px rgba(0, 245, 255, 0.13);
  }

  &::placeholder {
    color: transparent;
  }
}

.fg textarea {
  height: 120px;
}

.fg label {
  position: absolute;
  left: 15px;
  top: 13px;
  color: #8aaac8;
  font-size: 0.83rem;
  pointer-events: none;
  transition: 0.2s;
}

.fg input:focus ~ label,
.fg input:not(:placeholder-shown) ~ label,
.fg textarea:focus ~ label,
.fg textarea:not(:placeholder-shown) ~ label {
  top: -9px;
  left: 9px;
  font-size: 0.67rem;
  color: #00f5ff;
  background: #060c14;
  padding: 0 5px;
}

.btn {
  padding: 12px 30px;
  font-family: 'Orbitron', monospace;
  font-size: 0.7rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: pointer;
  border: none;
  font-weight: 700;
  transition: 0.12s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
}

.bp {
  background: #00f5ff;
  color: #000;
  box-shadow: 0 0 20px rgba(0, 245, 255, 0.3);
}

.sent-tip,
.error-tip {
  font-family: monospace;
  font-size: 0.72rem;
  letter-spacing: 2px;
  padding: 8px 12px;
  animation: fadeIn 0.3s ease;
}

.sent-tip {
  color: #00f5ff;
  border: 1px solid rgba(0, 245, 255, 0.25);
  background: rgba(0, 245, 255, 0.05);
}

.error-tip {
  color: #ff006e;
  border: 1px solid rgba(255, 0, 110, 0.25);
  background: rgba(255, 0, 110, 0.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 768px) {
  .cw {
    grid-template-columns: 1fr;
  }
}
</style>
