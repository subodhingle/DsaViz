// Complete algorithm registry — single source of truth for sidebar + info panel
// visualizer: 'sorting' | 'searching' | 'graph' | 'tree' | 'array' | 'info-only'

export const ALGORITHM_REGISTRY = [

  // ── SORTING ──────────────────────────────────────────────────────────────
  { id: 'bubble',        label: 'Bubble Sort',       category: 'sorting',   visualizer: 'sorting'   },
  { id: 'merge',         label: 'Merge Sort',         category: 'sorting',   visualizer: 'sorting'   },
  { id: 'quick',         label: 'Quick Sort',         category: 'sorting',   visualizer: 'sorting'   },
  { id: 'heap',          label: 'Heap Sort',          category: 'sorting',   visualizer: 'sorting'   },
  { id: 'counting-sort', label: 'Counting Sort',      category: 'sorting',   visualizer: 'sorting'   },
  { id: 'shell-sort',    label: 'Shell Sort',         category: 'sorting',   visualizer: 'sorting'   },
  { id: 'radix-sort',    label: 'Radix Sort',         category: 'sorting',   visualizer: 'sorting'   },

  // ── SEARCHING ─────────────────────────────────────────────────────────────
  { id: 'linear',        label: 'Linear Search',      category: 'searching', visualizer: 'searching' },
  { id: 'binary',        label: 'Binary Search',      category: 'searching', visualizer: 'searching' },

  // ── GRAPH ─────────────────────────────────────────────────────────────────
  { id: 'bfs',           label: 'BFS',                category: 'graph',     visualizer: 'graph'     },
  { id: 'dfs',           label: 'DFS',                category: 'graph',     visualizer: 'graph'     },
  { id: 'dijkstra',      label: 'Dijkstra',           category: 'graph',     visualizer: 'graph'     },
  { id: 'astar',         label: 'A* Search',          category: 'graph',     visualizer: 'graph'     },
  { id: 'topo-sort',     label: 'Topological Sort',   category: 'graph',     visualizer: 'info-only' },
  { id: 'kahn',          label: "Kahn's Algorithm",   category: 'graph',     visualizer: 'info-only' },
  { id: 'bellman-ford',  label: 'Bellman-Ford',       category: 'graph',     visualizer: 'info-only' },
  { id: 'floyd-warshall',label: 'Floyd-Warshall',     category: 'graph',     visualizer: 'info-only' },
  { id: 'kruskal',       label: "Kruskal's MST",      category: 'graph',     visualizer: 'info-only' },
  { id: 'prim',          label: "Prim's MST",         category: 'graph',     visualizer: 'info-only' },
  { id: 'kosaraju',      label: 'Kosaraju SCC',       category: 'graph',     visualizer: 'info-only' },
  { id: 'tarjan',        label: 'Tarjan SCC',         category: 'graph',     visualizer: 'info-only' },
  { id: 'articulation',  label: 'Articulation Points',category: 'graph',     visualizer: 'info-only' },
  { id: 'bridges',       label: 'Bridges in Graph',   category: 'graph',     visualizer: 'info-only' },
  { id: 'bipartite',     label: 'Bipartite Check',    category: 'graph',     visualizer: 'info-only' },
  { id: 'euler-path',    label: 'Euler Path',         category: 'graph',     visualizer: 'info-only' },
  { id: 'hamiltonian',   label: 'Hamiltonian Path',   category: 'graph',     visualizer: 'info-only' },
  { id: 'ford-fulkerson',label: 'Ford-Fulkerson',     category: 'graph',     visualizer: 'info-only' },
  { id: 'edmonds-karp',  label: 'Edmonds-Karp',       category: 'graph',     visualizer: 'info-only' },
  { id: 'dinic',         label: "Dinic's Algorithm",  category: 'graph',     visualizer: 'info-only' },

  // ── TREE ──────────────────────────────────────────────────────────────────
  { id: 'bst-insert',    label: 'BST Insert',         category: 'tree',      visualizer: 'tree'      },
  { id: 'bst-delete',    label: 'BST Delete',         category: 'tree',      visualizer: 'tree'      },
  { id: 'bst-inorder',   label: 'Inorder',            category: 'tree',      visualizer: 'tree'      },
  { id: 'bst-preorder',  label: 'Preorder',           category: 'tree',      visualizer: 'tree'      },
  { id: 'bst-postorder', label: 'Postorder',          category: 'tree',      visualizer: 'tree'      },

  // ── ADVANCED DATA STRUCTURES ──────────────────────────────────────────────
  { id: 'avl-tree',      label: 'AVL Tree',           category: 'adv-ds',    visualizer: 'info-only' },
  { id: 'red-black',     label: 'Red-Black Tree',     category: 'adv-ds',    visualizer: 'info-only' },
  { id: 'splay-tree',    label: 'Splay Tree',         category: 'adv-ds',    visualizer: 'info-only' },
  { id: 'treap',         label: 'Treap',              category: 'adv-ds',    visualizer: 'info-only' },
  { id: 'b-tree',        label: 'B-Tree',             category: 'adv-ds',    visualizer: 'info-only' },
  { id: 'b-plus-tree',   label: 'B+ Tree',            category: 'adv-ds',    visualizer: 'info-only' },
  { id: 'segment-tree',  label: 'Segment Tree',       category: 'adv-ds',    visualizer: 'info-only' },
  { id: 'lazy-prop',     label: 'Lazy Propagation',   category: 'adv-ds',    visualizer: 'info-only' },
  { id: 'fenwick',       label: 'Fenwick Tree (BIT)',  category: 'adv-ds',    visualizer: 'info-only' },
  { id: 'persistent-seg',label: 'Persistent Seg Tree', category: 'adv-ds',   visualizer: 'info-only' },
  { id: 'interval-tree', label: 'Interval Tree',      category: 'adv-ds',    visualizer: 'info-only' },
  { id: 'order-stat',    label: 'Order Statistic Tree',category: 'adv-ds',   visualizer: 'info-only' },
  { id: 'union-find',    label: 'Disjoint Set (DSU)',  category: 'adv-ds',   visualizer: 'info-only' },
  { id: 'fib-heap',      label: 'Fibonacci Heap',     category: 'adv-ds',    visualizer: 'info-only' },
  { id: 'binomial-heap', label: 'Binomial Heap',      category: 'adv-ds',    visualizer: 'info-only' },
  { id: 'indexed-pq',    label: 'Indexed Priority Queue', category: 'adv-ds',visualizer: 'info-only' },
  { id: 'trie',          label: 'Trie',               category: 'adv-ds',    visualizer: 'info-only' },
  { id: 'compressed-trie',label: 'Compressed Trie',   category: 'adv-ds',    visualizer: 'info-only' },
  { id: 'suffix-trie',   label: 'Suffix Trie',        category: 'adv-ds',    visualizer: 'info-only' },
  { id: 'suffix-tree',   label: 'Suffix Tree',        category: 'adv-ds',    visualizer: 'info-only' },
  { id: 'suffix-array',  label: 'Suffix Array',       category: 'adv-ds',    visualizer: 'info-only' },
  { id: 'lcp-array',     label: 'LCP Array',          category: 'adv-ds',    visualizer: 'info-only' },

  // ── DYNAMIC PROGRAMMING ───────────────────────────────────────────────────
  { id: 'knapsack',      label: '0/1 Knapsack',       category: 'dp',        visualizer: 'sorting'   },
  { id: 'unbounded-ks',  label: 'Unbounded Knapsack', category: 'dp',        visualizer: 'info-only' },
  { id: 'lcs',           label: 'LCS',                category: 'dp',        visualizer: 'info-only' },
  { id: 'lis',           label: 'LIS',                category: 'dp',        visualizer: 'sorting'   },
  { id: 'matrix-chain',  label: 'Matrix Chain Mult',  category: 'dp',        visualizer: 'info-only' },
  { id: 'edit-distance', label: 'Edit Distance',      category: 'dp',        visualizer: 'info-only' },
  { id: 'dp-trees',      label: 'DP on Trees',        category: 'dp',        visualizer: 'info-only' },
  { id: 'dp-graphs',     label: 'DP on Graphs',       category: 'dp',        visualizer: 'info-only' },
  { id: 'bitmask-dp',    label: 'Bitmask DP',         category: 'dp',        visualizer: 'info-only' },
  { id: 'digit-dp',      label: 'Digit DP',           category: 'dp',        visualizer: 'info-only' },
  { id: 'dc-dp',         label: 'Divide & Conquer DP',category: 'dp',        visualizer: 'info-only' },
  { id: 'knuth-opt',     label: 'Knuth Optimization', category: 'dp',        visualizer: 'info-only' },

  // ── STRING ALGORITHMS ─────────────────────────────────────────────────────
  { id: 'kmp',           label: 'KMP Algorithm',      category: 'strings',   visualizer: 'info-only' },
  { id: 'z-algo',        label: 'Z Algorithm',        category: 'strings',   visualizer: 'info-only' },
  { id: 'rabin-karp',    label: 'Rabin-Karp',         category: 'strings',   visualizer: 'info-only' },
  { id: 'manacher',      label: "Manacher's",         category: 'strings',   visualizer: 'info-only' },
  { id: 'aho-corasick',  label: 'Aho-Corasick',       category: 'strings',   visualizer: 'info-only' },

  // ── GREEDY ────────────────────────────────────────────────────────────────
  { id: 'activity-sel',  label: 'Activity Selection', category: 'greedy',    visualizer: 'info-only' },
  { id: 'huffman',       label: 'Huffman Coding',     category: 'greedy',    visualizer: 'info-only' },
  { id: 'frac-knapsack', label: 'Fractional Knapsack',category: 'greedy',    visualizer: 'info-only' },
  { id: 'job-seq',       label: 'Job Sequencing',     category: 'greedy',    visualizer: 'info-only' },
  { id: 'interval-sched',label: 'Interval Scheduling',category: 'greedy',    visualizer: 'info-only' },

  // ── BACKTRACKING ──────────────────────────────────────────────────────────
  { id: 'n-queens',      label: 'N-Queens',           category: 'backtrack', visualizer: 'info-only' },
  { id: 'sudoku',        label: 'Sudoku Solver',      category: 'backtrack', visualizer: 'info-only' },
  { id: 'permutations',  label: 'Permutations',       category: 'backtrack', visualizer: 'info-only' },
  { id: 'combinations',  label: 'Combinations',       category: 'backtrack', visualizer: 'info-only' },
  { id: 'subsets',       label: 'Subsets',            category: 'backtrack', visualizer: 'info-only' },

  // ── DIVIDE & CONQUER ──────────────────────────────────────────────────────
  { id: 'closest-pair',  label: 'Closest Pair of Points', category: 'dc',   visualizer: 'info-only' },

  // ── BIT MANIPULATION ──────────────────────────────────────────────────────
  { id: 'xor-ops',       label: 'XOR Operations',     category: 'bits',      visualizer: 'info-only' },
  { id: 'bitmasking',    label: 'Bitmasking',         category: 'bits',      visualizer: 'info-only' },
  { id: 'count-bits',    label: 'Counting Bits',      category: 'bits',      visualizer: 'info-only' },
  { id: 'fast-exp',      label: 'Fast Exponentiation',category: 'bits',      visualizer: 'info-only' },

  // ── RANGE QUERIES ─────────────────────────────────────────────────────────
  { id: 'sparse-table',  label: 'Sparse Table',       category: 'range',     visualizer: 'info-only' },
  { id: 'mo-algo',       label: "Mo's Algorithm",     category: 'range',     visualizer: 'info-only' },

  // ── TECHNIQUES ────────────────────────────────────────────────────────────
  { id: 'sliding-window',label: 'Sliding Window',     category: 'techniques',visualizer: 'sorting'   },
  { id: 'two-pointers',  label: 'Two Pointers',       category: 'techniques',visualizer: 'searching' },
  { id: 'meet-middle',   label: 'Meet in the Middle', category: 'techniques',visualizer: 'info-only' },
  { id: 'binary-lifting',label: 'Binary Lifting',     category: 'techniques',visualizer: 'info-only' },
  { id: 'lca',           label: 'LCA',                category: 'techniques',visualizer: 'info-only' },
  { id: 'hld',           label: 'Heavy-Light Decomp', category: 'techniques',visualizer: 'info-only' },

  // ── DATA STRUCTURES (basic) ───────────────────────────────────────────────
  { id: 'stack-ops',     label: 'Stack',              category: 'ds',        visualizer: 'sorting'   },
  { id: 'queue-ops',     label: 'Queue',              category: 'ds',        visualizer: 'sorting'   },

  // ── COMPUTATIONAL GEOMETRY ────────────────────────────────────────────────
  { id: 'convex-hull',   label: 'Convex Hull',        category: 'geometry',  visualizer: 'info-only' },
  { id: 'graham-scan',   label: 'Graham Scan',        category: 'geometry',  visualizer: 'info-only' },
  { id: 'jarvis-march',  label: 'Jarvis March',       category: 'geometry',  visualizer: 'info-only' },
  { id: 'line-intersect',label: 'Line Intersection',  category: 'geometry',  visualizer: 'info-only' },
  { id: 'sweep-line',    label: 'Sweep Line',         category: 'geometry',  visualizer: 'info-only' },

  // ── TOOLS ─────────────────────────────────────────────────────────────────
  { id: 'custom',        label: 'Custom Builder',     category: 'tools',     visualizer: 'custom'    },
  { id: 'compiler',      label: 'Code Editor',        category: 'tools',     visualizer: 'compiler'  },
]

