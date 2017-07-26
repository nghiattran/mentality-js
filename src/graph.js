'use strict';

const fs = require('fs');

const utils = require('./utils');
const FileWriter = require('./writers/filewriter');

module.exports = class Graph {
  constructor() {
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
    let graph = {
      writer: new FileWriter()
    };

    utils.compile(this, graph, opts);

    graph.writer.close();
  }
}