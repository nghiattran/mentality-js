'use strict';

const nnstats = require('nnstats');

const Layer = require('./layer');
const utils = require('../../utils/utils');
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
    use_bias=${utils.toString(this.useBias === true)},
    kernel_initializer='glorot_uniform',
    bias_initializer='zeros',
    kernel_regularizer=${utils.toString(this.kernelRegularizer)},
    bias_regularizer=${utils.toString(this.biasRegularizer)}, 
    activity_regularizer=${utils.toString(this.activityRegularizer)},
    kernel_constraint=${utils.toString(this.kernelConstraint)},
    bias_constraint=${utils.toString(this.biasConstraint)})(${this.input.name})`;

    graph.writer.emitFunctionCall(lines);
    graph.writer.emitNewline();
  }

  toJson(opts={}) {
    let json = super.getWeightsJson();
    json.units = this.units;
    json.type = this.constructor.name;
    json.name = this.name;

    return json;
  }
}