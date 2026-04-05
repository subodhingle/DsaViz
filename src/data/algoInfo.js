// Algorithm information database
// SVG illustrations are inline — no external image dependencies

export const algoInfo = {

  // ── SORTING ──────────────────────────────────────────────────────────────

  bubble: {
    name: 'Bubble Sort',
    category: 'Sorting',
    tagline: 'Repeatedly swap adjacent elements that are out of order.',
    description:
      'Bubble Sort is the simplest sorting algorithm. It works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order. The pass through the list is repeated until the list is sorted. Larger elements "bubble up" to the end of the array with each pass.',
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    stable: true,
    inPlace: true,
    type: 'Comparison Sort',
    useCases: ['Educational purposes', 'Nearly sorted arrays', 'Small datasets'],
    pros: ['Simple to understand and implement', 'In-place — no extra memory', 'Stable sort', 'Detects already-sorted arrays in O(n)'],
    cons: ['O(n²) average and worst case', 'Very slow on large datasets', 'Not used in practice for large inputs'],
    color: '#E6A23C',
    diagram: 'sorting',
  },

  merge: {
    name: 'Merge Sort',
    category: 'Sorting',
    tagline: 'Divide the array in half, sort each half, then merge.',
    description:
      'Merge Sort is a divide-and-conquer algorithm. It divides the input array into two halves, recursively sorts each half, then merges the two sorted halves. It guarantees O(n log n) performance in all cases, making it reliable for large datasets. The trade-off is O(n) extra space for the merge step.',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    stable: true,
    inPlace: false,
    type: 'Divide & Conquer',
    useCases: ['Large datasets', 'Linked lists', 'External sorting', 'When stability is required'],
    pros: ['Guaranteed O(n log n)', 'Stable sort', 'Predictable performance', 'Good for linked lists'],
    cons: ['O(n) extra space', 'Slower than Quick Sort in practice for arrays', 'Not in-place'],
    color: '#4F8CFF',
    diagram: 'sorting',
  },

  quick: {
    name: 'Quick Sort',
    category: 'Sorting',
    tagline: 'Pick a pivot, partition around it, recurse on both sides.',
    description:
      'Quick Sort selects a pivot element and partitions the array into two sub-arrays: elements less than the pivot and elements greater than the pivot. It then recursively sorts each sub-array. Despite O(n²) worst case, it is the fastest sorting algorithm in practice due to excellent cache performance and low constant factors.',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
    stable: false,
    inPlace: true,
    type: 'Divide & Conquer',
    useCases: ['General-purpose sorting', 'Arrays', 'When average-case performance matters'],
    pros: ['Fastest in practice for most inputs', 'In-place (O(log n) stack)', 'Excellent cache performance', 'Widely used in standard libraries'],
    cons: ['O(n²) worst case on sorted/reverse-sorted input', 'Not stable', 'Recursive — stack overflow risk on large inputs'],
    color: '#A78BFA',
    diagram: 'sorting',
  },

  heap: {
    name: 'Heap Sort',
    category: 'Sorting',
    tagline: 'Build a max-heap, then extract the maximum repeatedly.',
    description:
      'Heap Sort uses a binary heap data structure. First it builds a max-heap from the input array. Then it repeatedly extracts the maximum element (root) and places it at the end of the array, reducing the heap size by one and re-heapifying. This gives guaranteed O(n log n) with O(1) extra space.',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
    stable: false,
    inPlace: true,
    type: 'Selection Sort (Heap-based)',
    useCases: ['When O(1) space is required', 'Embedded systems', 'Priority queue operations'],
    pros: ['Guaranteed O(n log n)', 'In-place — O(1) extra space', 'No worst-case degradation'],
    cons: ['Not stable', 'Poor cache performance', 'Slower than Quick Sort in practice'],
    color: '#E85D5D',
    diagram: 'sorting',
  },

  // ── SEARCHING ────────────────────────────────────────────────────────────

  linear: {
    name: 'Linear Search',
    category: 'Searching',
    tagline: 'Scan every element one by one until the target is found.',
    description:
      'Linear Search is the simplest search algorithm. It sequentially checks each element of the list until a match is found or the whole list has been searched. It works on both sorted and unsorted arrays and requires no preprocessing.',
    complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    stable: true,
    inPlace: true,
    type: 'Sequential Search',
    useCases: ['Unsorted arrays', 'Small datasets', 'Linked lists', 'When data changes frequently'],
    pros: ['Works on unsorted data', 'Simple implementation', 'No preprocessing needed', 'Works on any data structure'],
    cons: ['O(n) time — slow for large datasets', 'Not suitable when fast search is needed'],
    color: '#5BCB8A',
    diagram: 'searching',
  },

  binary: {
    name: 'Binary Search',
    category: 'Searching',
    tagline: 'Halve the search space at each step on a sorted array.',
    description:
      'Binary Search works on sorted arrays. It repeatedly divides the search interval in half. If the target value is less than the middle element, the search continues in the lower half; otherwise in the upper half. This eliminates half the remaining elements at each step, giving O(log n) time.',
    complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    stable: true,
    inPlace: true,
    type: 'Divide & Conquer Search',
    useCases: ['Sorted arrays', 'Large datasets', 'Dictionary lookups', 'Finding insertion points'],
    pros: ['Very fast — O(log n)', 'Simple iterative implementation', 'Widely applicable'],
    cons: ['Requires sorted array', 'Not suitable for linked lists', 'Sorting overhead if data is unsorted'],
    color: '#4F8CFF',
    diagram: 'searching',
  },

  // ── GRAPH ────────────────────────────────────────────────────────────────

  bfs: {
    name: 'Breadth-First Search',
    category: 'Graph',
    tagline: 'Explore all neighbors at the current depth before going deeper.',
    description:
      'BFS explores a graph level by level using a queue. Starting from the source node, it visits all immediate neighbors first, then their neighbors, and so on. It guarantees the shortest path in unweighted graphs and is used for level-order traversal, finding connected components, and more.',
    complexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' },
    stable: true,
    inPlace: false,
    type: 'Graph Traversal',
    useCases: ['Shortest path (unweighted)', 'Level-order traversal', 'Connected components', 'Web crawlers', 'Social network analysis'],
    pros: ['Finds shortest path in unweighted graphs', 'Complete — always finds a solution if one exists', 'Good for shallow solutions'],
    cons: ['High memory usage O(V)', 'Slower than DFS for deep graphs', 'Not suitable for weighted shortest paths'],
    color: '#4F8CFF',
    diagram: 'graph',
  },

  dfs: {
    name: 'Depth-First Search',
    category: 'Graph',
    tagline: 'Explore as deep as possible before backtracking.',
    description:
      'DFS explores a graph by going as deep as possible along each branch before backtracking. It uses a stack (or recursion). DFS is used for topological sorting, cycle detection, maze solving, and finding strongly connected components.',
    complexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' },
    stable: true,
    inPlace: false,
    type: 'Graph Traversal',
    useCases: ['Topological sort', 'Cycle detection', 'Maze solving', 'Strongly connected components', 'Path finding'],
    pros: ['Low memory usage', 'Simple recursive implementation', 'Good for deep solutions', 'Useful for backtracking problems'],
    cons: ['Does not guarantee shortest path', 'Can get stuck in infinite loops without visited tracking', 'Not complete for infinite graphs'],
    color: '#A78BFA',
    diagram: 'graph',
  },

  dijkstra: {
    name: "Dijkstra's Algorithm",
    category: 'Graph',
    tagline: 'Find shortest paths from source to all nodes in a weighted graph.',
    description:
      "Dijkstra's algorithm finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edge weights. It uses a priority queue to always process the node with the smallest known distance next, greedily building the shortest path tree.",
    complexity: { best: 'O(E log V)', average: 'O((V+E) log V)', worst: 'O((V+E) log V)', space: 'O(V)' },
    stable: true,
    inPlace: false,
    type: 'Greedy / Shortest Path',
    useCases: ['GPS navigation', 'Network routing', 'Weighted shortest path', 'Maps and directions'],
    pros: ['Finds optimal shortest paths', 'Works for all non-negative weights', 'Widely used in practice'],
    cons: ['Does not work with negative edge weights', 'O((V+E) log V) can be slow for dense graphs', 'Requires priority queue'],
    color: '#E6A23C',
    diagram: 'graph',
  },

  astar: {
    name: 'A* Search',
    category: 'Graph',
    tagline: 'Guided shortest path using a heuristic to prioritize promising nodes.',
    description:
      "A* combines Dijkstra's guaranteed shortest path with a heuristic function h(n) that estimates the cost from node n to the goal. It prioritizes nodes with the lowest f(n) = g(n) + h(n), where g(n) is the actual cost from start. With an admissible heuristic, A* is both complete and optimal.",
    complexity: { best: 'O(E)', average: 'O(E log V)', worst: 'O(V²)', space: 'O(V)' },
    stable: true,
    inPlace: false,
    type: 'Informed Search / Heuristic',
    useCases: ['Game pathfinding', 'Robotics', 'GPS with traffic', 'Puzzle solving'],
    pros: ['Faster than Dijkstra with good heuristic', 'Optimal with admissible heuristic', 'Widely used in AI and games'],
    cons: ['Heuristic quality determines performance', 'High memory usage', 'Complex to implement correctly'],
    color: '#5BCB8A',
    diagram: 'graph',
  },

  // ── TREE ─────────────────────────────────────────────────────────────────

  'bst-insert': {
    name: 'BST Insert',
    category: 'Tree (BST)',
    tagline: 'Insert a value into a Binary Search Tree maintaining BST property.',
    description:
      'In a Binary Search Tree, every node satisfies: all values in the left subtree are smaller, all values in the right subtree are larger. Insertion starts at the root and traverses left or right based on comparison until an empty spot is found.',
    complexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)', space: 'O(1)' },
    stable: true,
    inPlace: true,
    type: 'Tree Operation',
    useCases: ['Dynamic sorted data', 'Symbol tables', 'Database indexing', 'Priority queues'],
    pros: ['O(log n) average case', 'Dynamic — supports insert/delete/search', 'In-order traversal gives sorted output'],
    cons: ['O(n) worst case on skewed trees', 'No self-balancing — can degrade to linked list'],
    color: '#E6A23C',
    diagram: 'tree',
  },

  'bst-delete': {
    name: 'BST Delete',
    category: 'Tree (BST)',
    tagline: 'Remove a node while preserving the BST property.',
    description:
      'BST deletion handles three cases: (1) Leaf node — simply remove it. (2) One child — replace the node with its child. (3) Two children — find the inorder successor (smallest in right subtree), replace the node\'s value with it, then delete the successor.',
    complexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)', space: 'O(1)' },
    stable: true,
    inPlace: true,
    type: 'Tree Operation',
    useCases: ['Dynamic data structures', 'Database record removal', 'Symbol table management'],
    pros: ['Maintains BST property after deletion', 'O(log n) average case'],
    cons: ['Three cases to handle — complex implementation', 'O(n) worst case on skewed trees'],
    color: '#E85D5D',
    diagram: 'tree',
  },

  'bst-inorder': {
    name: 'Inorder Traversal',
    category: 'Tree (BST)',
    tagline: 'Left → Root → Right — produces sorted output from a BST.',
    description:
      'Inorder traversal visits the left subtree first, then the root, then the right subtree. For a BST, this produces elements in ascending sorted order. It is used to get sorted data, validate BST property, and flatten a BST to a sorted array.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    stable: true,
    inPlace: false,
    type: 'Tree Traversal',
    useCases: ['Get sorted elements from BST', 'BST validation', 'Expression tree evaluation'],
    pros: ['Produces sorted output from BST', 'Simple recursive implementation'],
    cons: ['O(n) space for recursion stack', 'Visits all nodes — no early termination'],
    color: '#5BCB8A',
    diagram: 'tree',
  },

  'bst-preorder': {
    name: 'Preorder Traversal',
    category: 'Tree (BST)',
    tagline: 'Root → Left → Right — visits root before its subtrees.',
    description:
      'Preorder traversal visits the root first, then recursively visits the left subtree, then the right subtree. It is used to create a copy of the tree, serialize a tree structure, and evaluate prefix expressions.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    stable: true,
    inPlace: false,
    type: 'Tree Traversal',
    useCases: ['Tree serialization', 'Copying a tree', 'Prefix expression evaluation', 'Directory listing'],
    pros: ['Root visited first — useful for tree copying', 'Simple recursive implementation'],
    cons: ['O(n) space for recursion stack'],
    color: '#4F8CFF',
    diagram: 'tree',
  },

  'bst-postorder': {
    name: 'Postorder Traversal',
    category: 'Tree (BST)',
    tagline: 'Left → Right → Root — visits root after its subtrees.',
    description:
      'Postorder traversal visits the left subtree first, then the right subtree, then the root. It is used to delete a tree (children before parent), evaluate postfix expressions, and compute directory sizes.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    stable: true,
    inPlace: false,
    type: 'Tree Traversal',
    useCases: ['Tree deletion', 'Postfix expression evaluation', 'Computing subtree sizes', 'Garbage collection'],
    pros: ['Children processed before parent — safe for deletion', 'Simple recursive implementation'],
    cons: ['O(n) space for recursion stack', 'Root visited last — not useful when root needs early processing'],
    color: '#A78BFA',
    diagram: 'tree',
  },
}
