const Layer = require('../layer');

module.exports = class Flatten extends Layer {
  constructor(args = {}, input) {
    super(args);

    this.setInput(input);
  }

  computeOutputShape() {
    function isDefined(entry) {
      return entry;
    }

    function pro(cum, value) {
      return cum * value;
    }

    if (!this.input.shape.every(isDefined)) {
      throw Error('Input of Flatten layer is not fully defined.');
    }
    return [this.input.shape[0], this.input.shape.slice(1).reduce(pro, 1)];
  }

  build(writer, opts) {
    const line = `${this.output.name} = keras.layers.core.Flatten()(${this.input.name})`;

    writer.emitLine(line);
    writer.emitNewline();
  }

  toJson(opt = {}) {
    const json = {
      type: this.constructor.name,
      name: this.name,
    };
    return json;
  }
};
