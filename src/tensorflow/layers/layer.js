'use strict';

const Node = require('../../node');
const ops = require('../ops');
const Variable = require('../../variable');
const activations = ops.activations;
const With = ops.With;
const FunctionCall = ops.FunctionCall;
const Assignment = ops.Assignment;

let cnt = 0;

module.exports = class Layer extends Node {
  constructor(name, input) {
    super(name);
    
    this.input = input;
    this.withNode = new With(new FunctionCall('tf.name_scope', [name]));
  }

  addWeightAndBias(weightShape) {
    // weight
    this.weightAssignment = FunctionCall.createVariable('tf.get_variable',{
      name: `${this.name}_w`, 
      shape: weightShape
    });
    this.weight = this.weightAssignment.variable;

    // bias
    let biasShape = [weightShape[weightShape.length-1]];
    this.biasAssignment = FunctionCall.createVariable('tf.get_variable',{
      name: `${this.name}_b`, 
      shape: biasShape
    });
    this.bias = this.biasAssignment.variable;

    this.addNodes([this.weightAssignment, this.biasAssignment]);
  }

  addActivation(activation) {
    // state
    this.state = new Variable(`${this.name}_h`);
    let actOp = new activations[activation](this.state, `${this.name}_activation`);
    this.output = new Assignment(this.state, actOp);
    this.addNode(this.output);
  }

  set(weightShape, activation, transformation) {
    this.addActivation(activation);

    let transAssign = new Assignment(this.state, transformation);
    this.weightAssignment.link(transAssign);

    // Add bias
    let addBiasAssign = FunctionCall.assign(this.state, 'tf.nn.bias_add', {
      value: this.state,
      bias: this.bias
    })

    this.biasAssignment.link(addBiasAssign);
    transAssign.link(addBiasAssign);

    this.addNodes(transAssign, addBiasAssign);

    transAssign.link(this.output);
  }

  generateWith(graph, opts) {
    this.withNode.generate(graph, opts);
    graph.writer.emitNewline();
  }

  postcompile(graph, opts) {
    graph.writer.decIndent();
    graph.writer.emitNewline('');
  }
}