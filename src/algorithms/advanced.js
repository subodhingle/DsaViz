// ── Advanced Algorithm Engines ────────────────────────────────────────────────
// Each returns steps[] compatible with the visualizer step shape

// ── Counting Sort ─────────────────────────────────────────────────────────────
export function countingSort(arr) {
  const steps = []
  const a = [...arr]
  const max = Math.max(...a)
  const count = new Array(max + 1).fill(0)

  // Count phase
  for (let i = 0; i < a.length; i++) {
    count[a[i]]++
    steps.push({ array: [...a], comparing: [i], swapping: [], sorted: [], highlighted: [], pivot: null,
      highlightLine: 1, variables: { i, value: a[i], count: count[a[i]] } })
  }

  // Reconstruct
  let idx = 0
  const sorted = new Set()
  for (let v = 0; v <= max; v++) {
    while (count[v]-- > 0) {
      a[idx] = v
      sorted.add(idx)
      steps.push({ array: [...a], comparing: [], swapping: [idx], sorted: [...sorted], highlighted: [], pivot: null,
        highlightLine: 4, variables: { placing: v, at: idx } })
      idx++
    }
  }
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: a.map((_, i) => i), highlighted: [], pivot: null,
    highlightLine: 6, variables: { status: 'done' } })
  return steps
}

// ── Shell Sort ────────────────────────────────────────────────────────────────
export function shellSort(arr) {
  const steps = []
  const a = [...arr]
  let gap = Math.floor(a.length / 2)

  while (gap > 0) {
    for (let i = gap; i < a.length; i++) {
      let j = i
      steps.push({ array: [...a], comparing: [j, j - gap], swapping: [], sorted: [], highlighted: [i], pivot: null,
        highlightLine: 2, variables: { gap, i, j } })
      while (j >= gap && a[j - gap] > a[j]) {
        ;[a[j], a[j - gap]] = [a[j - gap], a[j]]
        steps.push({ array: [...a], comparing: [], swapping: [j, j - gap], sorted: [], highlighted: [], pivot: null,
          highlightLine: 3, variables: { gap, swapped: `[${j}]↔[${j - gap}]` } })
        j -= gap
      }
    }
    gap = Math.floor(gap / 2)
  }
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: a.map((_, i) => i), highlighted: [], pivot: null,
    highlightLine: 5, variables: { status: 'done' } })
  return steps
}

// ── Radix Sort (LSD) ──────────────────────────────────────────────────────────
export function radixSort(arr) {
  const steps = []
  const a = [...arr]
  const max = Math.max(...a)
  let exp = 1

  while (Math.floor(max / exp) > 0) {
    const output = new Array(a.length).fill(0)
    const count  = new Array(10).fill(0)

    for (let i = 0; i < a.length; i++) {
      const digit = Math.floor(a[i] / exp) % 10
      count[digit]++
      steps.push({ array: [...a], comparing: [i], swapping: [], sorted: [], highlighted: [], pivot: null,
        highlightLine: 2, variables: { exp, digit, i } })
    }
    for (let i = 1; i < 10; i++) count[i] += count[i - 1]
    for (let i = a.length - 1; i >= 0; i--) {
      const digit = Math.floor(a[i] / exp) % 10
      output[count[digit] - 1] = a[i]
      count[digit]--
    }
    for (let i = 0; i < a.length; i++) {
      a[i] = output[i]
      steps.push({ array: [...a], comparing: [], swapping: [i], sorted: [], highlighted: [], pivot: null,
        highlightLine: 4, variables: { exp, placing: a[i], at: i } })
    }
    exp *= 10
  }
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: a.map((_, i) => i), highlighted: [], pivot: null,
    highlightLine: 6, variables: { status: 'done' } })
  return steps
}

// ── Stack operations ──────────────────────────────────────────────────────────
export function stackOps(arr) {
  const steps = []
  const stack = []
  const ops = ['push', 'push', 'push', 'peek', 'pop', 'push', 'pop', 'pop']
  const vals = arr.slice(0, 5)
  let vi = 0

  for (const op of ops) {
    if (op === 'push' && vi < vals.length) {
      stack.push(vals[vi])
      steps.push({
        array: [...stack], comparing: [], swapping: [], sorted: [], highlighted: [stack.length - 1], pivot: null,
        highlightLine: 0, variables: { op: `push(${vals[vi]})`, stack: '[' + stack.join(',') + ']', top: stack[stack.length - 1] }
      })
      vi++
    } else if (op === 'pop' && stack.length > 0) {
      const popped = stack.pop()
      steps.push({
        array: [...stack], comparing: [], swapping: [stack.length], sorted: [], highlighted: [], pivot: null,
        highlightLine: 2, variables: { op: `pop() → ${popped}`, stack: '[' + stack.join(',') + ']', top: stack[stack.length - 1] ?? 'empty' }
      })
    } else if (op === 'peek' && stack.length > 0) {
      steps.push({
        array: [...stack], comparing: [stack.length - 1], swapping: [], sorted: [], highlighted: [stack.length - 1], pivot: null,
        highlightLine: 4, variables: { op: `peek() → ${stack[stack.length - 1]}`, stack: '[' + stack.join(',') + ']' }
      })
    }
  }
  return steps
}

