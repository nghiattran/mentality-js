'use strict';

const Layer = require('./layer');
const Variable = require('../../variable');
const utils = require('../../utils');

module.exports = class Flatten extends Layer {
  constructor(args={}, input) {
    args.name = args.name || utils.getName('flatten');
    super(args);

    this.setInput(input);
  }

  computeOutputShape() {
    function isDefined(entry) {
      return entry;
    }

    function pro(cum, value) {
      return cum * value;
    }

    if (!this.input.shape.every(isDefined))
      throw Error('Input of Flatten layer is not fully defined.');

    return [this.input.shape[0], this.input.shape.slice(1).reduce(pro, 1)];
  }

  build(graph, opts) {
    let line = `${this.output.name} = keras.layers.core.Flatten()(${this.input.name})`;

    graph.writer.emitLine(line);
    graph.writer.emitNewline();
  }
}