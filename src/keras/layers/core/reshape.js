const lodashDefaults = require('lodash').defaults;

const Layer = require('../layer');
const utils = require('../../../utils/utils');

/**
 * Reshape layer used to reshape a tensor.
 * @extends @memberof mentality.keras.layers.Layer
 * @memberof mentality.keras.layers
 */
class Reshape extends Layer {
  /**
   * Constructor
   * @param  {Object}             args  Properties of conv layer.
   * @param  {Layer | undefined}  input Input layer.
   * @return {Conv}
   */
  constructor(args = {}, input) {
    super(args);

    this.targetShape = args.targetShape;

    this.setInput(input);
  }

  /**
   * Set a layer as an input of this layer. This function vadilate if reshaping input to target shape is achivable.
   */
  setInput(input) {
    if (!input) return;

    this.targetShape.unshift(input.shape[0]);

    const inputShape = input.shape.slice(1);
    const targetShape = this.targetShape.slice(1);
    function prod(cum, value) {
      return cum * value;
    }

    if (inputShape.reduce(prod, 1) !== targetShape.reduce(prod, 1)) {
      throw new Error(`Target shape is not compatible with input shape. Got ${utils.toString(input.shape)} and ${utils.toString(this.targetShape)}.`);
    }

    super.setInput(input);
  }

  /**
   * Compute output shape.
   * @return {Number[]} Output Shape
   */
  computeOutputShape() {
    return this.targetShape;
  }

  /**
   * Build layer.
   * @param  {Writer} writer Writer object used to build.
   * @param  {Object} opts   Options.
   */
  build(writer, opts = {}) {
    const line = `${this.getName()} = tf.reshape(tensor=${this.input.getName()}, shape=${utils.toString(this.targetShape)})`;

    writer.emitLine(line);
    writer.emitNewline();
  }

  /**
   * Export layer as JSON.
   * @param  {Object} opts  Options.
   * @return {Object}       Layer properties as JSON.
   */
  toJson(opts = {}) {
    return lodashDefaults({
      targetShape: this.targetShape,
    }, super.toJson());
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

module.exports = Reshape;
