# 核心算法库

> 排序 · 动态规划 · 贪心 · 数据结构

---

## 希尔排序 Shell Sort

**时间复杂度**：O(n log²n) ~ O(n^1.5)，取决于增量序列

插入排序的改进版。按步长 gap 分组，对每组做插入排序，逐步缩小 gap 至 1。大步长时移动距离远，消除大范围逆序；最终步长为 1 时数组已近乎有序，插入排序退化为 O(n)。

```javascript
function shellSort(arr) {
  let gap = Math.floor(arr.length / 2)
  while (gap > 0) {
    for (let i = gap; i < arr.length; i++) {
      const tmp = arr[i]
      let j = i
      while (j >= gap && arr[j - gap] > tmp) {
        arr[j] = arr[j - gap]
        j -= gap
      }
      arr[j] = tmp
    }
    gap = Math.floor(gap / 2)  // Knuth: gap = (gap-1)/3
  }
  return arr
}

// 测试
console.log(shellSort([8, 3, 7, 1, 5, 2, 9, 4]))
// => [1, 2, 3, 4, 5, 7, 8, 9]
```

**特性**：不稳定 · 原地排序 · Hibbard 增量序列可达 O(n^1.5)

---

## 归并排序 Merge Sort

**时间复杂度**：O(n log n) 稳定 · **空间**：O(n)

分治策略：递归二分 → 合并两个有序子数组。时间复杂度在最好/最坏/平均情况下均为 O(n log n)，是**稳定排序**中性能最优的算法。

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr
  const mid = Math.floor(arr.length / 2)
  const left  = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))
  return merge(left, right)
}

function merge(L, R) {
  const result = []
  let i = 0, j = 0
  while (i < L.length && j < R.length) {
    // <= 保证稳定性：相等时优先取左边
    result.push(L[i] <= R[j] ? L[i++] : R[j++])
  }
  return result.concat(L.slice(i), R.slice(j))
}
```

**适用场景**：链表排序（无需随机访问）· 外部排序（磁盘大文件）· 需要稳定排序

---

## 快速排序 Quick Sort

**平均**：O(n log n) · **最坏**：O(n²) · **空间**：O(log n) 栈

选 pivot 分区，小于 pivot 放左，大于放右，递归两侧。随机化选 pivot 可将最坏情况概率降至极低。实践中是**最快的通用内排序算法**（缓存友好、常数小）。

```javascript
function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return arr
  // 随机化 pivot，防止已排序输入退化为 O(n^2)
  const ri = lo + Math.floor(Math.random() * (hi - lo + 1))
  ;[arr[ri], arr[hi]] = [arr[hi], arr[ri]]
  const p = partition(arr, lo, hi)
  quickSort(arr, lo, p - 1)
  quickSort(arr, p + 1, hi)
  return arr
}

function partition(arr, lo, hi) {
  const pivot = arr[hi]
  let i = lo
  for (let j = lo; j < hi; j++) {
    if (arr[j] <= pivot) {
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      i++
    }
  }
  ;[arr[i], arr[hi]] = [arr[hi], arr[i]]
  return i
}
```

**三路快排**（处理大量重复元素）：将数组分为 < pivot、== pivot、> pivot 三段，相等元素一次处理完毕。

---

## 吉普车问题 Jeep Problem

**贪心** · 调和级数

**问题**：沙漠中有无限燃料供给点（起点），吉普车油箱容量为 1。可在途中缓存燃料。问 n 满罐燃料最远能到达多远？

**结论**：n 罐燃料最远距离为调和级数前 n 项和的一半：

$$d(n) = \frac{1}{2} + \frac{1}{4} + \frac{1}{6} + \cdots + \frac{1}{2n} = \frac{H_n}{2}$$

```javascript
function jeepMaxDistance(n) {
  // 贪心策略：从最远缓存点逐步向后推算
  // 第 k 段（从后往前第 k 段）长度 = 1/(2k)
  let distance = 0
  for (let k = 1; k <= n; k++) {
    distance += 1 / (2 * k)
  }
  return distance
}

// n=1: 0.5, n=2: 0.5+0.25=0.75, n=10: ~1.46
console.log(jeepMaxDistance(10).toFixed(4)) // 1.4640
```

由于调和级数发散（$H_n \to \infty$），理论上有足够燃料可以走任意远。
