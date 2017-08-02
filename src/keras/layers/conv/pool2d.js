const Layer = require('../layer');
const utils = require('../../../utils/utils');

module.exports = class Pool2D extends Layer {
  constructor(args = {}, input) {
    super(args);

    const {
      poolSize,
      strides = [1, 1],
      padding = 'same',
      dataFormat = 'channels_last',
    } = args;

    this.poolSize = poolSize;
    this.strides = strides;
    this.padding = padding;
    this.dataFormat = dataFormat;

    this.setInput(input);
  }

  computeOutputShape() {
    let rows;
    let cols;

    if (this.dataFormat === 'channels_first') {
      rows = this.input.shape[2];
      cols = this.input.shape[3];
    } else if (this.dataFormat === 'channels_last') {
      rows = this.input.shape[1];
      cols = this.input.shape[2];
    } else {
      throw Error(`Unrecognized data format. Got ${this.dataFormat}`);
    }

    rows = utils.computeConvOutputLength({
      inputLength: rows,
      filterSize: this.poolSize[0],
      padding: this.padding,
      stride: this.strides[0],
    });

    cols = utils.computeConvOutputLength({
      inputLength: cols,
      filterSize: this.poolSize[1],
      padding: this.padding,
      stride: this.strides[1],
    });

    if (this.dataFormat === 'channels_first') {
      return [this.input.shape[0], this.input.shape[1], rows, cols];
    } else if (this.dataFormat === 'channels_last') {
      return [this.input.shape[0], rows, cols, this.input.shape[3]];
    }

    throw Error(`Unrecognized data format. Get ${this.dataFormat}`);
  }

  build(writer, opts) {
    const lines = `${this.output.name} = keras.layers.pooling.${this.getType()}(pool_size=${utils.toString(this.poolSize)},
    strides=${utils.toString(this.strides)},
    padding=${utils.toString(this.padding)},
    data_format=${utils.toString(this.dataFormat)})(${this.input.name})`;

    writer.emitFunctionCall(lines);
    writer.emitNewline();
  }

  toJson(opts = {}) {
    return {
      poolSize: this.poolSize,
      strides: this.strides,
      padding: this.padding,
      dataFormat: this.dataFormat,
    };
  }
};
