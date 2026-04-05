/**
 * Logic Parser / Interpreter — v3
 *
 * Step shape:
 * {
 *   array:        number[]
 *   comparing:    number[]       amber  — being compared
 *   swapping:     number[]       red    — being swapped
 *   sorted:       number[]       green  — done / marked
 *   highlighted:  number[]       blue   — highlighted
 *   pivot:        number|null    violet — pivot index
 *   line:         number         0-based source line that produced this step
 *   variables:    Record<string,any>
 *   message:      string|null
 *   error:        string|null
 *   type:         'compare'|'swap'|'highlight'|'sorted'|'pivot'|'set'|'log'|'var'|'snapshot'|'done'|'error'
 *   stats:        { comparisons, swaps, highlights }
 * }
 */

export function parseUserAlgorithm(code, array) {
  const steps     = []
  const arr       = [...array]
  const vars      = {}
  const sortedSet = new Set()
  let   line      = 0
  const stats     = { comparisons: 0, swaps: 0, highlights: 0 }

  const push = (type, comparing = [], swapping = [], highlighted = [], extra = {}) => {
    steps.push({
      type,
      array:       [...arr],
      comparing,
      swapping,
      sorted:      [...sortedSet],
      highlighted,
      pivot:       extra.pivot ?? null,
      line,
      variables:   { ...vars, ...extra.vars },
      message:     extra.message ?? null,
      error:       null,
      stats:       { ...stats },
    })
  }

  const api = {
    // compare(i, j) → boolean — amber highlight
    compare(i, j) {
      stats.comparisons++
      push('compare', [i, j], [], [], {
        vars: { i, j, [`arr[${i}]`]: arr[i], [`arr[${j}]`]: arr[j], comparisons: stats.comparisons },
      })
      return arr[i] > arr[j]
    },

    // swap(i, j) — red highlight
    swap(i, j) {
      stats.swaps++
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      push('swap', [], [i, j], [], {
        vars: { swapped: `[${i}]↔[${j}]`, swaps: stats.swaps },
      })
    },

    // set(i, value) — set arr[i] to value
    set(i, value) {
      arr[i] = value
      push('set', [], [], [i], {
        vars: { [`arr[${i}]`]: value },
      })
    },

    // highlight(i) — blue highlight
    highlight(i) {
      stats.highlights++
      push('highlight', [], [], [i], {
        vars: { highlighted: i },
      })
    },

    // mark(i) — mark as sorted/done (green)
    mark(i) {
      sortedSet.add(i)
      push('sorted', [], [], [], { vars: { marked: i } })
    },

    // markAll() — mark entire array done
    markAll() {
      arr.forEach((_, idx) => sortedSet.add(idx))
      push('sorted', [], [], [])
    },

    // pivot(i) — mark pivot (violet)
    pivot(i) {
      push('pivot', [], [], [], { pivot: i, vars: { pivot: arr[i] } })
    },

    // log(msg) — emit a message step
    log(msg) {
      push('log', [], [], [], { message: String(msg) })
    },

    // setVar(name, val) — track a named variable
    setVar(name, val) {
      vars[name] = val
      push('var', [], [], [], { vars: { [name]: val } })
    },

    // snapshot() — capture current state without any highlight
    snapshot() {
      push('snapshot', [], [], [])
    },

    get arr() { return [...arr] },
    get n()   { return arr.length },
  }

  // Instrument: inject __setLine(i) before each non-empty, non-comment line
  const srcLines = code.split('\n')
  const instrumented = srcLines.map((raw, i) => {
    const t = raw.trim()
    if (!t || t.startsWith('//')) return raw
    return `__setLine(${i});\n${raw}`
  }).join('\n')

  try {
    const fn = new Function(
      '__setLine',
      'compare', 'swap', 'set', 'highlight',
      'mark', 'markAll', 'pivot', 'log', 'setVar', 'snapshot',
      'n', 'arr',
      `"use strict";\n${instrumented}`
    )
    fn(
      (n) => { line = n },
      api.compare.bind(api), api.swap.bind(api),
      api.set.bind(api),     api.highlight.bind(api),
      api.mark.bind(api),    api.markAll.bind(api),
      api.pivot.bind(api),   api.log.bind(api),
      api.setVar.bind(api),  api.snapshot.bind(api),
      arr.length, [...arr],
    )
  } catch (err) {
    steps.push({
      type: 'error', array: [...arr],
      comparing: [], swapping: [], sorted: [...sortedSet],
      highlighted: [], pivot: null,
      line, variables: { ...vars },
      message: null,
      error: err.message,
      stats: { ...stats },
    })
    return steps
  }

  // Final done frame — mark everything green
  arr.forEach((_, i) => sortedSet.add(i))
  steps.push({
    type: 'done', array: [...arr],
    comparing: [], swapping: [], sorted: [...sortedSet],
    highlighted: [], pivot: null,
    line: -1,
    variables: { ...vars, comparisons: stats.comparisons, swaps: stats.swaps, status: '✓ done' },
    message: `Done — ${stats.comparisons} comparisons, ${stats.swaps} swaps`,
    error: null,
    stats: { ...stats },
  })

  return steps
}
