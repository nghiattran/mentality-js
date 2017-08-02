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

function sortChildren(heads, silent=true) {
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

function unroll(rootNode, opts={}) {
  let queue = [rootNode];
  let sequence = [];

  while (queue.length > 0) {
    let node = queue.shift();
    let sortedNodes = sortChildren(node.children, opts.silent);
    queue.unshift(...sortedNodes);
    sequence.push(node);
  }
  return sequence;
}

// function compile(node, graph, opts={}) {
//   let nodes = unroll(node, opts);

//   for (var i = 0; i < nodes.length; i++) {
//     let node = nodes[i];
//     if ('preCompile' in node) node.preCompile(graph, opts);

//     node.build(graph, opts);

//     if ('postCompile' in node) node.postCompile(graph, opts);
//   }
// }

function toJson(node, opts={}) {
  let sortedNodes = sortChildren(node.children, opts.silent);
  
  let json = node.toJson(graph, opts);
  json.children = [];
  for (let i = 0; i < sortedNodes.length; i++) {
    json.children.push(toJson(sortedNodes[i], opts));
  }
  return json;
}

function compile(node, graph, opts={}) {
  if ('preCompile' in node) node.preCompile(graph, opts);

  let sortedNodes = sortChildren(node.children, opts.silent);
  
  node.build(graph, opts);

  for (let i = 0; i < sortedNodes.length; i++) {
    sortedNodes[i].compile(graph, opts);
  }

  if ('postCompile' in node) node.postCompile(graph, opts);
}

function allignArguments(funcCall) {
  let lines = funcCall.split('\n');
  let index = 0;
  while (lines[0][index] != '(') {
    index += 1;
  }
  index += 1;
  
  for (let i = 1; i < lines.length; i++) {
    lines[i] = ' '.repeat(index) + lines[i].trim();
  }
  return lines;
}


/**
 * Determines output length of a convolution given input length. Based on https://github.com/fchollet/keras/blob/master/keras/utils/conv_utils.py#L90
 * @param  {Object} args  inputLength: integer.
                          filterSize: integer.
                          padding: one of "same", "valid", "full".
                          stride: integer.
                          dilation: dilation rate, integer.
 * @return {Number}       The output length (integer).
 */
function computeConvOutputLength(args) {
  const {inputLength, filterSize, padding, stride, dilation=1} = args;

  if (!inputLength) return;

  let dilatedFilterSize = filterSize + (filterSize - 1) * (dilation - 1);

  let outputLength;
  switch (padding.toLowerCase()) {
    case 'same':
    case 'causal':
      outputLength = inputLength;
      break;
    case 'valid':
      outputLength = inputLength - dilatedFilterSize + 1;
      break;
    case 'full':
      outputLength = inputLength + dilatedFilterSize - 1;
      break;
    default:
      throw Error(`Unrecognized value for padding. Got ${padding}`);
  }

  return Math.floor((outputLength + stride - 1) / stride);
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
    return JSON.stringify(value);
  }  

  return value.toString();
}

module.exports = {
  sortChildren, compile, getName, allignArguments, computeConvOutputLength, unroll, toString, 
  isInteger, isLetter, isFloat, isFinite, isNaN, isDigit, isString, isArray, isObject
}