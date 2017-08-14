/**
 * This module contains functions used to check variable type.
 * @module utils
 * @memberof mentality
 */

const toposort = require('./toposort');
const typeUtils = require('./type_utils');

const nameCollection = {};


module.exports = {
  /**
   * Get a name with `prefix`. If `prefix` hasn't used yet, returns `prefix`. If it is used, return name with `prefix` and number of occurrences.
   *
   * @example
   * getName('myname');     // 'myname'
   * getName('myname');     // 'myname_1'
   * getName('myname');     // 'myname_2'
   * getName('myname');     // 'myname_3'
   * getName('myname');     // 'myname_4'
   * 
   * @param  {string} prefix Prefix of the name.
   * @return {string}        Generated name from name pool.
   */
  getName(prefix) {
    let name;
    if (prefix in nameCollection) {
      nameCollection[prefix] += 1;
      name = `${prefix}_${nameCollection[prefix]}`;
    } else {
      nameCollection[prefix] = 0;
      name = prefix;
    }

    return name;
  },

  sortChildren(heads, silent = true) {
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
  },

  unroll(rootNode, opts = {}) {
    const queue = [rootNode];
    const sequence = [];

    while (queue.length > 0) {
      const node = queue.shift();
      const sortedNodes = this.sortChildren(node.children, opts.silent);
      queue.unshift(...sortedNodes);
      sequence.push(node);
    }
    return sequence;
  },

  /**
   * Prettify arguments passing.
   *
   * @todo Reconsider
   * 
   * @example
   * let funcCall = 'python_fuction(arg1=arg1\narg2=arg2\narg3=arg3)';
   *
   * allignArguments(funcCall)
   * 
   * // python_fuction(arg1=arg1
   * //                arg2=arg2
   * //                arg3=arg3)
   * @param  {String} funcCall call as string.
   * @return {String}          Pretty call.
   */
  allignArguments(funcCall) {
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
  },


  /**
   * Determines output length of a convolution given input length. Based on {@link https://github.com/fchollet/keras/blob/master/keras/utils/conv_utils.py#L90 Keras}
   * @param  {Object}   args              Arguments used to compute output length.
   * @param  {number}  args.inputLength
   * @param  {number}  args.filterSize
   * @param  {number}  args.padding       One of "same", "valid", "full".
   * @param  {number}  args.stride       
   * @param  {number}  args.dilation    
   * @return {number}                     The output length.
   */
  computeConvOutputLength(args) {
    const {
      inputLength,
      filterSize,
      padding,
      stride,
      dilation = 1,
    } = args;

    if (!inputLength) {
      throw new Error('Missing inputLength.');
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
        throw new Error(`Unrecognized value for padding. Got ${padding}`);
    }

    return Math.floor(((outputLength + stride) - 1) / stride);
  },

  /**
   * Convert JS variable to Python variable.
   *
   * @example
   * toString(1)                      // '1'
   * toString(true)                   // 'True'
   * toString(false)                  // 'False'
   * toString(null)                   // 'None'
   * toString(undefined)              // 'None'
   * toString([1, 2, 3])              // '[1, 2, 3]'
   * toString([1, true, null, 'hi'])  // '[1, True, None, 'hi']'
   * toString('string')               // 'string'
   * 
   * @param  {Any} mvalue JS value.
   * @return {Any}        Python value as string.
   */
  toString(mvalue) {
    let value = mvalue;

    if (typeof value === 'boolean') {
      return value ? 'True' : 'False';
    }

    if (value === undefined || value == null) {
      return 'None';
    }

    if (typeUtils.isArray(value)) {
      value = value.map(e => toString(e));

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
  },
};
