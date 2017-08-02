const Graph = require('./tf_graph');
const Layer = require('./layers/layer');

module.exports = class SequenceGraph extends Graph {
  constructor(args = {}) {
    const {
      nodes = [],
    } = args;
    super(args);

    this.addNodes(nodes);
  }

  addNode(node) {
    if (!(node instanceof Layer) /* && !(node instanceof Variable) */) {
      throw Error('Child of Graph must be an instance of Layer or Variable. ');
    }

    if (this.children.length > 0) {
      const lastNode = this.children[this.children.length - 1];
      node.setInput(lastNode.output);
    }

    super.addNode(node);
  }

  addNodes(nodes) {
    nodes.map(e => this.addNode(e));
  }

  build(writer, opts) {
    super.build(writer, opts);
  }

  postCompile(...args) {
    super.postCompile(...args);
  }
};
