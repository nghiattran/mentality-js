'use strict';

const utils = require('../utils');
const Graph = require('../graph');

const ops = require('./ops');
const With = ops.With;
const FunctionCall = ops.FunctionCall;

module.exports = class TFGraph extends Graph {
  constructor(name=utils.getName('Graph')) {
    super();

    this.withNode = new With(new FunctionCall('tf.name_scope', [name]));
    this.withNode.children = this.children;
  }

  generate(graph, opts) {
    this.generateWith(graph, opts);
  }

  generateWith(graph, opts) {
    this.withNode.generate(graph, opts);
    graph.writer.emitNewline();
  }

  static fromJson(json) {
    console.log(json);
  }
}