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
 * Utility class used to store all parameters for Conv layer. 
 */
class ConvParameter {
  constructor(args) {
    const required = {
      rank: args.rank,
      filters: args.filters,
      kernelSize: args.kernelSize,
    };

    const optional = new ConvOptionalConfig(args);
    const weight = new Weights(args);

    this.get = opts => lodashDefaults(required, optional.getConfig(opts), weight.getConfig(opts));
    

    this.getByKey = (key) => {
      if (key in required) {
        return required[key]
      } else if (key in optional) {
        return optional.getConfigByKey(key);
      } else {
        return weight.getConfigByKey(key);
      }
    }

    this.setByKey = (key, value) => {
      if (key in required) {
        required[key] = value;
      } else if (key in optional) {
        optional.setConfigByKey(key, value);
      } else {
        weight.setConfigByKey(key, value);
      }
    }

    this.toParams = (opts) => {
      const keys = Object.keys(required);
      const requiredParams = keys.map(key => utils.toString(required[key]));
      const weightParams = weight.toParams(opts);
      const optionalParams = optional.toParams(opts);

      return requiredParams.concat(weightParams)
        .concat(weightParams)
        .join(',\n');
    }
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
    this.parameters = new ConvParameter(args);
    this.setInput(input);
  }

  /**
   * Compute shape of output tensor.
   * @return {number[]} Output tensor's shape.
   */
  computeOutputShape() {
    const inputShape = this.input.computeOutputShape();
    const parameters = this.parameters.get({ verbose: true });
    
    const {
      padding,
      dataFormat,
      dilationRate,
      rank,
      filters,
      kernelSize,
    } = parameters;
    let {strides} = parameters;

    if (typeUtils.isNumber(strides)) {
      const value = strides;
      strides = lodashFill(Array(rank), value);
    }

    if (dataFormat === 'channels_last') {
      const space = inputShape.slice(1, inputShape.length - 1);
      const newSpace = [];

      for (let i = 0; i < space.length; i += 1) {
        const newDim = utils.computeConvOutputLength({
          padding,
          inputLength: space[i],
          filterSize: kernelSize[i],
          stride: strides[i],
          dilation: dilationRate[i],
        });

        newSpace.push(newDim);
      }
      return [inputShape[0]].concat(newSpace).concat(filters);
    } else if (dataFormat === 'channels_first') {
      const space = inputShape.slice(2);
      const newSpace = [];

      for (let i = 0; i < space.length; i += 1) {
        const newDim = utils.computeConvOutputLength({
          padding,
          inputLength: space[i],
          filterSize: kernelSize[i],
          stride: strides[i],
          dilation: dilationRate[i],
        });

        newSpace.push(newDim);
      }

      return [inputShape[0]].concat(filters).concat(newSpace);
    }

    throw new Error(`Unrecognized data format. Got ${dataFormat}.`);
  }

  /**
   * Build layer.
   * @param  {Writer} writer Writer object used to build.
   * @param  {Object} opts   Options.
   */
  build(writer, opts = {}) {
    const {
      padding,
      dataFormat,
      dilationRate,
      strides,
      rank,
      filters,
      kernelSize,
    } = this.parameters.get({ verbose: true });

    const requiredParams = [
      `filters=${filters}`,
      `kernel_size=${utils.toString(kernelSize)}`,
    ];

    const lines = `${this.getName()} = mentality.keras.layers.${this.getType()}(${this.parameters.toParams(opts)})(${this.input.getName()})`;

    writer.emitFunctionCall(lines);
    writer.emitNewline();
  }

  /**
   * Export layer as JSON.
   * @param  {Object} opts  Options.
   * @return {Object}       Layer properties as JSON.
   */
  toJson(opts = {}) {
    return this.parameters.get(opts);
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
