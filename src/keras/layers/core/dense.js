const lodashDefaults = require('lodash').defaults;

const Layer = require('../layer');
const Weights = require('../../weights');

/* 
@node Dense
@description Dense implements the operation: `output = activation(dot(input, kernel) + bias)`` where activation is the element-wise activation function passed as the activation argument, kernel is a weights matrix created by the layer, and bias is a bias vector created by the layer (only applicable if `use_bias` is True).
@path keras.layers.Dense

@property    units
@type     number
@required true
@step     0
@min      1
@description Positive integer, dimensionality of the output space.

@property activation
@type     text
@description     Activation function to use (see activations). If you don't specify anything, no activation is applied (ie. "linear" activation: a(x) = x).

@property use_bias
@type     checkbox
@description      Boolean, whether the layer uses a bias vector.

@property     kernel_initializer
@type         text
@description  Initializer for the `kernel` weights matrix (see ![initializers](https://keras.io/initializers/)).

@property     bias_initializer
@type         text
@description  Initializer for the bias vector (see ![initializers](https://keras.io/initializers/)).

@property     kernel_regularizer
@type         text
@description  Regularizer function applied to the `kernel` weights matrix (see ![regularizer](https://keras.io/regularizers/)).

@property     bias_regularizer
@type         text
@description  Regularizer function applied to the bias vector (see ![regularizer](https://keras.io/regularizers/)).

@property     activity_regularizer
@type         text
@description  Regularizer function applied to the output of the layer (its "activation"). (see ![regularizer](https://keras.io/regularizers/)).

@property     kernel_constraint
@type         text
@description  Constraint function applied to the kernel weights matrix (see ![constraints](https://keras.io/constraints/)).

@property     bias_constraint
@type         text
@description  Constraint function applied to the bias vector  (see ![constraints](https://keras.io/constraints/)).
 */

/**
 * Utility class used to store all parameters for Dense layer. 
 */
class DenseParameter {
  constructor(args) {
    let required = {
      units: args.units
    };
    let optional = new Weights(args);

    this.get = opts => lodashDefaults(required, optional.getConfig(opts));

    this.getByKey = (key) => {
      if (key in required) {
        return required[key]
      } else {
        return optional.getConfigByKey(key);
      }
    }

    this.setByKey = (key, value) => {
      if (key in required) {
        required[key] = value;
      } else {
        optional.setConfigByKey(key, value);
      }
    }

    this.toParams = (opts) => {
      const requiredParams = [
        `units=${required.units}`,
      ];
      const weightParams = optional.toParams(opts);
      return requiredParams.concat(weightParams).join(',\n');
    }

    this.getDefault = () => {
      return optional.getDefaultConfig();
    }
  }
}

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
    this.parameters = new DenseParameter(args);
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
    outputShape[outputShape.length - 1] = this.parameters.getByKey('units');

    return outputShape;
  }

  /**
   * Build layer.
   * @param  {Writer} writer Writer object used to build.
   * @param  {Object} opts   Options.
   */
  build(writer, opts = {}) {
    const params = this.parameters.toParams();

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
    return lodashDefaults(this.parameters.get(opts), super.toJson(opts));
  }

  /**
   * Get neurons in this layer.
   * @return {Number}   Number of neurons.
   */
  countNeurons() {
    return this.parameters.getByKey('units');
  }

  /**
   * Get connections in this layer.
   * @return {Number}   Number of neurons.
   */
  countWeights() {
    return this.input.computeOutputShape()[1] * this.parameters.getByKey('units');
  }
}

module.exports = Dense;
