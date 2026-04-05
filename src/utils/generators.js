export function generateArray(size = 20, min = 5, max = 100) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

export function generateGraph(nodeCount = 7) {
  // Fixed circular layout — nodes evenly spaced, start from top
  // SVG canvas: 600 × 500, center: 300, 250, radius: 180
  const CX = 300, CY = 250, R = 180
  const nodes = Array.from({ length: nodeCount }, (_, i) => {
    const angle = (i / nodeCount) * 2 * Math.PI - Math.PI / 2
    return {
      id: i,
      label: String.fromCharCode(65 + i),
      x: Math.round(CX + Math.cos(angle) * R),
      y: Math.round(CY + Math.sin(angle) * R),
    }
  })

  const edges = []
  const edgeSet = new Set()

  const addEdge = (a, b) => {
    if (a === b) return
    const key = `${Math.min(a, b)}-${Math.max(a, b)}`
    if (!edgeSet.has(key)) {
      edgeSet.add(key)
      edges.push({ source: a, target: b, weight: Math.floor(Math.random() * 9) + 1 })
    }
  }

  // Ring — guarantees full connectivity
  for (let i = 0; i < nodeCount; i++) addEdge(i, (i + 1) % nodeCount)

  // 2–3 cross-edges only (skip adjacent ring nodes to avoid clutter)
  const maxCross = nodeCount <= 6 ? 2 : 3
  let tries = 0
  while (edges.length < nodeCount + maxCross && tries < 60) {
    tries++
    const a = Math.floor(Math.random() * nodeCount)
    const b = Math.floor(Math.random() * nodeCount)
    const diff = Math.abs(a - b)
    if (diff > 1 && diff < nodeCount - 1) addEdge(a, b)
  }

  return { nodes, edges }
}

export function generateBSTValues(count = 10) {
  const vals = new Set()
  while (vals.size < count) vals.add(Math.floor(Math.random() * 90) + 10)
  return [...vals]
}

export const defaultUserCode = `// ── Custom Algorithm Builder ──────────────────────
// Available API:
//   compare(i, j)  → true if arr[i] > arr[j]  [amber]
//   swap(i, j)     → swaps arr[i] ↔ arr[j]    [red]
//   set(i, value)  → sets arr[i] = value       [blue]
//   highlight(i)   → highlights index i        [blue]
//   mark(i)        → marks i as sorted         [green]
//   markAll()      → marks all as done         [green]
//   pivot(i)       → marks i as pivot          [violet]
//   log(msg)       → prints to execution log
//   setVar(k, v)   → tracks variable in panel
//   n              → array length
//   arr            → copy of current array
// ──────────────────────────────────────────────────

// Bubble Sort — edit this or write your own!
log("Starting Bubble Sort on " + n + " elements");

for (let i = 0; i < n - 1; i++) {
  setVar("pass", i + 1);
  for (let j = 0; j < n - 1 - i; j++) {
    setVar("j", j);
    if (compare(j, j + 1)) {
      swap(j, j + 1);
    }
  }
  mark(n - 1 - i);
}
mark(0);
log("Done!");`