// Category metadata
export const CATEGORY_META = {
  sorting:    { label: 'Sorting',              section: 'Algorithms' },
  searching:  { label: 'Searching',            section: 'Algorithms' },
  graph:      { label: 'Graph',                section: 'Algorithms' },
  tree:       { label: 'Tree (BST)',           section: 'Algorithms' },
  'adv-ds':   { label: 'Advanced Data Structures', section: 'Advanced' },
  dp:         { label: 'Dynamic Programming',  section: 'Advanced' },
  strings:    { label: 'String Algorithms',    section: 'Advanced' },
  greedy:     { label: 'Greedy',               section: 'Advanced' },
  backtrack:  { label: 'Backtracking',         section: 'Advanced' },
  dc:         { label: 'Divide & Conquer',     section: 'Advanced' },
  bits:       { label: 'Bit Manipulation',     section: 'Advanced' },
  range:      { label: 'Range Queries',        section: 'Advanced' },
  techniques: { label: 'Techniques',           section: 'Advanced' },
  ds:         { label: 'Data Structures',      section: 'Algorithms' },
  geometry:   { label: 'Computational Geometry', section: 'Advanced' },
  tools:      { label: 'Tools',                section: 'Tools' },
}

export const SECTIONS = ['Algorithms', 'Advanced', 'Tools']

// Build lookup maps
export const ALGO_BY_ID = Object.fromEntries(ALGORITHM_REGISTRY.map(a => [a.id, a]))
export const ALGOS_BY_CATEGORY = ALGORITHM_REGISTRY.reduce((acc, a) => {
  ;(acc[a.category] = acc[a.category] || []).push(a)
  return acc
}, {})
