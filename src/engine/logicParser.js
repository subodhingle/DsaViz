// Parses user-defined pseudocode/JS-like syntax into animation steps
// Supported commands: compare(i,j), swap(i,j), mark(i), set(varName, val), highlight(line)

export function parseUserAlgorithm(code, array) {
  const steps = []
  const arr = [...array]
  const lines = code.split('\n').map(l => l.trim()).filter(Boolean)
  const vars = {}

  const context = {
    arr,
    compare: (i, j) => {
      steps.push({ array: [...arr], comparing: [i, j], swapping: [], sorted: [], highlightLine: -1, variables: { ...vars, comparing: `arr[${i}]=${arr[i]} vs arr[${j}]=${arr[j]}` } })
      return arr[i] > arr[j]
    },
    swap: (i, j) => {
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      steps.push({ array: [...arr], comparing: [], swapping: [i, j], sorted: [], highlightLine: -1, variables: { ...vars, swapped: `arr[${i}] ↔ arr[${j}]` } })
    },
    mark: (i) => {
      steps.push({ array: [...arr], comparing: [], swapping: [], sorted: [i], highlightLine: -1, variables: { ...vars, marked: i } })
    },
    set: (name, val) => {
      vars[name] = val
      steps.push({ array: [...arr], comparing: [], swapping: [], sorted: [], highlightLine: -1, variables: { ...vars } })
    },
    log: (msg) => {
      steps.push({ array: [...arr], comparing: [], swapping: [], sorted: [], highlightLine: -1, variables: { ...vars, log: msg } })
    },
    n: arr.length,
  }

  try {
    // Wrap in a function with context variables exposed
    const fn = new Function(
      'arr', 'compare', 'swap', 'mark', 'set', 'log', 'n',
      `"use strict";\n${code}`
    )
    fn(context.arr, context.compare, context.swap, context.mark, context.set, context.log, context.n)
  } catch (err) {
    steps.push({ array: [...arr], comparing: [], swapping: [], sorted: [], highlightLine: -1, variables: { error: err.message } })
  }

  if (steps.length === 0) {
    steps.push({ array: [...arr], comparing: [], swapping: [], sorted: [], highlightLine: -1, variables: { message: 'No steps generated. Use compare(), swap(), mark().' } })
  }

  return steps
}
