'use strict';

const utils = require('./utils');
const FileWriter = require('./writers/filewriter');
const Node = require('./node');

module.exports = class Graph extends Node {
  constructor(name=utils.getName('graph')) {
    super(name);
    
    this.children = [];
    this.startNodes = [];
  }

  addNodes(nodes) {
    nodes.map((e) => {
      this.children.push(e);
    });
  }

  addNode(node) {
    this.children.push(node);
  }

  compile(opts={}) {
    const {path, writer, writerOpts={}} = opts;

    let isNewWriter = writer ? false : true;

    let graph = {
      writer: writer || new FileWriter(path, writerOpts)
    };

    utils.compile(this, graph, opts);

    if (isNewWriter) graph.writer.close();
  }

  toJson(opts={}) {
    let sortedNodes = utils.sortChildren(this.children, opts.silent);
    
    let json = {
      children: [],
    }
    for (let i = 0; i < sortedNodes.length; i++) {
      json.children.push(toJson(sortedNodes[i], opts));
    }
    return json;
  }
}