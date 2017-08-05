const Layer = require('../layer');

function isDefined(entry) {
  return entry;
}

function pro(cum, value) {
  return cum * value;
}

/**
 * Flatten layer which convert multi-dimension tensor into 2D tensor [`batch`, `neurons`].
 * @extends mentality.keras.layers.Layer
 * @memberof mentality.keras.layers
 */
class Flatten extends Layer {
  /**
   * Constructor
   * @param  {Object}             args  Properties of conv layer.
   * @param  {Layer | undefined}  input Input layer.
   * @return {Conv}
   */
  constructor(args = {}, input) {
    super(args);

    this.setInput(input);
  }

  /**
   * Compute shape of output tensor.
   * 
   * @return {number[]} Output tensor's shape.
   */
  computeOutputShape() {
    const inputShape = this.input.computeOutputShape();

    if (!inputShape.every(isDefined)) {
      throw new Error('Input of Flatten layer is not fully defined.');
    }
    return [inputShape[0], inputShape.slice(1).reduce(pro, 1)];
  }

  /**
   * Build layer.
   * @param  {Writer} writer Writer object used to build.
   * @param  {Object} opts   Options.
   */
  build(writer, opts = {}) {
    const line = `${this.getName()} = mentality.keras.layers.core.Flatten()(${this.input.getName()})`;

    writer.emitLine(line);
    writer.emitNewline();
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

module.exports = Flatten;
