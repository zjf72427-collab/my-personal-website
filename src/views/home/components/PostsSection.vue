<template>
  <section id="posts" class="w">
    <div class="sh rv"><span class="snum">05</span><h2 class="stit">BLOG</h2><div class="sl2"></div></div>
    <div class="pl">
      <a v-for="post in posts" :key="post.num" :href="post.href" :target="post.href !== '#' ? '_blank' : undefined" :rel="post.href !== '#' ? 'noopener' : undefined" class="pc rv" :class="{ 'pc-draft': post.href === '#' }">
        <div class="pnum">{{ post.num }}</div>
        <div>
          <div class="ptit">{{ post.title }}</div>
          <div class="pmeta">{{ post.date }} &middot; {{ post.time }}</div>
        </div>
        <span class="ptag" :class="post.tagClass">{{ post.tag }}</span>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
const posts = [
  { num: '01', title: '暗黑美学：为什么我迷上了这种风格', date: '2026-03-15', time: '5 min read', tag: '设计', tagClass: 'tc', href: '#' },
  { num: '02', title: '从零开始折腾自己的主页', date: '2026-03-10', time: '8 min read', tag: '技术', tagClass: 'ta', href: '#' },
  { num: '03', title: '2026年那些让我震撼的工具', date: '2026-03-01', time: '6 min read', tag: '随笔', tagClass: 'tp', href: '#' },
  { num: '04', title: 'CSS 动效的边界在哪里', date: '2026-02-20', time: '4 min read', tag: '技术', tagClass: 'ta', href: '#' },
  { num: '05', title: '深夜独自写代码是种什么体验', date: '2026-02-08', time: '3 min read', tag: '随笔', tagClass: 'tp', href: '#' },
]

onMounted(() => {
  const obs = new IntersectionObserver(
    es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('on') }),
    { threshold: .15 }
  )
  document.querySelectorAll('#posts .rv').forEach(el => obs.observe(el))
})
</script>

<style lang="scss" scoped>
.pl { display: flex; flex-direction: column; gap: 16px; }
.pc {
  background: #0a1520; border: 1px solid rgba(0,245,255,.07);
  padding: 22px 28px;
  display: grid; grid-template-columns: auto 1fr auto;
  align-items: center; gap: 20px;
  text-decoration: none; color: inherit;
  position: relative; overflow: hidden;
  transition: border-color .15s, transform .15s, background .3s;
  clip-path: polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%);
  &:hover {
    border-color: rgba(0,245,255,.35);
    background: #0f1e34;
    transform: translateX(6px);
    .ptit { color: #00f5ff; }
  }
  &::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: linear-gradient(180deg, #00f5ff, #7b2fff);
    transform: scaleY(0); transition: .15s;
  }
  &:hover::before { transform: scaleY(1); }
}
.pnum { font-family: 'Orbitron', monospace; font-size: 1.8rem; font-weight: 900; color: rgba(0,245,255,.1); line-height: 1; min-width: 40px; }
.ptit { font-size: .98rem; font-weight: 700; color: #eaf4ff; margin-bottom: 5px; transition: color .15s; }
.pmeta { font-size: .7rem; color: #8aaac8; letter-spacing: 1px; }
.ptag { padding: 4px 10px; font-size: .62rem; letter-spacing: 2px; border: 1px solid; text-transform: uppercase; font-family: 'Orbitron', monospace; white-space: nowrap; }
.tc { border-color: #00f5ff; color: #00f5ff; }
.tp { border-color: #ff006e; color: #ff006e; }
.ta { border-color: #7b2fff; color: #7b2fff; }
.pc-draft {
  .ptit::after { content: ' //草稿'; font-size: .6rem; color: rgba(138,170,200,.4); letter-spacing: 1px; font-family: monospace; }
  cursor: default;
}
@media (max-width: 768px) { .pc { grid-template-columns: 1fr; } .pnum { display: none; } }
</style>
