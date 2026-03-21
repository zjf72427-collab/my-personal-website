<template>
  <section id="geek" class="w">
    <div class="sh rv"><span class="snum">03</span><h2 class="stit">GEEK SPACE</h2><div class="sl2"></div></div>
    <p class="sec-desc rv">极客空间 — 算法笔记与代码实验场</p>
    <div class="algo-list">
      <div v-for="algo in algos" :key="algo.name" class="algo-card rv">
        <div class="algo-header" @click="algo.open = !algo.open">
          <div class="algo-left">
            <span class="algo-icon">{{ algo.icon }}</span>
            <div>
              <div class="algo-name">{{ algo.name }}</div>
              <div class="algo-meta">{{ algo.complexity }} &nbsp;|&nbsp; {{ algo.tag }}</div>
            </div>
          </div>
          <span class="algo-toggle" :class="{ open: algo.open }">▶</span>
        </div>
        <transition name="slide">
          <div v-if="algo.open" class="algo-body">
            <p class="algo-desc">{{ algo.desc }}</p>
            <pre class="algo-code"><code>{{ algo.code }}</code></pre>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const algos = reactive([
  {
    icon: '⚡',
    name: '希尔排序 Shell Sort',
    complexity: 'O(n log²n)',
    tag: '排序算法',
    open: false,
    desc: '希尔排序是插入排序的改进版本。通过设置间隔序列，先对较远的元素进行比较和交换，逐步缩小间隔直到为 1，最终完成排序。相比普通插入排序，大幅减少了移动次数。',
    code: `function shellSort(arr) {
  let gap = Math.floor(arr.length / 2)
  while (gap > 0) {
    for (let i = gap; i < arr.length; i++) {
      let temp = arr[i]
      let j = i
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap]
        j -= gap
      }
      arr[j] = temp
    }
    gap = Math.floor(gap / 2)
  }
  return arr
}`,
  },
  {
    icon: '🔀',
    name: '归并排序 Merge Sort',
    complexity: 'O(n log n)',
    tag: '分治算法',
    open: false,
    desc: '归并排序采用分治策略：将数组递归地分成两半，分别排序后再合并。时间复杂度稳定为 O(n log n)，是稳定排序算法，适合链表排序和外部排序场景。',
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr
  const mid = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))
  return merge(left, right)
}

function merge(left, right) {
  const result = []
  let i = 0, j = 0
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++])
    else result.push(right[j++])
  }
  return result.concat(left.slice(i)).concat(right.slice(j))
}`,
  },
  {
    icon: '🎯',
    name: '快速排序 Quick Sort',
    complexity: 'O(n log n) avg',
    tag: '分治算法',
    open: false,
    desc: '快速排序选取基准元素（pivot），将数组分为小于和大于基准的两部分，递归排序。平均时间复杂度 O(n log n)，原地排序，实践中通常是最快的通用排序算法。',
    code: `function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return arr
  const pivot = partition(arr, lo, hi)
  quickSort(arr, lo, pivot - 1)
  quickSort(arr, pivot + 1, hi)
  return arr
}

function partition(arr, lo, hi) {
  const pivot = arr[hi]
  let i = lo - 1
  for (let j = lo; j < hi; j++) {
    if (arr[j] <= pivot) {
      i++
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }
  ;[arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]]
  return i + 1
}`,
  },
])

onMounted(() => {
  const obs = new IntersectionObserver(
    es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('on') }),
    { threshold: .1 }
  )
  document.querySelectorAll('#geek .rv').forEach(el => obs.observe(el))

  // Syntax highlight all code blocks
  try {
    const hljs = require('highlight.js')
    document.querySelectorAll('#geek .algo-code code').forEach((block: Element) => {
      hljs.highlightElement(block as HTMLElement)
    })
  } catch {}
})
</script>

<style lang="scss">
@import 'highlight.js/styles/base16/material-darker.css';
</style>
<style lang="scss" scoped>
.sec-desc { color: #8aaac8; font-size: .85rem; letter-spacing: 1px; margin-bottom: 32px; }
.algo-list { display: flex; flex-direction: column; gap: 16px; }
.algo-card {
  background: #0a1520; border: 1px solid rgba(0,245,255,.08);
  position: relative; transition: border-color .15s;
  &::after {
    content: ''; position: absolute; bottom: 0; right: 0;
    width: 0; height: 0; border-style: solid;
    border-width: 0 0 10px 10px;
    border-color: transparent transparent var(--page-bg, #060c14) transparent;
    z-index: 1;
  }
  &:hover { border-color: rgba(0,245,255,.3); }
}
.algo-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px; cursor: pointer;
  &:hover .algo-name { color: #00f5ff; }
}
.algo-left { display: flex; align-items: center; gap: 16px; }
.algo-icon { font-size: 1.4rem; }
.algo-name {
  font-family: 'Orbitron', monospace; font-size: .82rem;
  color: #eaf4ff; letter-spacing: 2px; margin-bottom: 4px; transition: color .15s;
}
.algo-meta { font-size: .68rem; color: #8aaac8; letter-spacing: 1px; }
.algo-toggle {
  color: #00f5ff; font-size: .7rem; transition: transform .25s;
  &.open { transform: rotate(90deg); }
}
.algo-body { padding: 0 24px 20px; border-top: 1px solid rgba(0,245,255,.06); }
.algo-desc { color: #8aaac8; font-size: .85rem; line-height: 1.9; margin: 16px 0 14px; }
.algo-code {
  background: #060c14; border: 1px solid rgba(0,245,255,.1);
  border-left: 3px solid #00f5ff;
  padding: 16px 20px; overflow-x: auto;
  code { font-family: 'Courier New', monospace; font-size: .78rem; color: #00f5ff; line-height: 1.7; white-space: pre; }
}
.slide-enter-active { transition: max-height .35s ease, opacity .3s; overflow: hidden; max-height: 600px; }
.slide-leave-active { transition: max-height .2s ease, opacity .2s; overflow: hidden; max-height: 600px; }
.slide-enter-from, .slide-leave-to { max-height: 0 !important; opacity: 0; }
.slide-enter-to, .slide-leave-from { max-height: 600px; opacity: 1; }
</style>
