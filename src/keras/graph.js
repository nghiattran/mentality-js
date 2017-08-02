'use strict';

const utils = require('../utils/utils');
const FileWriter = require('../writers/filewriter');
const Graph = require('../graph');

module.exports = class TFGraph extends Graph {
  constructor(name=utils.getName('tfgraph'), opts={}) {
    super(name);
    
    this.nameScope = opts.nameScope;
  }

  build(graph, opts) {
    if (this.nameScope) {
      graph.writer.emitLine(`with tf.name_scope('${this.nameScope}'):`);
      graph.writer.incIndent();
    }
  }

  postCompile(graph, opts) {
    graph.writer.decIndent();
  }

  toJson(opts={}) {
    let json = super.toJson(opts);
    json.nameScope = this.nameScope;
    return json;
  }
}