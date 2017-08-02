const Graph = require('../graph');

module.exports = class TFGraph extends Graph {
  constructor(args = {}) {
    super(args);

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
};
