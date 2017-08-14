const Graph = require('./functional_graph');
const Layer = require('../layers/layer');

/**
 * Sequential graph is a linear stack of layers.
 * @extends mentality.Graph
 * @memberof mentality.keras.graphs
 */
class SequentialGraph extends Graph {
  constructor(args = {}) {
    super(args);
  }

  addNode(node) {
    if (!(node instanceof Layer) /* && !(node instanceof Variable) */) {
      throw new Error('Child of Graph must be an instance of Layer or Variable. ');
    }

    if (this.children.length > 0) {
      const lastNode = this.children[this.children.length - 1];
      node.setInput(lastNode);
    }

    super.addNode(node);
  }

  addNodes(nodes) {
    nodes.map(e => this.addNode(e));
  }
}

module.exports = SequentialGraph;
