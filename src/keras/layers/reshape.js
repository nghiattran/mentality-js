'use strict';

const Layer = require('./layer');
const Variable = require('../../variable');
const utils = require('../../utils/utils');

module.exports = class Reshape extends Layer {
  constructor(args={}, input) {
    args.name = args.name || utils.getName('reshape');
    super(args);

    this.targetShape = args.targetShape;

    this.setInput(input);
  }

  setInput(input) {
    if (!input) return;

    this.targetShape.unshift(input.shape[0]);

    let inputShape = input.shape.slice(1);
    let targetShape = this.targetShape.slice(1);
    function prod(cum, value) {
      return cum * value;
    }

    if (inputShape.reduce(prod, 1) !== targetShape.reduce(prod, 1))
      throw Error(`Target shape is not compatible with input shape. Got ${utils.toString(this.input.shape)} and ${utils.toString(this.targetShape)}.`)

    super.setInput(input);
  }

  computeOutputShape() {
    return this.targetShape;
  }

  build(graph, opts) {
    let line = `${this.output.name} = tf.reshape(tensor=${this.input.name}, shape=${utils.toString(this.targetShape)})`;

    graph.writer.emitLine(line);
    graph.writer.emitNewline();
  }

  toJson(opts={}) {
    let json = {
      type: this.constructor.name,
      name: this.name,
      targetShape: this.targetShape
    }
    return json;
  }
}