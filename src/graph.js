const fs = require('fs');
const utils = require('./utils/utils');
const FileWriter = require('./writers/filewriter');
const Node = require('./node');

/**
 * Sequential graph is a linear stack of layers.
 * @extends mentality.Node
 * @memberof mentality
 */
class Graph extends Node {
  constructor({ name = utils.getName('graph') }) {
    super(name);

    /**
     * Children nodes.
     * @type {Node[]}
     */
    this.children = [];
  }

  /**
   * Add multiple nodes as a children.
   * @param {Node[]} node Child nodes.
   */
  addNodes(nodes) {
    this.children = this.children.concat(nodes);
  }

  /**
   * Add a node as a child.
   * @param {Node} node Child node.
   */
  addNode(node) {
    this.children.push(node);
  }


  compile(opts = {}) {
    const isNewWriter = !(opts.writer instanceof FileWriter);

    const {
      writerOpts = {},
      writer = new FileWriter(writerOpts),
    } = opts;

    const sortedNodes = utils.sortChildren(this.children, opts.silent);
    for (let i = 0; i < sortedNodes.length; i += 1) {
      sortedNodes[i].build(writer, opts);
    }

    if (isNewWriter) writer.close();
  }

  toJson(opts = {}) {
    const sortedNodes = utils.sortChildren(this.children, opts.silent);

    const json = {
      name: this.getName(),
      type: this.getType(),
      children: [],
    };

    for (let i = 0; i < sortedNodes.length; i += 1) {
      json.children.push(sortedNodes[i].toJson(opts));
    }

    return json;
  }

  toFile(file, opts = {}) {
    fs.writeFile(file, JSON.stringify(this.toJson(opts), null, 4));
  }
}

module.exports = Graph;
