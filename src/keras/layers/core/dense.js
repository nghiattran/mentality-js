const lodashDefaults = require('lodash').defaults;

const Layer = require('../layer');
const Weights = require('../../weights');

/* 
@node Dense
@description Dense implements the operation: output = activation(dot(input, kernel) + bias) where activation is the element-wise activation function passed as the activation argument, kernel is a weights matrix created by the layer, and bias is a bias vector created by the layer (only applicable if use_bias is True).

@property    units
@type     number
@required true
@step     0
@min      1
@description Positive integer, dimensionality of the output space.

@property activation
@type     text

@description     Activation function to use (see activations). If you don't specify anything, no activation is applied (ie. "linear" activation: a(x) = x)
 */

/**
 * Regular fully-connected layer.
 * @extends mentality.keras.layers.Layer
 * @memberof mentality.keras.layers
 */
class Dense extends Layer {
  /**
   * Constructor
   * @param  {Object}             args  Properties of conv layer.
   * @param  {Layer | undefined}  input Input layer.
   * @return {Conv}
   */
  constructor(args = {}, input) {
    super(args, input);

    this.weightConfig = new Weights(args);
    this.units = args.units;
    this.setInput(input);
  }

  /**
   * Compute shape of output tensor.
   * 
   * @return {number[]} Output tensor's shape.
   */
  computeOutputShape() {
    const inputShape = this.input.computeOutputShape();

    if (inputShape.length > 2) throw new Error(`Invalid shape. Expected shape length 2. Got ${inputShape.length}.`);

    const outputShape = Array.from(inputShape);
    outputShape[outputShape.length - 1] = this.units;
    return outputShape;
  }

  /**
   * Build layer.
   * @param  {Writer} writer Writer object used to build.
   * @param  {Object} opts   Options.
   */
  build(writer, opts = {}) {
    const requiredParams = [
      `units=${this.units}`,
    ];
    const weightParams = this.weightConfig.toParams(opts);
    const params = requiredParams.concat(weightParams).join(',\n');

    const lines = `${this.getName()} = mentality.keras.layers.Dense(${params})(${this.input.getName()})`;

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
      units: this.units,
    }, this.weightConfig.getConfig(opts), super.toJson(opts));
  }

  /**
   * Get neurons in this layer.
   * @return {Number}   Number of neurons.
   */
  countNeurons() {
    return this.units;
  }

  /**
   * Get connections in this layer.
   * @return {Number}   Number of neurons.
   */
  countWeights() {
    return this.input.computeOutputShape()[1] * this.units;
  }
}

module.exports = Dense;
