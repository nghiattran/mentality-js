const toposort = require('./toposort');
const typeUtils = require('./type_utils');

const nameCollection = {};

function getName(prefix) {
  let name;
  if (prefix in nameCollection) {
    nameCollection[prefix] += 1;
    name = `${prefix}_${nameCollection[prefix]}`;
  } else {
    nameCollection[prefix] = 0;
    name = prefix;
  }

  return name;
}

function sortChildren(heads, silent = true) {
  const stack = heads.slice();
  const edges = [];
  const resolved = new Set();

  while (stack.length !== 0) {
    const currentNode = stack.pop();

    if (!resolved.has(currentNode)) {
      resolved.add(currentNode);
      for (let i = 0; i < currentNode.to.length; i += 1) {
        stack.push(currentNode.to[i]);
        edges.push([currentNode, currentNode.to[i]]);
      }
    }
  }

  try {
    return toposort(edges);
  } catch (e) {
    if (silent) delete e.predecessors;
    throw e;
  }
}

function unroll(rootNode, opts = {}) {
  const queue = [rootNode];
  const sequence = [];

  while (queue.length > 0) {
    const node = queue.shift();
    const sortedNodes = sortChildren(node.children, opts.silent);
    queue.unshift(...sortedNodes);
    sequence.push(node);
  }
  return sequence;
}

function toJson(node, opts = {}) {
  const sortedNodes = sortChildren(node.children, opts.silent);

  const json = node.toJson(opts);
  json.children = [];
  for (let i = 0; i < sortedNodes.length; i += 1) {
    json.children.push(toJson(sortedNodes[i], opts));
  }
  return json;
}


function compile(node, writer, opts = {}) {
  if ('preCompile' in node) node.preCompile(writer, opts);

  const sortedNodes = sortChildren(node.children, opts.silent);

  node.build(writer, opts);

  for (let i = 0; i < sortedNodes.length; i += 1) {
    sortedNodes[i].compile(writer, opts);
  }

  if ('postCompile' in node) node.postCompile(writer, opts);
}

/**
 * Prettyfy arguments passing.
 * input:
 * python_fuction(arg1=arg1
 * arg2=arg2
 * arg3=arg3)
 *
 * output:
 * python_fuction(arg1=arg1
 *                arg2=arg2
 *                arg3=arg3)
 * @param  {String} funcCall Function call as string.
 * @return {String}          Pretty function call.
 */
function allignArguments(funcCall) {
  const lines = funcCall.split('\n');
  let index = 0;
  while (lines[0][index] !== '(') {
    index += 1;
  }
  index += 1;

  for (let i = 1; i < lines.length; i += 1) {
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
  const {
    inputLength,
    filterSize,
    padding,
    stride,
    dilation = 1,
  } = args;

  if (!inputLength) {
    throw Error('Missing inputLength.');
  }

  const dilatedFilterSize = filterSize + ((filterSize - 1) * (dilation - 1));

  let outputLength;
  switch (padding.toLowerCase()) {
    case 'same':
    case 'causal':
      outputLength = inputLength;
      break;
    case 'valid':
      outputLength = (inputLength - dilatedFilterSize) + 1;
      break;
    case 'full':
      outputLength = (inputLength + dilatedFilterSize) - 1;
      break;
    default:
      throw Error(`Unrecognized value for padding. Got ${padding}`);
  }

  return Math.floor(((outputLength + stride) - 1) / stride);
}

/**
 * Convert JS variable to Python variable.
 * @param  {Any} mvalue JS value.
 * @return {Any}        Python value as string.
 */
function toString(mvalue) {
  let value = mvalue;

  if (typeof value === 'boolean') {
    return value ? 'True' : 'False';
  }

  if (value === undefined || value == null) {
    return 'None';
  }

  if (typeUtils.isArray(value)) {
    const convert = (e) => {
      toString(e);
    };
    value = value.map(convert);

    const res = value.join(', ');
    return `[${res}]`;
  }

  if (typeUtils.isString(value)) {
    return `'${value}'`;
  }

  if (typeUtils.isObject(value)) {
    return JSON.stringify(value);
  }

  return value.toString();
}

module.exports = {
  sortChildren,
  compile,
  getName,
  allignArguments,
  computeConvOutputLength,
  unroll,
  toString,
  toJson,
};
