<template>
  <section id="contact" class="w">
    <div class="sh rv"><span class="snum">06</span><h2 class="stit">CONTACT</h2><div class="sl2"></div></div>
    <div class="cw">
      <div class="ci rv">
        <p>有什么想聊的？无论是合作、交流还是随便说说，都欢迎。信号已就绪，等待连接。</p>
        <div class="socials">
          <a href="mailto:your@email.com" class="soc"><span>📧</span>&nbsp; EMAIL</a>
          <a href="https://x.com/" target="_blank" rel="noopener" class="soc"><span>🐦</span>&nbsp; TWITTER / X</a>
          <a href="https://github.com/" target="_blank" rel="noopener" class="soc"><span>💻</span>&nbsp; GITHUB</a>
          <a href="https://okjike.com/" target="_blank" rel="noopener" class="soc"><span>📝</span>&nbsp; 即刻</a>
        </div>
      </div>
      <form class="cf rv" @submit.prevent="handleSubmit">
        <div class="fg"><input type="text" id="nm" v-model="form.name" placeholder="x" /><label for="nm">你的名字</label></div>
        <div class="fg"><input type="email" id="em" v-model="form.email" placeholder="x" /><label for="em">邮箱地址</label></div>
        <div class="fg"><textarea id="mg" v-model="form.msg" placeholder="x"></textarea><label for="mg">想说的话</label></div>
        <div v-if="sent" class="sent-tip">// 信号已发射，等待回响 ✓</div>
        <button type="submit" class="btn bp" style="width:100%">发送信号 // SEND</button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
const form = reactive({ name: '', email: '', msg: '' })
const sent = ref(false)
function handleSubmit() {
  if (!form.name || !form.email || !form.msg) return
  const subject = encodeURIComponent(`来自主页的消息 — ${form.name}`)
  const body = encodeURIComponent(`姓名：${form.name}\n邮箱：${form.email}\n\n${form.msg}`)
  window.location.href = `mailto:your@email.com?subject=${subject}&body=${body}`
  sent.value = true
  setTimeout(() => { sent.value = false }, 4000)
  form.name = ''
  form.email = ''
  form.msg = ''
}
onMounted(() => {
  const obs = new IntersectionObserver(
    es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('on') }),
    { threshold: .15 }
  )
  document.querySelectorAll('#contact .rv').forEach(el => obs.observe(el))
})
</script>

<style lang="scss" scoped>
.cw { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: start; }
.ci p { color: #8aaac8; line-height: 1.9; margin-bottom: 26px; font-size: .92rem; }
.socials { display: flex; flex-direction: column; gap: 9px; }
.soc {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; border: 1px solid rgba(0,245,255,.1);
  text-decoration: none; color: #8aaac8; font-size: .8rem; letter-spacing: 2px;
  transition: .15s; clip-path: polygon(7px 0,100% 0,calc(100% - 7px) 100%,0 100%);
  &:hover { border-color: #00f5ff; color: #00f5ff; background: rgba(0,245,255,.05); transform: translateX(5px); }
}
.cf { display: flex; flex-direction: column; gap: 12px; }
.fg { position: relative; }
.fg input, .fg textarea {
  width: 100%; background: #0a1520; border: 1px solid rgba(0,245,255,.14);
  color: #eaf4ff; padding: 12px 15px; font-family: 'Noto Sans SC', sans-serif;
  font-size: .87rem; outline: none; transition: .15s; resize: none; display: block;
  &:focus { border-color: #00f5ff; box-shadow: 0 0 12px rgba(0,245,255,.13); }
  &::placeholder { color: transparent; }
}
.fg textarea { height: 105px; }
.fg label {
  position: absolute; left: 15px; top: 13px; color: #8aaac8;
  font-size: .83rem; pointer-events: none; transition: .2s;
}
.fg input:focus ~ label, .fg input:not(:placeholder-shown) ~ label,
.fg textarea:focus ~ label, .fg textarea:not(:placeholder-shown) ~ label {
  top: -9px; left: 9px; font-size: .67rem; color: #00f5ff; background: #060c14; padding: 0 5px;
}
.btn { padding: 12px 30px; font-family: 'Orbitron', monospace; font-size: .7rem; letter-spacing: 3px; text-transform: uppercase; cursor: pointer; border: none; font-weight: 700; transition: .12s; &:hover { transform: translateY(-2px); } }
.bp { background: #00f5ff; color: #000; box-shadow: 0 0 20px rgba(0,245,255,.3); }
.sent-tip {
  font-family: monospace; font-size: .72rem; color: #00f5ff;
  letter-spacing: 2px; padding: 8px 12px;
  border: 1px solid rgba(0,245,255,.25); background: rgba(0,245,255,.05);
  animation: fadeIn .3s ease;
}
@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
@media (max-width: 768px) { .cw { grid-template-columns: 1fr; } }
</style>
