const Config = require('./config');

const defaultConfig = {
  useBias: true,
  activation: undefined,
  kernelInitializer: undefined,
  biasInitializer: undefined,
  kernelRegularizer: undefined,
  biasRegularizer: undefined,
  activityRegularizer: undefined,
  kernelConstraint: undefined,
  biasConstraint: undefined,
};

module.exports = class Weights extends Config {
  constructor(config = {}) {
    super(defaultConfig, config);
  }
};
