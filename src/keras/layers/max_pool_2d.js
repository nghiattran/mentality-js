'use strict';

const Layer = require('./layer');
const Variable = require('../../variable');
const utils = require('../../utils/utils');
const Pool2D = require('./pool_2d');


module.exports = class MaxPool2d extends Pool2D {
  constructor(args={}, input) {
    args.name = args.name || utils.getName('flatten');
    super(args, input);
  }

  build(graph, opts) {
    let line = `${this.output.name} = keras.layers.pooling.MaxPooling2D(pool_size=${this.pool_size},
    strides=${this.strides},
    padding=${this.padding},
    data_format=${this.input.name})(${this.input.name})`;

    graph.writer.emitLine(line);
    graph.writer.emitNewline();
  }
}