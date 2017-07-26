'use strict';

const Node = require('../../node');
const utils = require('../../utils')

module.exports = class With extends Node {
  constructor(op, as) {
    super(utils.getName('with'));
    this.op = op;
    this.as = as;
  }

  generate(graph, opts) {
    graph.writer.emit('with ');
    this.op.generateStatement(graph, opts);
    graph.writer.emit(':');
    graph.writer.incIndent();
  }
}