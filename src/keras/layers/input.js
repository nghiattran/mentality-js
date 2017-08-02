'use strict';

const Layer = require('./layer');
const Variable = require('../../variable');
const utils = require('../../utils/utils');

module.exports = class Input extends Layer {
  constructor(args={}, input) {
    args.name = args.name || utils.getName('input');
    super(args);

    this.setInput(input);
  }

  computeOutputShape() {
    return this.input.shape;
  }

  build(graph, opts) {
    let line = `${this.output.name} = keras.layers.Input(tensor=${this.input.name})`;

    graph.writer.emitLine(line);
    graph.writer.emitNewline();
  }

  toJson(opts={}) {
    let json = {
      type: this.constructor.name,
      name: this.name
    }
    return json;
  }
}