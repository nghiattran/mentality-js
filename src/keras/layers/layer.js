'use strict';

const utils = require('../../utils');
const Node = require('../../node');
const Variable = require('../../variable');

module.exports = class Layer extends Node {
  constructor({name}) {
    super(name);
  }

  setInput(input) {
    if (!input || !(input instanceof Variable)) return;

    this.input = input;

    this.output = new Variable(`${this.name}_h`, this.computeOutputShape());
  }
  
  addWeights(args) {
    const {
      name,
      activation='relu',
      use_bias=true,
      kernel_regularizer='None',
      bias_regularizer='None',
      activity_regularizer='None',
      kernel_constraint='None',
      bias_constraint='None'
    } = args;

    this.activation = activation;
    this.kernel_regularizer = kernel_regularizer;
    this.bias_regularizer = bias_regularizer;
    this.activity_regularizer = activity_regularizer;
    this.kernel_constraint = kernel_constraint;
    this.bias_constraint = bias_constraint;
  }

  computeOutputShape() {
    throw Error('Unimplementdd.');
  }

  toJson(opts) {
    throw Error('Unimplementdd');
  }
}