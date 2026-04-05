export const TEMPLATES = [
  {
    id: 'bubble',
    label: 'Bubble Sort',
    category: 'Sorting',
    description: 'Classic O(n²) comparison sort',
    code: `// Bubble Sort
// Repeatedly compares adjacent elements and swaps if out of order.
// Time: O(n²)  Space: O(1)

for (let i = 0; i < n - 1; i++) {
  setVar('pass', i + 1);
  for (let j = 0; j < n - 1 - i; j++) {
    if (compare(j, j + 1)) {
      swap(j, j + 1);
    }
  }
  mark(n - 1 - i);
}
markAll();`,
  },
  {
    id: 'selection',
    label: 'Selection Sort',
    category: 'Sorting',
    description: 'Find minimum, place at front',
    code: `// Selection Sort
// Finds the minimum element and places it at the sorted position.
// Time: O(n²)  Space: O(1)

for (let i = 0; i < n - 1; i++) {
  let minIdx = i;
  setVar('minIdx', minIdx);
  highlight(minIdx);

  for (let j = i + 1; j < n; j++) {
    if (compare(minIdx, j) === false && arr[j] < arr[minIdx]) {
      // arr[j] < arr[minIdx]
      compare(j, minIdx);
      minIdx = j;
      setVar('minIdx', minIdx);
      highlight(minIdx);
    } else {
      compare(j, minIdx);
    }
  }

  if (minIdx !== i) {
    swap(i, minIdx);
  }
  mark(i);
}
mark(n - 1);`,
  },
  {
    id: 'insertion',
    label: 'Insertion Sort',
    category: 'Sorting',
    description: 'Build sorted array one element at a time',
    code: `// Insertion Sort
// Builds the sorted array by inserting each element into its correct position.
// Time: O(n²)  Space: O(1)

mark(0);
for (let i = 1; i < n; i++) {
  let key = arr[i];
  setVar('key', key);
  highlight(i);
  let j = i - 1;

  while (j >= 0 && arr[j] > key) {
    compare(j, j + 1);
    set(j + 1, arr[j]);
    j--;
  }
  set(j + 1, key);
  mark(i);
}`,
  },
  {
    id: 'linear-search',
    label: 'Linear Search',
    category: 'Searching',
    description: 'Scan every element for target',
    code: `// Linear Search
// Scans each element until the target is found.
// Time: O(n)  Space: O(1)

const target = arr[Math.floor(n / 2)]; // search for middle value
setVar('target', target);

for (let i = 0; i < n; i++) {
  highlight(i);
  setVar('checking', arr[i]);

  if (arr[i] === target) {
    mark(i);
    log('Found ' + target + ' at index ' + i);
    break;
  }
}`,
  },
  {
    id: 'two-pointer',
    label: 'Two Pointer',
    category: 'Technique',
    description: 'Left and right pointers moving inward',
    code: `// Two Pointer — check if array has a pair summing to target
// Assumes sorted array. Time: O(n log n)  Space: O(1)

// First sort (bubble for demo)
for (let i = 0; i < n - 1; i++) {
  for (let j = 0; j < n - 1 - i; j++) {
    if (compare(j, j + 1)) swap(j, j + 1);
  }
  mark(n - 1 - i);
}

const target = arr[0] + arr[n - 1]; // pick a target
setVar('target', target);

let left = 0, right = n - 1;
while (left < right) {
  highlight(left);
  highlight(right);
  setVar('left', left);
  setVar('right', right);
  const sum = arr[left] + arr[right];
  setVar('sum', sum);

  if (sum === target) {
    mark(left); mark(right);
    log('Pair found: ' + arr[left] + ' + ' + arr[right]);
    break;
  } else if (sum < target) {
    left++;
  } else {
    right--;
  }
}`,
  },
  {
    id: 'custom',
    label: 'Blank Canvas',
    category: 'Custom',
    description: 'Start from scratch',
    code: `// Your Algorithm
// Available API:
//   compare(i, j)     → true if arr[i] > arr[j], emits comparison step
//   swap(i, j)        → swaps arr[i] and arr[j], emits swap step
//   set(i, value)     → sets arr[i] = value
//   highlight(i)      → highlights index i (blue)
//   mark(i)           → marks index i as done (green)
//   markAll()         → marks all indices as done
//   pivot(i)          → marks index i as pivot (violet)
//   log(msg)          → logs a message
//   setVar(name, val) → updates variable watch panel
//   snapshot()        → emits current state
//   n                 → array length
//   arr               → read-only copy of current array

// Write your algorithm below:

for (let i = 0; i < n; i++) {
  highlight(i);
  setVar('i', i);
  setVar('value', arr[i]);
}
markAll();`,
  },
]

export const TEMPLATE_CATEGORIES = [...new Set(TEMPLATES.map(t => t.category))]
