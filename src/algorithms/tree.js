// BST operations — returns steps for visualization
// Node: { val, left, right, id, x, y }

let nodeId = 0
function newNode(val) { return { val, left: null, right: null, id: nodeId++ } }

export function bstInsert(values) {
  nodeId = 0
  const steps = []
  let root = null

  for (const val of values) {
    const result = insertStep(root, val, steps)
    root = result
  }
  steps.push({ tree: cloneTree(root), highlight: [], path: [], action: 'done', highlightLine: 5, variables: { message: 'Insert complete' } })
  return steps
}

function insertStep(root, val, steps) {
  if (!root) {
    const node = newNode(val)
    steps.push({ tree: null, highlight: [], path: [], action: 'insert', insertVal: val, highlightLine: 1, variables: { val, action: 'create node' } })
    return node
  }
  const path = []
  let cur = root
  while (true) {
    path.push(cur.val)
    steps.push({ tree: cloneTree(root), highlight: [cur.val], path: [...path], action: 'compare', highlightLine: 2, variables: { val, current: cur.val, direction: val < cur.val ? 'left' : 'right' } })
    if (val < cur.val) {
      if (!cur.left) { cur.left = newNode(val); break }
      cur = cur.left
    } else {
      if (!cur.right) { cur.right = newNode(val); break }
      cur = cur.right
    }
  }
  steps.push({ tree: cloneTree(root), highlight: [val], path: [...path, val], action: 'inserted', highlightLine: 3, variables: { val, inserted: true } })
  return root
}

export function bstDelete(values, deleteVal) {
  nodeId = 0
  const steps = []
  let root = null
  for (const val of values) root = simpleInsert(root, val)

  steps.push({ tree: cloneTree(root), highlight: [], path: [], action: 'start', highlightLine: 0, variables: { deleteVal } })
  root = deleteStep(root, deleteVal, steps, [])
  steps.push({ tree: cloneTree(root), highlight: [], path: [], action: 'done', highlightLine: 6, variables: { deleteVal, message: 'Delete complete' } })
  return steps
}

function deleteStep(node, val, steps, path) {
  if (!node) return null
  path.push(node.val)
  steps.push({ tree: null, highlight: [node.val], path: [...path], action: 'compare', highlightLine: 1, variables: { val, current: node.val } })
  if (val < node.val) { node.left = deleteStep(node.left, val, steps, path) }
  else if (val > node.val) { node.right = deleteStep(node.right, val, steps, path) }
  else {
    steps.push({ tree: null, highlight: [node.val], path: [...path], action: 'delete', highlightLine: 3, variables: { val, message: 'Found node to delete' } })
    if (!node.left) return node.right
    if (!node.right) return node.left
    let minNode = node.right
    while (minNode.left) minNode = minNode.left
    node.val = minNode.val
    node.right = deleteStep(node.right, minNode.val, steps, path)
  }
  return node
}

export function bstTraversal(values, type = 'inorder') {
  nodeId = 0
  const steps = []
  let root = null
  for (const val of values) root = simpleInsert(root, val)

  const result = []
  if (type === 'inorder') inorder(root, steps, result, cloneTree(root))
  else if (type === 'preorder') preorder(root, steps, result, cloneTree(root))
  else postorder(root, steps, result, cloneTree(root))

  steps.push({ tree: cloneTree(root), highlight: [], path: result, action: 'done', highlightLine: 5, variables: { result: result.join(' → ') } })
  return steps
}

function inorder(node, steps, result, tree) {
  if (!node) return
  inorder(node.left, steps, result, tree)
  result.push(node.val)
  steps.push({ tree, highlight: [node.val], path: [...result], action: 'visit', highlightLine: 2, variables: { visited: node.val, order: result.join(' → ') } })
  inorder(node.right, steps, result, tree)
}

function preorder(node, steps, result, tree) {
  if (!node) return
  result.push(node.val)
  steps.push({ tree, highlight: [node.val], path: [...result], action: 'visit', highlightLine: 1, variables: { visited: node.val, order: result.join(' → ') } })
  preorder(node.left, steps, result, tree)
  preorder(node.right, steps, result, tree)
}

function postorder(node, steps, result, tree) {
  if (!node) return
  postorder(node.left, steps, result, tree)
  postorder(node.right, steps, result, tree)
  result.push(node.val)
  steps.push({ tree, highlight: [node.val], path: [...result], action: 'visit', highlightLine: 3, variables: { visited: node.val, order: result.join(' → ') } })
}

function simpleInsert(root, val) {
  if (!root) return newNode(val)
  if (val < root.val) root.left = simpleInsert(root.left, val)
  else root.right = simpleInsert(root.right, val)
  return root
}

function cloneTree(node) {
  if (!node) return null
  return { ...node, left: cloneTree(node.left), right: cloneTree(node.right) }
}
