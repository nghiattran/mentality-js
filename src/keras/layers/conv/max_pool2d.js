const Pool2D = require('./pool2d');

/**
 * @extends mentality.keras.layers.Pool2D
 * @memberof mentality.keras.layers
 */
class MaxPool2D extends Pool2D {
  constructor(args = {}, input) {
    super(args, input);
  }
}

module.exports = MaxPool2D;
