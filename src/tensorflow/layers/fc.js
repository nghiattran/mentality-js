'use strict';

const Layer = require('./layer');
const ops = require('../ops');
const FunctionCall = ops.FunctionCall;
const Assignment = ops.Assignment;
const Variable = require('../../variable');
const utils = require('../../utils');

module.exports = class FC extends Layer {
  constructor(args, input) {
    args.name = args.name || utils.getName('fc');
    if (utils.isArray(input.shape)) {
      let flattenOp = this.flatten(input, args.neurons);
      input = flattenOp.variable;
      flattenOp.link(input);
    }

    super(args.name, input);

    this.neurons = args.neurons;

    this.addWeightAndBias([-1, args.neurons]);

    let tranformation = new FunctionCall('tf.matmul', [input, this.weight]);
    this.set(args.filter, args.activation, tranformation);
  }

  flatten(input, neurons) {
    let flatten = new Variable(`${this.name}_flatten`);
    let parameters = {
      tensor: input,
      shape: [-1, neurons]
    }
    let assign = FunctionCall.assign(flatten, 'tf.reshape');

    return assign;
  }

  generate(graph, opts) {
    this.generateWith(graph, opts);
  }
}