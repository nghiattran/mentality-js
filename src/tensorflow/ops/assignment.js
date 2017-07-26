'use strict';

const Variable = require('../../variable');

const Node = require('../../node');
const utils = require('../../utils');

module.exports = class Assignment extends Node {
  constructor(variable, value) {
    super(utils.getName('assignment'));

    if (this.variable instanceof Variable) throw TypeError('Variable must be instance of Variable.');

    this.variable = variable;
    this.value = value;
  }

  generateStatement(graph, opts) {
    let varname = this.variable.name;
    graph.writer.emit(`${varname} = `);

    if (this.value instanceof Node) {
      this.value.generate(graph, opts);
    } else {
      graph.writer.emit(utils.toString(this.value));
    }
  }

  generate(graph, opts) {
    this.generateStatement(graph, opts);
  }
}