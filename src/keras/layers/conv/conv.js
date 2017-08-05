const lodashDefaults = require('lodash').defaults;
const lodashFill = require('lodash').fill;

const Layer = require('../layer');
const utils = require('../../../utils/utils');
const typeUtils = require('../../../utils/type_utils');
const Weights = require('../../weights');
const Config = require('../../config');

class ConvOptionalConfig extends Config {
  constructor(config = {}) {
    super({
      strides: 1,
      padding: 'same',
      dataFormat: 'channels_last',
      dilationRate: 1,
    }, config);
  }
}

/**
 * Base object for all Convolution layers.
 * @extends mentality.keras.layers.Layer
 * @memberof mentality.keras.layers
 */
class Conv extends Layer {
  /**
   * Constructor
   * @param  {Object}             args  Properties of conv layer.
   * @param  {Layer | undefined}  input Input layer.
   * @return {Conv}
   */
  constructor(args = {}, input) {
    super(args);

    const {
      filters,
      kernelSize,
      rank,
    } = args;

    this.rank = rank;
    this.filters = filters;
    this.kernelSize = kernelSize;
    this.optionalConfig = new ConvOptionalConfig(args);
    this.weightConfig = new Weights(args);

    this.setInput(input);
  }

  /**
   * Compute shape of output tensor.
   * @return {number[]} Output tensor's shape.
   */
  computeOutputShape() {
    const inputShape = this.input.computeOutputShape();
    const config = this.optionalConfig.getConfig({ verbose: true });
    const {
      padding,
      dataFormat,
      dilationRate,
    } = config;
    let { strides } = config;

    if (typeUtils.isNumber(strides)) {
      const value = strides;
      strides = lodashFill(Array(this.rank), value);
    }

    if (dataFormat === 'channels_last') {
      const space = inputShape.slice(1, inputShape.length - 1);
      const newSpace = [];

      for (let i = 0; i < space.length; i += 1) {
        const newDim = utils.computeConvOutputLength({
          padding,
          inputLength: space[i],
          filterSize: this.kernelSize[i],
          stride: strides[i],
          dilation: dilationRate[i],
        });

        newSpace.push(newDim);
      }
      return [inputShape[0]].concat(newSpace).concat(this.filters);
    } else if (dataFormat === 'channels_first') {
      const space = inputShape.slice(2);
      const newSpace = [];

      for (let i = 0; i < space.length; i += 1) {
        const newDim = utils.computeConvOutputLength({
          padding,
          inputLength: space[i],
          filterSize: this.kernelSize[i],
          stride: strides[i],
          dilation: dilationRate[i],
        });

        newSpace.push(newDim);
      }

      return [inputShape[0]].concat(this.filters).concat(newSpace);
    }

    throw new Error(`Unrecognized data format. Got ${dataFormat}.`);
  }

  /**
   * Build layer.
   * @param  {Writer} writer Writer object used to build.
   * @param  {Object} opts   Options.
   */
  build(writer, opts = {}) {
    const requiredParams = [
      `filters=${this.filters}`,
      `kernel_size=${utils.toString(this.kernelSize)}`,
    ];
    const weightParams = this.weightConfig.toParams(opts);
    const optionalParams = this.optionalConfig.toParams(opts);
    const params = requiredParams.concat(weightParams).concat(optionalParams).join(',\n');

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
    const weightJson = this.weightConfig.getConfig(opts);
    const optionalJson = this.optionalConfig.getConfig(opts);

    const convJson = {
      filters: this.filters,
      kernelSize: this.kernelSize,
    };

    return lodashDefaults(convJson, weightJson, optionalJson);
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

module.exports = Conv;
