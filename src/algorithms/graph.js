// Step shape: { visited, queue/stack, current, path, distances, highlightLine, variables }

export function bfs(nodes, edges, source) {
  const steps = []
  const adj = buildAdj(nodes, edges)
  const visited = new Set()
  const queue = [source]
  const path = []
  visited.add(source)

  while (queue.length > 0) {
    const node = queue.shift()
    path.push(node)
    steps.push({ visited: [...visited], queue: [...queue], stack: [], current: node, path: [...path], highlightLine: 2, variables: { node, queue: [...queue].join(',') } })
    for (const neighbor of (adj[node] || [])) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)
        steps.push({ visited: [...visited], queue: [...queue], stack: [], current: node, path: [...path], highlightLine: 4, variables: { node, neighbor, queue: [...queue].join(',') } })
      }
    }
  }
  return steps
}

export function dfs(nodes, edges, source) {
  const steps = []
  const adj = buildAdj(nodes, edges)
  const visited = new Set()
  const stack = [source]
  const path = []

  while (stack.length > 0) {
    const node = stack.pop()
    if (visited.has(node)) continue
    visited.add(node)
    path.push(node)
    steps.push({ visited: [...visited], queue: [], stack: [...stack], current: node, path: [...path], highlightLine: 2, variables: { node, stack: [...stack].join(',') } })
    for (const neighbor of (adj[node] || []).reverse()) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor)
        steps.push({ visited: [...visited], queue: [], stack: [...stack], current: node, path: [...path], highlightLine: 4, variables: { node, neighbor } })
      }
    }
  }
  return steps
}

export function dijkstra(nodes, edges, source) {
  const steps = []
  const dist = {}
  const prev = {}
  const visited = new Set()
  nodes.forEach(n => { dist[n.id] = Infinity; prev[n.id] = null })
  dist[source] = 0
  const pq = [...nodes.map(n => n.id)]

  while (pq.length > 0) {
    pq.sort((a, b) => dist[a] - dist[b])
    const u = pq.shift()
    if (dist[u] === Infinity) break
    visited.add(u)
    steps.push({ visited: [...visited], queue: [...pq], stack: [], current: u, path: getPath(prev, source, u), distances: { ...dist }, highlightLine: 3, variables: { u, dist_u: dist[u] } })
    for (const edge of edges.filter(e => e.source === u || e.target === u)) {
      const v = edge.source === u ? edge.target : edge.source
      if (visited.has(v)) continue
      const alt = dist[u] + (edge.weight || 1)
      if (alt < dist[v]) {
        dist[v] = alt
        prev[v] = u
        steps.push({ visited: [...visited], queue: [...pq], stack: [], current: u, path: getPath(prev, source, v), distances: { ...dist }, highlightLine: 5, variables: { u, v, alt, dist_v: dist[v] } })
      }
    }
  }
  return steps
}

export function aStar(nodes, edges, source, target) {
  const steps = []
  const h = (id) => {
    const n = nodes.find(n => n.id === id)
    const t = nodes.find(n => n.id === target)
    if (!n || !t) return 0
    return Math.abs(n.x - t.x) + Math.abs(n.y - t.y)
  }
  const gScore = {}
  const fScore = {}
  const prev = {}
  const visited = new Set()
  nodes.forEach(n => { gScore[n.id] = Infinity; fScore[n.id] = Infinity })
  gScore[source] = 0
  fScore[source] = h(source)
  const open = new Set([source])

  while (open.size > 0) {
    const current = [...open].reduce((a, b) => fScore[a] < fScore[b] ? a : b)
    if (current === target) {
      steps.push({ visited: [...visited], queue: [...open], stack: [], current, path: getPath(prev, source, target), distances: { ...gScore }, highlightLine: 8, variables: { current, target, found: true } })
      break
    }
    open.delete(current)
    visited.add(current)
    steps.push({ visited: [...visited], queue: [...open], stack: [], current, path: getPath(prev, source, current), distances: { ...gScore }, highlightLine: 3, variables: { current, f: fScore[current].toFixed(1) } })
    for (const edge of edges.filter(e => e.source === current || e.target === current)) {
      const neighbor = edge.source === current ? edge.target : edge.source
      if (visited.has(neighbor)) continue
      const tentative = gScore[current] + (edge.weight || 1)
      if (tentative < gScore[neighbor]) {
        prev[neighbor] = current
        gScore[neighbor] = tentative
        fScore[neighbor] = tentative + h(neighbor)
        open.add(neighbor)
        steps.push({ visited: [...visited], queue: [...open], stack: [], current, path: getPath(prev, source, neighbor), distances: { ...gScore }, highlightLine: 6, variables: { neighbor, g: tentative, f: fScore[neighbor].toFixed(1) } })
      }
    }
  }
  return steps
}

function buildAdj(nodes, edges) {
  const adj = {}
  nodes.forEach(n => { adj[n.id] = [] })
  edges.forEach(e => {
    adj[e.source] = adj[e.source] || []
    adj[e.target] = adj[e.target] || []
    adj[e.source].push(e.target)
    adj[e.target].push(e.source)
  })
  return adj
}

function getPath(prev, source, target) {
  const path = []
  let cur = target
  while (cur !== null && cur !== undefined) {
    path.unshift(cur)
    cur = prev[cur]
    if (cur === source) { path.unshift(source); break }
  }
  return path
}
