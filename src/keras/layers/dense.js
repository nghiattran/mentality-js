'use strict';

const nnstats = require('nnstats');

const Layer = require('./layer');
const utils = require('../../utils');
const Variable = require('../../variable');

module.exports = class Dense extends Layer {
  constructor(args, input) {
    args.name = args.name || utils.getName('dense');

    super(args, input);

    this.addWeights(args);

    this.units = args.units;

    this.setInput(input);
  }

  computeOutputShape() {
    let outputShape = Array.from(this.input.shape);
    outputShape[outputShape.length - 1] = this.units;
    return outputShape;
  }

  build(graph, opts) {
    let lines = `${this.output.name} = keras.layers.core.Dense(units=${this.units},
    activation='${this.activation}',
    use_bias=${this.use_bias ? 'True' : 'False'},
    kernel_initializer='glorot_uniform',
    bias_initializer='zeros',
    kernel_regularizer=${this.kernel_regularizer},
    bias_regularizer=${this.bias_regularizer}, 
    activity_regularizer=${this.activity_regularizer},
    kernel_constraint=${this.kernel_constraint},
    bias_constraint=${this.bias_constraint})(${this.input.name})`;

    graph.writer.emitFunctionCall(lines);
    graph.writer.emitNewline();
  }
}