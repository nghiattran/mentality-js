const utils = require('./utils/utils');
const FileWriter = require('./writers/filewriter');
const Node = require('./node');
const fs = require('fs');


module.exports = class Graph extends Node {
  constructor({ name = utils.getName('graph') }) {
    super(name);

    this.children = [];
    this.startNodes = [];
  }

  addNodes(nodes) {
    nodes.map(e => this.children.push(e));
  }

  addNode(node) {
    this.children.push(node);
  }

  compile(opts = {}) {
    const isNewWriter = opts.writer instanceof FileWriter;

    const {
      writerOpts = {},
      writer = new FileWriter(writerOpts),
    } = opts;

    utils.compile(this, writer, opts);

    if (isNewWriter) writer.close();
  }

  toJson(opts = {}) {
    const sortedNodes = utils.sortChildren(this.children, opts.silent);

    const json = {
      name: this.name,
      children: [],
    };

    for (let i = 0; i < sortedNodes.length; i += 1) {
      json.children.push(utils.toJson(sortedNodes[i], opts));
    }

    return json;
  }

  toFile(file, opts = {}) {
    fs.writeFile(file, JSON.stringify(this.toJson(opts), null, 4));
  }
};
