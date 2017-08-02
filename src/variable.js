'use strict';

const Node = require('./node');
const utils = require('./utils');

module.exports = class Variable extends Node {
  constructor(name, shape) {
    super(name);

    this.shape = shape;
  }

  build() {}
}