// Step shape: { array, current, found, range, highlightLine, variables }

export function linearSearch(arr, target) {
  const steps = []
  for (let i = 0; i < arr.length; i++) {
    steps.push({ array: [...arr], current: i, found: -1, range: [], highlightLine: 1, variables: { i, target, arr_i: arr[i] } })
    if (arr[i] === target) {
      steps.push({ array: [...arr], current: i, found: i, range: [], highlightLine: 2, variables: { i, target, result: i } })
      return steps
    }
  }
  steps.push({ array: [...arr], current: -1, found: -1, range: [], highlightLine: 4, variables: { target, result: -1 } })
  return steps
}

export function binarySearch(arr, target) {
  const steps = []
  const sorted = [...arr].sort((a, b) => a - b)
  let low = 0, high = sorted.length - 1

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    steps.push({ array: sorted, current: mid, found: -1, range: [low, high], highlightLine: 2, variables: { low, mid, high, target, arr_mid: sorted[mid] } })
    if (sorted[mid] === target) {
      steps.push({ array: sorted, current: mid, found: mid, range: [low, high], highlightLine: 3, variables: { low, mid, high, target, result: mid } })
      return steps
    } else if (sorted[mid] < target) {
      low = mid + 1
      steps.push({ array: sorted, current: mid, found: -1, range: [low, high], highlightLine: 4, variables: { low, mid, high, target } })
    } else {
      high = mid - 1
      steps.push({ array: sorted, current: mid, found: -1, range: [low, high], highlightLine: 5, variables: { low, mid, high, target } })
    }
  }
  steps.push({ array: sorted, current: -1, found: -1, range: [], highlightLine: 7, variables: { target, result: -1 } })
  return steps
}
