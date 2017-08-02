const Layer = require('../layer');
const utils = require('../../../utils/utils');

module.exports = class Dense extends Layer {
  constructor(args, input) {
    super(args, input);

    this.addWeights(args);

    this.units = args.units;

    this.setInput(input);
  }

  computeOutputShape() {
    if (this.input.shape.length > 2) throw Error(`Invalid shape. Expected shape length 2. Got ${this.input.shape.length}.`);

    const outputShape = Array.from(this.input.shape);
    outputShape[outputShape.length - 1] = this.units;
    return outputShape;
  }

  build(writer, opts) {
    const lines = `${this.output.name} = keras.layers.core.Dense(units=${this.units},
    activation='${this.activation}',
    use_bias=${utils.toString(this.useBias === true)},
    kernel_initializer='glorot_uniform',
    bias_initializer='zeros',
    kernel_regularizer=${utils.toString(this.kernelRegularizer)},
    bias_regularizer=${utils.toString(this.biasRegularizer)}, 
    activity_regularizer=${utils.toString(this.activityRegularizer)},
    kernel_constraint=${utils.toString(this.kernelConstraint)},
    bias_constraint=${utils.toString(this.biasConstraint)})(${this.input.name})`;

    writer.emitFunctionCall(lines);
    writer.emitNewline();
  }

  toJson(opts = {}) {
    const json = super.getWeightsJson();
    json.units = this.units;
    json.type = this.constructor.name;
    json.name = this.name;

    return json;
  }
};
