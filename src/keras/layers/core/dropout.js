const Layer = require('../layer');
const utils = require('../../../utils/utils');

module.exports = class Dropout extends Layer {
  constructor(args = {}, input) {
    super(args);

    this.rate = args.rate;
    this.noiseShape = args.noiseShape;
    this.seed = args.seed;

    this.setInput(input);
  }

  computeOutputShape() {
    return this.input.shape;
  }

  build(writer, opts) {
    const lines = `${this.output.name} = keras.layers.core.Dropout(${this.rate},
    noise_shape=${utils.toString(this.noiseShape)},
    seed=${utils.toString(this.seed)})(${this.input.name})`;

    writer.emitFunctionCall(lines);
    writer.emitNewline();
  }

  toJson(opt = {}) {
    const json = {
      type: this.constructor.name,
      name: this.name,
      rate: this.rate,
      noiseShape: this.noiseShape,
      seed: this.seed,
    };

    return json;
  }
};
