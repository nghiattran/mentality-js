'use strict';

const nnstats = require('nnstats');

const Layer = require('./layer');
const ops = require('../ops');
const FunctionCall = ops.FunctionCall;
const Assignment = ops.Assignment;

module.exports = class Conv extends Layer {
  constructor(args, input) {
    args.name = args.name || utils.getName('conv');
    super(args.name, input);

    this.addWeightAndBias(args.filter);
    
    // let tranformation = new FunctionCall('tf.nn.conv2d', {
    //   input,
    //   filter: this.weight,
    //   strides: args.strides,
    //   padding: args.padding
    // });

    // this.stats = nnstats.tfAnalyzer.analyzeConvTF(
    //   input.shape,
    //   [args.filter[0], args.filter[1], args.filter[3]],
    //   args.strides,
    //   args.padding
    // );

    // this.set(args.filter, args.activation, tranformation);
  }

  generate(graph, opts) {
    this.generateWith(graph, opts);
  }

  getShape() {
    return this.stats.output;
  }
}