'use strict';

const utils = require('../../utils');
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
    this.weightShape = weightShape;
    // weight
    // graph.writer.emitLine(
    //   `${this.name}_w = tf.get_variable(${this.name}_w, shape=${utils.toString(weightShape)})`
    // );

    // // bias
    // let biasShape = [weightShape[weightShape.length-1]];
    // graph.writer.emitLine(
    //   `${this.name}_b = tf.get_variable(${this.name}_b, shape=${utils.toString(biasShape)})`
    // );
  }

  addActivation(activation) {
    // state
    this.state = new Variable(`${this.name}_h`, this.getShape());
    let actOp = new activations[activation](this.state, `${this.name}_activation`);
    let outputOp = new Assignment(this.state, actOp);
    this.addNode(outputOp);

    return outputOp;
  }

  set(graph, opts) {

  }

  generateWith(graph, opts) {
    let weightShape = this.weightShape;

    graph.writer.emitLine(`with tf.name_scope(${this.name}):`);
    graph.writer.incIndent();
    
    graph.writer.emitLine(
      `${this.name}_w = tf.get_variable(${this.name}_w, shape=${utils.toString(weightShape)})`
    );

    // bias
    let biasShape = [weightShape[weightShape.length-1]];
    graph.writer.emitLine(
      `${this.name}_b = tf.get_variable(${this.name}_b, shape=${utils.toString(biasShape)})`
    );
  }

  postcompile(graph, opts) {
    graph.writer.decIndent();
    graph.writer.emitNewline('');
  }

  getShape() {
    throw Error('Not implemented')
  }
}