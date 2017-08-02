const Node = require('./node');

module.exports = class Variable extends Node {
  constructor(name, shape) {
    super(name);

    this.shape = shape;
  }

  build() {}
};
