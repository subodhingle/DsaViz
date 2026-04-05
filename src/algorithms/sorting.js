// Each algorithm returns an array of steps for the visualizer
// Step shape: { array, comparing, swapping, sorted, pivot, highlightLine, variables, comparisons, swaps }

export function bubbleSort(arr) {
  const steps = []
  const a = [...arr]
  let comparisons = 0, swaps = 0
  const sorted = new Set()

  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - 1 - i; j++) {
      comparisons++
      steps.push({ array: [...a], comparing: [j, j + 1], swapping: [], sorted: [...sorted], highlightLine: 3, variables: { i, j, comparisons, swaps } })
      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        swaps++
        steps.push({ array: [...a], comparing: [], swapping: [j, j + 1], sorted: [...sorted], highlightLine: 4, variables: { i, j, comparisons, swaps } })
      }
    }
    sorted.add(a.length - 1 - i)
  }
  sorted.add(0)
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...sorted], highlightLine: 7, variables: { comparisons, swaps } })
  return steps
}

export function mergeSort(arr) {
  const steps = []
  const a = [...arr]
  let comparisons = 0, swaps = 0

  function merge(arr, l, m, r) {
    const left = arr.slice(l, m + 1)
    const right = arr.slice(m + 1, r + 1)
    let i = 0, j = 0, k = l
    while (i < left.length && j < right.length) {
      comparisons++
      steps.push({ array: [...arr], comparing: [l + i, m + 1 + j], swapping: [], sorted: [], highlightLine: 5, variables: { l, m, r, i, j, comparisons, swaps } })
      if (left[i] <= right[j]) { arr[k++] = left[i++] }
      else { arr[k++] = right[j++]; swaps++ }
      steps.push({ array: [...arr], comparing: [], swapping: [k - 1], sorted: [], highlightLine: 6, variables: { l, m, r, comparisons, swaps } })
    }
    while (i < left.length) { arr[k++] = left[i++] }
    while (j < right.length) { arr[k++] = right[j++] }
  }

  function sort(arr, l, r) {
    if (l >= r) return
    const m = Math.floor((l + r) / 2)
    sort(arr, l, m)
    sort(arr, m + 1, r)
    merge(arr, l, m, r)
  }

  sort(a, 0, a.length - 1)
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: a.map((_, i) => i), highlightLine: 9, variables: { comparisons, swaps } })
  return steps
}

export function quickSort(arr) {
  const steps = []
  const a = [...arr]
  let comparisons = 0, swaps = 0
  const sorted = new Set()

  function partition(arr, low, high) {
    const pivot = arr[high]
    let i = low - 1
    steps.push({ array: [...arr], comparing: [], swapping: [], sorted: [...sorted], pivot: high, highlightLine: 2, variables: { pivot, i, low, high, comparisons, swaps } })
    for (let j = low; j < high; j++) {
      comparisons++
      steps.push({ array: [...arr], comparing: [j, high], swapping: [], sorted: [...sorted], pivot: high, highlightLine: 4, variables: { pivot, i, j, comparisons, swaps } })
      if (arr[j] <= pivot) {
        i++
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        swaps++
        steps.push({ array: [...arr], comparing: [], swapping: [i, j], sorted: [...sorted], pivot: high, highlightLine: 5, variables: { pivot, i, j, comparisons, swaps } })
      }
    }
    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    swaps++
    steps.push({ array: [...arr], comparing: [], swapping: [i + 1, high], sorted: [...sorted], pivot: i + 1, highlightLine: 6, variables: { comparisons, swaps } })
    return i + 1
  }

  function sort(arr, low, high) {
    if (low < high) {
      const pi = partition(arr, low, high)
      sorted.add(pi)
      sort(arr, low, pi - 1)
      sort(arr, pi + 1, high)
    }
  }

  sort(a, 0, a.length - 1)
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: a.map((_, i) => i), highlightLine: 9, variables: { comparisons, swaps } })
  return steps
}

export function heapSort(arr) {
  const steps = []
  const a = [...arr]
  let comparisons = 0, swaps = 0
  const sorted = new Set()

  function heapify(arr, n, i) {
    let largest = i
    const l = 2 * i + 1
    const r = 2 * i + 2
    comparisons++
    steps.push({ array: [...arr], comparing: [i, l < n ? l : i], swapping: [], sorted: [...sorted], highlightLine: 2, variables: { i, largest, n, comparisons, swaps } })
    if (l < n && arr[l] > arr[largest]) largest = l
    if (r < n && arr[r] > arr[largest]) largest = r
    if (largest !== i) {
      ;[arr[i], arr[largest]] = [arr[largest], arr[i]]
      swaps++
      steps.push({ array: [...arr], comparing: [], swapping: [i, largest], sorted: [...sorted], highlightLine: 4, variables: { i, largest, comparisons, swaps } })
      heapify(arr, n, largest)
    }
  }

  const n = a.length
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(a, n, i)
  for (let i = n - 1; i > 0; i--) {
    ;[a[0], a[i]] = [a[i], a[0]]
    swaps++
    sorted.add(i)
    steps.push({ array: [...a], comparing: [], swapping: [0, i], sorted: [...sorted], highlightLine: 7, variables: { i, comparisons, swaps } })
    heapify(a, i, 0)
  }
  sorted.add(0)
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...sorted], highlightLine: 9, variables: { comparisons, swaps } })
  return steps
}
