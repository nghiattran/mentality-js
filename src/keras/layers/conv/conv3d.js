const clone = require('lodash').clone;

const Conv = require('./conv');

/**
 * Convolution 3D
 * @extends mentality.keras.layers.Conv
 * @memberof mentality.keras.layers
 */
class Conv3D extends Conv {
  /**
   * Constructor
   * @param  {Object}             args  Properties of conv layer.
   * @param  {Layer | undefined}  input Input layer.
   * @return {Conv}
   */
  constructor(args = {}, input) {
    const newArgs = clone(args);
    newArgs.rank = 3;

    super(newArgs, input);
  }
}

module.exports = Conv3D;
