const Node = require('../../node');
const Variable = require('../../variable');

module.exports = class Layer extends Node {
  constructor({ name }) {
    super(name);
  }

  setInput(input) {
    if (!input || !(input instanceof Variable)) {
      return;
    }

    this.input = input;

    this.output = new Variable(`${this.name}_h`, this.computeOutputShape());

    this.link(this.output);
    input.link(this);
  }

  addWeights(args) {
    const {
      useBias = true,
      activation,
      kernelInitializer,
      biasInitializer,
      kernelRegularizer,
      biasRegularizer,
      activityRegularizer,
      kernelConstraint,
      biasConstraint,
    } = args;

    this.kernelInitializer = kernelInitializer;
    this.biasInitializer = biasInitializer;
    this.useBias = useBias;
    this.activation = activation;
    this.kernelRegularizer = kernelRegularizer;
    this.biasRegularizer = biasRegularizer;
    this.activityRegularizer = activityRegularizer;
    this.kernelConstraint = kernelConstraint;
    this.biasConstraint = biasConstraint;
  }

  getWeightsJson() {
    return {
      kernelInitializer: this.kernelInitializer,
      biasInitializer: this.biasInitializer,
      useBias: this.useBias,
      activation: this.activation,
      kernelRegularizer: this.kernelRegularizer,
      biasRegularizer: this.biasRegularizer,
      activityRegularizer: this.activityRegularizer,
      kernelConstraint: this.kernelConstraint,
      biasConstraint: this.biasConstraint,
    };
  }

  computeOutputShape() {
    throw Error('Unimplementdd.');
  }

  toJson(opts = {}) {
    throw Error('Unimplementdd');
  }
};
