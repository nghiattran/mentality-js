const Layer = require('../layer');

/**
 * @extends mentality.keras.layers.Layer
 * @memberof mentality.keras.layers
 */
class Input extends Layer {
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
    return this.input.computeOutputShape();
  }

  /**
   * Build layer.
   * @param  {Writer} writer Writer object used to build.
   * @param  {Object} opts   Options.
   */
  build(writer, opts = {}) {
    const line = `${this.getName()} = mentality.keras.layers.Input(tensor=${this.input.getName()})`;

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

module.exports = Input;
