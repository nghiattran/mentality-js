'use strict';

const utils = require('../utils/utils');
const Graph = require('./graph');
const Layer = require('./layers/layer');
const Variable = require('../variable');

module.exports = class SequenceGraph extends Graph {
  constructor(opts={}) {
    const {nodes=[], name=utils.getName('sequenceGraph')} = opts;
    super(name, opts);

    this.addNodes(nodes)
  }

  addNode(node) {
    if (!(node instanceof Layer) /*&& !(node instanceof Variable)*/)
      throw Error('Child of Graph must be an instance of Layer or Variable. ')

    if (this.children.length > 0) {
      let lastNode = this.children[this.children.length - 1];
      lastNode.link(node);
      if (lastNode instanceof Layer)
        node.setInput(lastNode.output);
      // else if (lastNode instanceof Variable)
      //   node.setInput(lastNode);
    }

    super.addNode(node);
  }

  addNodes(nodes) {
    nodes.map((e) => { 
      this.addNode(e);
    })
  }

  build(graph, opts) {
    super.build(graph, opts);
  }

  postCompile(graph, opts) {
    super.postCompile(...arguments);
  }
}