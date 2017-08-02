const utils = require('./utils/utils');

const names = new Set();

module.exports = class Node {
  constructor(name = utils.getName(this.getType())) {
    if (names.has(name)) throw Error(`This name has bean used: ${name}`);

    names.add(name);

    this.name = name;
    this.to = [];
    this.children = [];
  }

  link(node) {
    if (!(node instanceof Node)) throw Error('Argument must be an instance of Node.');

    this.to.push(node);
  }

  compile(writer, opts = {}) {
    utils.compile(this, writer, opts);
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
    throw Error('Not implemented.');
  }

  getType() {
    return this.constructor.name;
  }
};
