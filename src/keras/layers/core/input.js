const Layer = require('../layer');

module.exports = class Input extends Layer {
  constructor(args = {}, input) {
    super(args);

    this.setInput(input);
  }

  computeOutputShape() {
    return this.input.shape;
  }

  build(writer, opts) {
    const line = `${this.output.name} = keras.layers.Input(tensor=${this.input.name})`;

    writer.emitLine(line);
    writer.emitNewline();
  }

  toJson(opts = {}) {
    const json = {
      type: this.constructor.name,
      name: this.name,
    };
    return json;
  }
};
