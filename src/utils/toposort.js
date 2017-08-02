/* eslint-disable */

'use strict';

/**
 * Topological sorting function
 * Taken from https://github.com/marcelklehr/toposort/blob/master/index.js and has some optimizations.
 * 
 * @param {Array} edges
 * @returns {Array}
 */

module.exports = exports = function(edges){
  return toposort(uniqueNodes(edges), edges)
}

exports.array = toposort

function toposort(nodes, edges) {
  let cursor = nodes.length
    , sorted = new Array(cursor)
    , visited = {}
    , i = cursor

  while (i--) {
    if (!visited[i]) visit(nodes[i], i, [])
  }

  return sorted

  function visit(node, i, predecessors) {
    if(predecessors.indexOf(node) >= 0) {
      let stack = predecessors.map((e) => {
        return e.name;
      });
      stack.push(node.name);

      let e = new Error('Cyclic dependency: ' + stack.join(' -> '))
      e.predecessors = predecessors;

      throw e;
    }

    if (!~nodes.indexOf(node)) {
      throw new Error('Found unknown node. Make sure to provided all involved nodes. Unknown node: '+ node.name)
    }

    if (visited[i]) return;
    visited[i] = true

    // outgoing edges
    let outgoing = edges.filter(function(edge){
      return edge[0] === node
    })
    if (i = outgoing.length) {
      let preds = predecessors.concat(node)
      do {
        let child = outgoing[--i][1]
        visit(child, nodes.indexOf(child), preds)
      } while (i)
    }

    sorted[--cursor] = node
  }
}

function uniqueNodes(arr){
  let res = []
  for (let i = 0, len = arr.length; i < len; i++) {
    let edge = arr[i]
    if (res.indexOf(edge[0]) < 0) res.push(edge[0])
    if (res.indexOf(edge[1]) < 0) res.push(edge[1])
  }
  return res
}