// ── Queue operations ──────────────────────────────────────────────────────────
export function queueOps(arr) {
  const steps = []
  const queue = []
  const vals = arr.slice(0, 5)
  let vi = 0
  const ops = ['enqueue', 'enqueue', 'enqueue', 'front', 'dequeue', 'enqueue', 'dequeue']

  for (const op of ops) {
    if (op === 'enqueue' && vi < vals.length) {
      queue.push(vals[vi])
      steps.push({
        array: [...queue], comparing: [], swapping: [], sorted: [], highlighted: [queue.length - 1], pivot: null,
        highlightLine: 0, variables: { op: `enqueue(${vals[vi]})`, queue: '[' + queue.join(',') + ']', front: queue[0] }
      })
      vi++
    } else if (op === 'dequeue' && queue.length > 0) {
      const dequeued = queue.shift()
      steps.push({
        array: [...queue], comparing: [], swapping: [0], sorted: [], highlighted: [], pivot: null,
        highlightLine: 2, variables: { op: `dequeue() → ${dequeued}`, queue: '[' + queue.join(',') + ']', front: queue[0] ?? 'empty' }
      })
    } else if (op === 'front' && queue.length > 0) {
      steps.push({
        array: [...queue], comparing: [0], swapping: [], sorted: [], highlighted: [0], pivot: null,
        highlightLine: 4, variables: { op: `front() → ${queue[0]}`, queue: '[' + queue.join(',') + ']' }
      })
    }
  }
  return steps
}

// ── Sliding Window (max sum subarray of size k) ───────────────────────────────
export function slidingWindow(arr, k = 3) {
  const steps = []
  const a = [...arr]
  let windowSum = 0
  let maxSum = -Infinity
  let maxStart = 0

  for (let i = 0; i < k; i++) windowSum += a[i]
  maxSum = windowSum

  steps.push({ array: [...a], comparing: Array.from({ length: k }, (_, i) => i), swapping: [], sorted: [], highlighted: [], pivot: null,
    highlightLine: 1, variables: { window: `[0..${k - 1}]`, sum: windowSum, maxSum } })

  for (let i = k; i < a.length; i++) {
    windowSum += a[i] - a[i - k]
    steps.push({ array: [...a], comparing: Array.from({ length: k }, (_, j) => i - k + 1 + j), swapping: [], sorted: [], highlighted: [i], pivot: null,
      highlightLine: 3, variables: { window: `[${i - k + 1}..${i}]`, sum: windowSum, maxSum } })
    if (windowSum > maxSum) {
      maxSum = windowSum
      maxStart = i - k + 1
      steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: k }, (_, j) => maxStart + j), highlighted: [], pivot: null,
        highlightLine: 4, variables: { newMax: maxSum, window: `[${maxStart}..${maxStart + k - 1}]` } })
    }
  }
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: k }, (_, j) => maxStart + j), highlighted: [], pivot: null,
    highlightLine: 6, variables: { maxSum, window: `[${maxStart}..${maxStart + k - 1}]`, status: 'done' } })
  return steps
}

// ── Two Pointers (pair sum = target) ─────────────────────────────────────────
export function twoPointers(arr, target) {
  const steps = []
  const sorted = [...arr].sort((a, b) => a - b)
  let left = 0, right = sorted.length - 1

  while (left < right) {
    const sum = sorted[left] + sorted[right]
    steps.push({ array: sorted, comparing: [left, right], swapping: [], sorted: [], highlighted: [], pivot: null,
      highlightLine: 2, variables: { left, right, sum, target, diff: sum - target } })
    if (sum === target) {
      steps.push({ array: sorted, comparing: [], swapping: [], sorted: [left, right], highlighted: [left, right], pivot: null,
        highlightLine: 3, variables: { found: `arr[${left}]+arr[${right}]=${target}` } })
      break
    } else if (sum < target) {
      left++
      steps.push({ array: sorted, comparing: [left], swapping: [], sorted: [], highlighted: [], pivot: null,
        highlightLine: 4, variables: { action: 'move left →', left, right } })
    } else {
      right--
      steps.push({ array: sorted, comparing: [right], swapping: [], sorted: [], highlighted: [], pivot: null,
        highlightLine: 5, variables: { action: '← move right', left, right } })
    }
  }
  return steps
}

// ── 0/1 Knapsack DP ──────────────────────────────────────────────────────────
export function knapsack(arr) {
  // arr values used as weights, capacity = arr.length * 3
  const weights = arr.slice(0, 6).map(v => Math.max(1, Math.floor(v / 10)))
  const values  = arr.slice(0, 6).map(v => Math.max(1, Math.floor(v / 8)))
  const n = weights.length
  const W = Math.min(n * 3, 15)
  const steps = []

  const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0))

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1])
      } else {
        dp[i][w] = dp[i - 1][w]
      }
      // Represent dp row as array for visualization
      steps.push({
        array: dp[i].slice(0, W + 1),
        comparing: [w], swapping: [], sorted: [], highlighted: [], pivot: null,
        highlightLine: dp[i][w] > dp[i - 1][w] ? 3 : 5,
        variables: { item: i, weight: weights[i - 1], value: values[i - 1], capacity: w, dp_iw: dp[i][w] }
      })
    }
  }
  steps.push({
    array: dp[n].slice(0, W + 1),
    comparing: [], swapping: [], sorted: [W], highlighted: [W], pivot: null,
    highlightLine: 7,
    variables: { maxValue: dp[n][W], capacity: W, status: 'done' }
  })
  return steps
}
