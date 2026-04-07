import { describe, it, expect } from 'vitest'
import { pseudocode } from '../algorithms/pseudocode'

// Keys that should exist after the PR (advanced entries removed)
const EXPECTED_KEYS = [
  'bubble', 'merge', 'quick', 'heap',
  'linear', 'binary',
  'bfs', 'dfs', 'dijkstra', 'astar',
  'bst-insert', 'bst-delete', 'bst-inorder', 'bst-preorder', 'bst-postorder',
]

// Keys removed in this PR (advanced algorithms)
const REMOVED_KEYS = [
  'counting-sort', 'shell-sort', 'radix-sort',
  'stack-ops', 'queue-ops',
  'sliding-window', 'two-pointers', 'knapsack',
]

describe('pseudocode — present entries', () => {
  it('exports an object', () => {
    expect(pseudocode).toBeDefined()
    expect(typeof pseudocode).toBe('object')
  })

  EXPECTED_KEYS.forEach(key => {
    it(`has entry for "${key}"`, () => {
      expect(pseudocode[key]).toBeDefined()
    })

    it(`"${key}" entry is a non-empty array of strings`, () => {
      const entry = pseudocode[key]
      expect(Array.isArray(entry)).toBe(true)
      expect(entry.length).toBeGreaterThan(0)
      entry.forEach(line => expect(typeof line).toBe('string'))
    })
  })
})

describe('pseudocode — removed entries (advanced algorithms)', () => {
  REMOVED_KEYS.forEach(key => {
    it(`does NOT have entry for removed algorithm "${key}"`, () => {
      expect(pseudocode[key]).toBeUndefined()
    })
  })
})

describe('pseudocode — content correctness', () => {
  it('bubble sort pseudocode references swap', () => {
    const lines = pseudocode.bubble.join('\n')
    expect(lines).toMatch(/swap/i)
  })

  it('merge sort pseudocode mentions mergeSort', () => {
    const lines = pseudocode.merge.join('\n')
    expect(lines).toMatch(/mergeSort/i)
  })

  it('binary search pseudocode mentions mid', () => {
    const lines = pseudocode.binary.join('\n')
    expect(lines).toMatch(/mid/i)
  })

  it('dijkstra pseudocode mentions dist or priority', () => {
    const lines = pseudocode.dijkstra.join('\n')
    expect(lines).toMatch(/dist|priority/i)
  })

  it('bst-inorder pseudocode has left and right traversal', () => {
    const lines = pseudocode['bst-inorder'].join('\n')
    expect(lines).toMatch(/left/i)
    expect(lines).toMatch(/right/i)
  })

  it('bst-preorder visits node before children', () => {
    const lines = pseudocode['bst-preorder']
    // visit(node) should come before recursive calls
    const visitIdx = lines.findIndex(l => /visit/.test(l))
    const leftIdx  = lines.findIndex(l => /left/i.test(l))
    expect(visitIdx).toBeLessThan(leftIdx)
  })

  it('bst-postorder visits node after children', () => {
    const lines = pseudocode['bst-postorder']
    const visitIdx = lines.findIndex(l => /visit/.test(l))
    const leftIdx  = lines.findIndex(l => /left/i.test(l))
    expect(visitIdx).toBeGreaterThan(leftIdx)
  })

  it('total number of keys is exactly 15', () => {
    expect(Object.keys(pseudocode).length).toBe(15)
  })
})