import { describe, it, expect } from 'vitest'
import { pseudocode } from '../algorithms/pseudocode'

// ── Structure ─────────────────────────────────────────────────────────────────
describe('pseudocode export structure', () => {
  it('is an object', () => {
    expect(typeof pseudocode).toBe('object')
    expect(pseudocode).not.toBeNull()
  })

  it('all values are arrays of strings', () => {
    for (const [key, lines] of Object.entries(pseudocode)) {
      expect(Array.isArray(lines), `${key} should be an array`).toBe(true)
      expect(lines.length, `${key} should have at least one line`).toBeGreaterThan(0)
      lines.forEach((line, i) => {
        expect(typeof line, `${key}[${i}] should be a string`).toBe('string')
      })
    }
  })
})

// ── Sorting algorithms ────────────────────────────────────────────────────────
describe('sorting pseudocode', () => {
  it('has bubble sort', () => {
    expect(pseudocode).toHaveProperty('bubble')
    expect(pseudocode.bubble.length).toBeGreaterThan(0)
  })

  it('bubble sort contains loop keyword', () => {
    const text = pseudocode.bubble.join(' ')
    expect(text).toMatch(/for/)
  })

  it('has merge sort', () => {
    expect(pseudocode).toHaveProperty('merge')
    expect(pseudocode.merge.length).toBeGreaterThan(0)
  })

  it('merge sort references mergeSort', () => {
    const text = pseudocode.merge.join(' ')
    expect(text).toMatch(/mergeSort/i)
  })

  it('has quick sort', () => {
    expect(pseudocode).toHaveProperty('quick')
    expect(pseudocode.quick.length).toBeGreaterThan(0)
  })

  it('quick sort references pivot', () => {
    const text = pseudocode.quick.join(' ')
    expect(text).toMatch(/pivot/i)
  })

  it('has heap sort', () => {
    expect(pseudocode).toHaveProperty('heap')
    expect(pseudocode.heap.length).toBeGreaterThan(0)
  })

  it('heap sort references heapify', () => {
    const text = pseudocode.heap.join(' ')
    expect(text).toMatch(/heapify/i)
  })
})

// ── Searching algorithms ──────────────────────────────────────────────────────
describe('searching pseudocode', () => {
  it('has linear search', () => {
    expect(pseudocode).toHaveProperty('linear')
    expect(pseudocode.linear.length).toBeGreaterThan(0)
  })

  it('linear search references return -1', () => {
    const text = pseudocode.linear.join(' ')
    expect(text).toMatch(/return -1/)
  })

  it('has binary search', () => {
    expect(pseudocode).toHaveProperty('binary')
    expect(pseudocode.binary.length).toBeGreaterThan(0)
  })

  it('binary search references mid', () => {
    const text = pseudocode.binary.join(' ')
    expect(text).toMatch(/mid/)
  })
})

// ── Graph algorithms ──────────────────────────────────────────────────────────
describe('graph pseudocode', () => {
  it('has bfs', () => {
    expect(pseudocode).toHaveProperty('bfs')
    expect(pseudocode.bfs.length).toBeGreaterThan(0)
  })

  it('bfs references queue', () => {
    const text = pseudocode.bfs.join(' ')
    expect(text).toMatch(/queue/i)
  })

  it('has dfs', () => {
    expect(pseudocode).toHaveProperty('dfs')
    expect(pseudocode.dfs.length).toBeGreaterThan(0)
  })

  it('dfs references stack', () => {
    const text = pseudocode.dfs.join(' ')
    expect(text).toMatch(/stack/i)
  })

  it('has dijkstra', () => {
    expect(pseudocode).toHaveProperty('dijkstra')
    expect(pseudocode.dijkstra.length).toBeGreaterThan(0)
  })

  it('dijkstra references dist', () => {
    const text = pseudocode.dijkstra.join(' ')
    expect(text).toMatch(/dist/i)
  })

  it('has astar', () => {
    expect(pseudocode).toHaveProperty('astar')
    expect(pseudocode.astar.length).toBeGreaterThan(0)
  })

  it('astar references heuristic f(n)', () => {
    const text = pseudocode.astar.join(' ')
    expect(text).toMatch(/f\[n\]/)
  })
})

// ── BST algorithms ────────────────────────────────────────────────────────────
describe('tree pseudocode', () => {
  it('has bst-insert', () => {
    expect(pseudocode).toHaveProperty('bst-insert')
    expect(pseudocode['bst-insert'].length).toBeGreaterThan(0)
  })

  it('has bst-delete', () => {
    expect(pseudocode).toHaveProperty('bst-delete')
    expect(pseudocode['bst-delete'].length).toBeGreaterThan(0)
  })

  it('bst-delete references inorder successor', () => {
    const text = pseudocode['bst-delete'].join(' ')
    expect(text).toMatch(/inorder/i)
  })

  it('has bst-inorder', () => {
    expect(pseudocode).toHaveProperty('bst-inorder')
    expect(pseudocode['bst-inorder'].length).toBeGreaterThan(0)
  })

  it('bst-inorder visits left then node then right', () => {
    const text = pseudocode['bst-inorder'].join('\n')
    const leftIdx = text.indexOf('left')
    const visitIdx = text.indexOf('visit')
    const rightIdx = text.indexOf('right')
    expect(leftIdx).toBeLessThan(visitIdx)
    expect(visitIdx).toBeLessThan(rightIdx)
  })

  it('has bst-preorder', () => {
    expect(pseudocode).toHaveProperty('bst-preorder')
    expect(pseudocode['bst-preorder'].length).toBeGreaterThan(0)
  })

  it('bst-preorder visits node before children', () => {
    const text = pseudocode['bst-preorder'].join('\n')
    const visitIdx = text.indexOf('visit')
    const leftIdx = text.indexOf('left')
    expect(visitIdx).toBeLessThan(leftIdx)
  })

  it('has bst-postorder', () => {
    expect(pseudocode).toHaveProperty('bst-postorder')
    expect(pseudocode['bst-postorder'].length).toBeGreaterThan(0)
  })

  it('bst-postorder visits node after children', () => {
    const text = pseudocode['bst-postorder'].join('\n')
    const leftIdx = text.indexOf('left')
    const visitIdx = text.indexOf('visit')
    expect(leftIdx).toBeLessThan(visitIdx)
  })
})

// ── Removed advanced algorithms (deleted in this PR) ─────────────────────────
describe('removed advanced algorithm pseudocodes', () => {
  const removedKeys = [
    'counting-sort',
    'shell-sort',
    'radix-sort',
    'stack-ops',
    'queue-ops',
    'sliding-window',
    'two-pointers',
    'knapsack',
  ]

  removedKeys.forEach(key => {
    it(`does NOT have ${key}`, () => {
      expect(pseudocode).not.toHaveProperty(key)
    })
  })
})

// ── Completeness check ────────────────────────────────────────────────────────
describe('completeness', () => {
  const expectedKeys = [
    'bubble', 'merge', 'quick', 'heap',
    'linear', 'binary',
    'bfs', 'dfs', 'dijkstra', 'astar',
    'bst-insert', 'bst-delete', 'bst-inorder', 'bst-preorder', 'bst-postorder',
  ]

  it('has exactly the expected algorithms', () => {
    const actualKeys = Object.keys(pseudocode).sort()
    const sortedExpected = [...expectedKeys].sort()
    expect(actualKeys).toEqual(sortedExpected)
  })
})