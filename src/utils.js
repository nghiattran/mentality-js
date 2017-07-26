'use strict';

const toposort = require('./toposort');
const Node = require('./node');

let name = {};

function isString(str) {
  return typeof str === 'string' || str instanceof String;
}

function isInteger(value) {
   return Util.isFloat(value) &&
      Math.floor(value) === value;
}

function isFloat(value) {
   return Util.isNumber(value) && 
      isFinite(value);
}

function isNumber(value) {
   return typeof value === 'number';
}

function isDigit(n) {
  return !isNaN(parseFloat(n)) && isFinite(n) && n.length === 1;
}

function isLetter(char) {
    return /^[a-zA-Z]/.test(char) && char.length === 1;
}

function isLetterOrDigit(char) {
    return isDigit(char) || isLetter(char);
}

function isArray(val) {
  return val && val.constructor === Array
}

function isObject(val) {
  return val && val instanceof Object;
}

function getNumericValue(aString) {
    return Number(aString)
}

function getName(prefix) {
  if (prefix in name) {
    name[prefix] += 1;
    return prefix + '_' + name[prefix]
  } else {
    name[prefix] = 0;
    return prefix;
  }
}

function unroll(heads, silent=true) {
  let stack = heads.slice();
  let edges = [];
  let resolved = new Set();

  while (stack.length !== 0) {
    let currentNode = stack.pop();

    if (resolved.has(currentNode)) {
      continue;
    } else {
      resolved.add(currentNode);
    }

    for (let i = 0; i < currentNode.to.length; i++) {
      stack.push(currentNode.to[i]);
      edges.push([currentNode, currentNode.to[i]]);
    }
  }

  try {
    return toposort(edges);
  } catch(e) {
    if (silent) delete e.predecessors;
    throw e;
  }
}

function compile(node, graph, opts={}) {
  if ('precompile' in node) node.precompile(graph, opts);

  let sortedNodes = unroll(node.children, opts.silent);
  
  node.generate(graph, opts);

  for (let i = 0; i < sortedNodes.length; i++) {
    sortedNodes[i].compile(graph, opts);
  }

  if ('postcompile' in node) node.postcompile(graph, opts);
}

function toString(value) {
  if (isArray(value)) {
    let res = '';
    for (var i = 0; i < value.length; i++) {
      res += toString(value[i]);

      if (i < value.length - 1) res+= ', ';
    }
    return `[${res}]`;
  }

  if (isString(value)) {
    return `'${value}'`;
  }

  if (isObject(value)) {
    // TODO: this line is a bit hacky but needed since NodeJS doesn't like circular dependency
    if (value.constructor.name === 'Variable') return value.name;

    return JSON.stringify(value);
  }  

  return value.toString();
}

module.exports = {
  unroll, compile, getName,
  isInteger, isLetter, isFloat, isFinite, isNaN, isDigit, isString, isArray, isObject, toString
}