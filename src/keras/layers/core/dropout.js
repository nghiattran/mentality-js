const lodashDefaults = require('lodash').defaults;

const Layer = require('../layer');
const utils = require('../../../utils/utils');

/**
 * Dropout layer.
 * @extends mentality.keras.layers.Layer
 * @memberof mentality.keras.layers
 */
class Dropout extends Layer {
  /**
   * Constructor
   * @param  {Object}             args  Properties of conv layer.
   * @param  {Layer | undefined}  input Input layer.
   * @return {Conv}
   */
  constructor(args = {}, input) {
    super(args);

    this.rate = args.rate;
    this.noiseShape = args.noiseShape;
    this.seed = args.seed;

    this.setInput(input);
  }

  /**
   * Compute shape of output tensor.
   * 
   * @return {number[]} Output tensor's shape.
   */
  computeOutputShape() {
    return this.input.computeOutputShape();
  }

  /**
   * Build layer.
   * @param  {Writer} writer Writer object used to build.
   * @param  {Object} opts   Options.
   */
  build(writer, opts = {}) {
    const lines = `${this.getName()} = mentality.keras.layers.core.Dropout(${this.rate},
    noise_shape=${utils.toString(this.noiseShape)},
    seed=${utils.toString(this.seed)})(${this.input.getName()})`;

    writer.emitFunctionCall(lines);
    writer.emitNewline();
  }

  /**
   * Export layer as JSON.
   * @param  {Object} opts  Options.
   * @return {Object}       Layer properties as JSON.
   */
  toJson(opts = {}) {
    return lodashDefaults({
      rate: this.rate,
      noiseShape: this.noiseShape,
      seed: this.seed,
    }, super.toJson(opts));
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

module.exports = Dropout;
