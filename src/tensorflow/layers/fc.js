'use strict';

const nnstats = require('nnstats');

const Layer = require('./layer');
const ops = require('../ops');
const FunctionCall = ops.FunctionCall;
const Assignment = ops.Assignment;
const Variable = require('../../variable');
const utils = require('../../utils');

function flatten(input, neurons, name) {
  let shape = [1];
  for (var i = 0; i < input.shape.length; i++) {
    shape[shape.length - 1] *= input.shape[i];
  }

  let flatten = new Variable(`${name}_flatten`, shape[shape.length - 1]);
  let parameters = {
    tensor: input,
    shape: [-1, neurons]
  }
  let assign = FunctionCall.assign(flatten, 'tf.reshape');

  return assign;
}

module.exports = class FC extends Layer {
  constructor(args, input) {
    args.name = args.name || utils.getName('fc');

    super(args.name, input);

    // if (utils.isArray(input.shape)) {
    //   let flattenOp = flatten(input, args.neurons, args.name);
    //   input = flattenOp.variable;
    //   this.addNode(flattenOp);
    //   this.input = flattenOp.variable
    // }

  }

  getShape() {
    return this.stats.output;
  }

  generate(graph, opts) {
    // this.generateWith(graph, opts);
  }
}