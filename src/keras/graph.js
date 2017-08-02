'use strict';

const fs = require('fs');

const utils = require('../utils');
const FileWriter = require('../writers/filewriter');
const Graph = require('../graph');

module.exports = class TFGraph extends Graph {
  constructor(name=utils.getName('tfgraph')) {
    super(name);
  }

  build(graph, opts) {
    const {nameScope} = opts;
    if (nameScope) {
      graph.writer.emitLine(`with tf.name_scope('${nameScope}'):`);
      graph.writer.incIndent();
    }
  }

  postCompile(graph, opts) {
    graph.writer.decIndent();
  }
}