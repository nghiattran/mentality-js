'use strict';

const Layer = require('./layer');
const Variable = require('../../variable');
const utils = require('../../utils');

module.exports = class Conv extends Layer {
  constructor(args, input) {
    args.name = args.name || utils.getName('conv');
    super(args);

    this.addWeights(args);

    const {
      filters,
      kernelSize,
      strides=[1,1],
      padding='same',
      dataFormat='channels_last',
      dilationRate=[1, 1],
      name=utils.getName('conv')
    } = args;

    this.filters = filters;
    this.kernelSize = kernelSize;
    this.strides = strides;
    this.padding = padding;
    this.dataFormat = dataFormat;
    this.dilationRate = dilationRate;

    this.setInput(input);
  }

  computeOutputShape() {
    if (this.dataFormat === 'channels_last') {
      let space = this.input.shape.slice(1, this.input.shape.length - 1);
      let newSpace = [];

      for (let i = 0; i < space.length; i++) {
        let newDim = utils.computeConvOutputLength({
          inputLength: space[i],
          filterSize: this.kernelSize[i],
          padding: this.padding,
          stride: this.strides[i],
          dilation: this.dilationRate[i]
        })
        newSpace.push(newDim);
      }
      return [this.input.shape[0]].concat(newSpace).concat(this.filters);
    } else if (this.dataFormat === 'channels_first') {
      let space = this.input.shape.slice(2);
      let newSpace = [];

      for (let i = 0; i < space.length; i++) {
        let newDim = utils.computeConvOutputLength({
          inputLength: space[i],
          filterSize: this.kernelSize[i],
          padding: this.padding,
          stride: this.strides[i],
          dilation: this.dilationRate[i]
        })
        newSpace.push(newDim);
      }

      return [this.input.shape[0]].concat(this.filters).concat(newSpace);
    }
  }

  build(graph, opts) {
    let lines = `${this.output.name} = keras.layers.Conv2D(filters=${this.filters},
    kernel_size=${utils.toString(this.kernelSize)},
    strides=${utils.toString(this.strides)},
    padding='${this.padding}',
    data_format='${this.dataFormat}',
    dilation_rate=${utils.toString(this.dilationRate)},
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