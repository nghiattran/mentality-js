'use strict';

'use strict';

const Node = require('../../node');
const utils = require('../../utils');
const Variable = require('../../variable');
const Assignment = require('./assignment');

module.exports = class FunctionCall extends Node {
  constructor(fn, parameters=[]) {
    super(utils.getName('FunctionCall'));

    this.fn = fn;
    this.parameters = parameters;
  }

  parseParameter() {
    let parametersString = '';
    
    if (utils.isArray(this.parameters)) {
      for (let i = 0; i < this.parameters.length; i++) {
        parametersString += utils.toString(this.parameters[i]);
        
        if (i !== this.parameters.length - 1)
          parametersString += ', ';
      }
    } else if (utils.isObject(this.parameters)) {
      let keys = Object.keys(this.parameters);
      for (var i = 0; i < keys.length; i++) {
        let key = keys[i];
        parametersString += key + '=' + utils.toString(this.parameters[key]);

        if (i !== keys.length - 1)
          parametersString += ', ';
      }
    }

    return parametersString;
  }

  static createVariable(fc, parameters) {
    let variable = new Variable(parameters.name, parameters.shape);
    return FunctionCall.assign(variable, fc, parameters)
  }

  static assign(variable, fc, parameters) {
    let fn = new FunctionCall(fc, parameters);
    return new Assignment(variable, fn);
  }

  generateStatement(graph, opts) {
    let parametersString = this.parseParameter();

    graph.writer.emit(`${this.fn}(${parametersString})`);
  }

  generate(graph, opts) {
    this.generateStatement(graph, opts);
    graph.writer.emitNewline();
  }
}