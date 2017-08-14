const Node = require('../../node');

/**
 * Base class of all layers.
 * @extends Node
 * @memberof mentality.keras.layers
 */
class Layer extends Node {
  /**
   * Constructor.
   * @param  {String} options.name Name of layer.
   * @return {Layer}
   */
  constructor({ name }) {
    super(name);

    /**
     * The layer's input.
     */
    this.input = undefined;
  }

  /**
   * Set a layer as an input of this layer.
   * @param {Layer}   Input Input layer.
   * @return {Layer}  The object itself.
   */
  setInput(input) {
    if (!input) {
      return this;
    }

    if (this.input) {
      throw new Error('Input has been set already.');
    }

    this.input = input;
    input.link(this);

    return this;
  }

  /**
   * Interface function for computing shape of output tensor.
   * @abstract
   */
  computeOutputShape() {
    throw new Error('Unimplemented.');
  }

  /**
   * Interface function for counting number of neurons in layer.
   * @abstract
   */
  countNeurons() {
    throw new Error('Unimplemented.');
  }

  /**
   * Interface function for counting weights in layer.
   * @abstract
   */
  countWeights() {
    throw new Error('Unimplemented.');
  }
}

module.exports = Layer;
