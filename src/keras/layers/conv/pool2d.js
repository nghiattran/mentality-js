const lodashDefaults = require('lodash').defaults;

const Layer = require('../layer');
const Config = require('../../config');
const utils = require('../../../utils/utils');


class PoolOptionalConfig extends Config {
  constructor(config = {}) {
    super({
      strides: undefined,
      padding: 'valid',
      dataFormat: 'channels_last',
    }, config);
  }
}

/**
 * @extends mentality.keras.layers.Layer
 * @memberof mentality.keras.layers
 */
class Pool2D extends Layer {
  /**
   * Constructor
   * @param  {Object}             args  Properties of conv layer.
   * @param  {Layer | undefined}  input Input layer.
   * @return {Conv}
   */
  constructor(args = {}, input) {
    super(args);

    const {
      poolSize,
    } = args;

    const newArgs = lodashDefaults(args, {
      strides: poolSize,
    });

    this.poolSize = poolSize;
    this.optionalConfig = new PoolOptionalConfig(newArgs);

    this.setInput(input);
  }

  /**
   * Compute shape of output tensor.
   * 
   * @return {number[]} Output tensor's shape.
   */
  computeOutputShape() {
    let rows;
    let cols;

    const inputShape = this.input.computeOutputShape();
    const {
      strides,
      padding,
      dataFormat,
    } = this.optionalConfig.getConfig({ verbose: true });

    if (dataFormat === 'channels_first') {
      rows = inputShape[2];
      cols = inputShape[3];
    } else if (dataFormat === 'channels_last') {
      rows = inputShape[1];
      cols = inputShape[2];
    } else {
      throw new Error(`Unrecognized data format. Got ${this.dataFormat}`);
    }

    rows = utils.computeConvOutputLength({
      padding,
      inputLength: rows,
      filterSize: this.poolSize[0],
      stride: strides[0],
    });

    cols = utils.computeConvOutputLength({
      padding,
      inputLength: cols,
      filterSize: this.poolSize[1],
      stride: strides[1],
    });

    if (dataFormat === 'channels_first') {
      return [inputShape[0], inputShape[1], rows, cols];
    } else if (dataFormat === 'channels_last') {
      return [inputShape[0], rows, cols, inputShape[3]];
    }

    throw new Error(`Unrecognized data format. Get ${this.dataFormat}`);
  }

  /**
   * Build layer.
   * @param  {Writer} writer Writer object used to build.
   * @param  {Object} opts   Options.
   */
  build(writer, opts = {}) {
    const requiredParams = [
      `pool_size=${utils.toString(this.poolSize)}`,
    ];
    const optionalParams = this.optionalConfig.toParams(opts);
    const params = requiredParams.concat(optionalParams).join(',\n');

    const lines = `${this.getName()} = mentality.keras.layers.${this.getType()}(${params})(${this.input.getName()})`;

    writer.emitFunctionCall(lines);
    writer.emitNewline();
  }

  /**
   * Export layer as JSON.
   * @param  {Object} opts  Options.
   * @return {Object}       Layer properties as JSON.
   */
  toJson(opts = {}) {
    const poolJson = {
      poolSize: this.poolSize,
      strides: this.strides,
      padding: this.padding,
      dataFormat: this.dataFormat,
    };
    return lodashDefaults(poolJson, super.toJson(opts));
  }

  /**
   * Get neurons in this layer.
   * @return {Number}   Number of neurons.
   */
  countNeurons() {
    return 0;
  }

  /**
   * Get connections in this layer.
   * @return {Number}   Number of neurons.
   */
  countWeights() {
    return 0;
  }
}

module.exports = Pool2D;
