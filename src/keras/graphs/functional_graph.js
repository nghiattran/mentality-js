const Graph = require('../../graph');

/**
 * @extends mentality.Graph
 * @memberof mentality.keras.graphs
 */
class FunctionalGraph extends Graph {
  constructor(args = {}) {
    const {
      nodes = [],
    } = args;
    super(args);

    this.addNodes(nodes);

    this.nameScope = args.nameScope;
  }

  build(writer, opts) {
    if (this.nameScope) {
      writer.emitLine(`with tf.name_scope('${this.nameScope}'):`);
      writer.incIndent();
    }
  }

  postCompile(writer, opts) {
    writer.decIndent();
  }

  toJson(opts = {}) {
    const json = super.toJson(opts);
    json.nameScope = this.nameScope;
    return json;
  }
}

module.exports = FunctionalGraph;
