'use strict';

const Layer = require('./layer');
const Variable = require('../../variable');
const utils = require('../../utils');

module.exports = class Pool2D extends Layer {
  constructor(args={}, input) {
    args.name = args.name || utils.getName('flatten');
    super(args);

    const {
      poolSize,
      strides=[1,1],
      padding='same',
      dataFormat='channels_last',
      dilationRate=[1, 1],
      name=utils.getName('conv')
    } = args;
    
    this.poolSize = poolSize;
    this.strides = strides;
    this.padding = padding;
    this.dataFormat = dataFormat;

    this.setInput(input);
  }

  computeOutputShape() {
    let rows, cols;
    if (this.data_format === 'channels_first') {
      rows = this.input.shape[2];
      cols = this.input.shape[3];
    } else if (this.data_format === 'channels_last') {
      rows = this.input.shape[1];
      cols = this.input.shape[2];
    }

    rows = utils.computeConvOutputLength({
      inputLength: rows,
      filterSize: this.poolSize[0],
      padding: this.padding,
      stride: this.strides[0]
    });

    cols = utils.computeConvOutputLength({
      inputLength: cols,
      filterSize: this.poolSize[1],
      padding: this.padding,
      stride: this.strides[1]
    });

    if (this.data_format === 'channels_first') {
      return (this.input.shape[0], this.input.shape[1], rows, cols);
    } else if (this.data_format === 'channels_last') {
      return (this.input.shape[0], rows, cols, this.input.shape[3]);
    }
  }

  build(graph, opts) {
    let line = `${this.output.name} = keras.layers.core.Flatten()(${this.input.name})`;

    graph.writer.emitLine(line);
    graph.writer.emitNewline();
  }
}