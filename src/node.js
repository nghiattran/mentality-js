'use strict';

const utils = require('./utils/utils')

let names = new Set();

module.exports = class Node {
  constructor(name) {
    if (names.has(name)) throw Error(`This name has bean used: ${name}`);

    names.add(name);

    this.name = name;
    this.to = [];
    this.children = [];
  }

  link(node) {
    if (!node instanceof Node) throw ValueError('Argument must be an instance of Node.');

    this.to.push(node);
  }

  compile(graph={}, opts={}) {
    utils.compile(this, graph, opts);
  }

  build() {
    throw Error('Not implemented');
  }

  addNodes(nodes) {
    this.children = this.children.concat(nodes);
  }

  addNode(node) {
    this.children.push(node);
  }

  toJson() {
    throw Error('Not implemented.')
  }
}