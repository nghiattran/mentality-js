'use strict';

let Layer = require('./layer').Layer;
let Neuron = require('./neuron').Neuron;
let ValueError = require('./errors').ValueError;
let fs = require('fs');

class Network {
  constructor(setting, init = true) {
    this.input = setting['input'];
    this.output = setting['output'];
    this.ready();

    if (init) this.initialize();
  }

  /**
   * Initialize all neurons and connections. If thresholdGenerator is passed, it would be
   * use to generate initial neuron thresholds and connection weights
   * @param  {function} thresholdGenerator
   * @return {Network}  self
   */
  initialize(thresholdGenerator) {
    if (!thresholdGenerator) {
      thresholdGenerator = Math.random;
    }

    for (var i = 0; i < this.neurons.length; i++) {
      this.neurons[i].initialize(thresholdGenerator);
    }
    
    for (var i = 0; i < this.connections.length; i++) {
      this.connections[i].initialize(thresholdGenerator);
    }

    return this;
  }

  /**
   * Export Network object as json.
   * @return {Object}
   */
  toJson() {
    let neurons = [];
    for (var i = 0; i < this.neurons.length; i++) {
      neurons.push(this.neurons[i].toJson());
    }

    let connections = [];
    for (var i = 0; i < this.connections.length; i++) {
      connections.push(this.connections[i].toJson());
    }

    return {
      neurons,
      connections
    }
  }

  /**
   * Import from json
   * @param  {Object}
   * @return {Network}
   */
  static fromJson(json) {
    let input = [];
    let output = [];
    let neurons = {};
    for (var i = 0; i < json['neurons'].length; i++) {
      let neuronJson = json['neurons'][i];
      neurons[neuronJson['id']] = new Neuron(neuronJson);
    }

    for (var i = 0; i < json['connections'].length; i++) {
      let connection = json['connections'][i];
      neurons[connection['from']].connect(neurons[connection['to']], connection['weight']);
    }

    let keys = Object.keys(neurons);
    for (var i = 0; i < keys.length; i++) {
      let neuron = neurons[keys[i]];
      if (neuron['next'].length === 0) {
        output.push(neuron);
      } else if (neuron['previous'].length === 0) {
        input.push(neuron);
      }
    }
    return new Network({input, output}, false);
  }

  /**
   * Write Network json object to a file
   * @param  {string}   filepath
   * @return {Network}  this
   */
  toFile(filepath) {
    fs.writeFileSync(filepath, JSON.stringify(this.toJson(), null, 4));
    return this;
  }

  /**
   * Compare 2 networks
   * @param  {Network}  network
   * @return {bool}      
   */
  compareTo(network) {
    if (this.neurons.length !== network.neurons.length || 
      this.connections.length !== network.connections.length) 
    {
      return false;
    }

    for (var i = 0; i < this.neurons.length; i++) {
      if (!(this.neurons[i].compareTo(network.neurons[i]))) {
        return false;
      }
    }

    for (var i = 0; i < this.connections.length; i++) {
      if (!(this.connections[i].compareTo(network['connections'][i]))) {
        return false;
      }
    }

    return true;
  }

  /**
   * Load all neurons and connections into Network property. This has to be call after
   * any change has been made. All neurons are stored in an array according to theirs
   * execution order.
   * @return {Network} this
   */
  ready() {
    this.neurons = this.findCallStack();

    this.connections = [];
    for (var i = 0; i < this.neurons.length; i++) {
      this.connections = this.connections.concat(this.neurons[i].next);
    }
    return this;
  }

  /**
   * Activate the whole neural network.
   * @param  {int[]}  inputs  All input values for the neural network
   * @return {int[]}  result  
   */
  activate(inputs) {
    if (this.neurons === undefined) {
      throw ValueError('Ready function must be called before activating.');
    }

    let stack = this.neurons;
    let result = [];
    for (let i = 0; i < stack.length; i++) {
      if (stack[i].next.length === 0) {
        result.push(stack[i].activate(inputs[i]));
      } else {
        stack[i].activate(inputs[i]);
      }
    }

    return result;
  }

  /**
   * Propagate the whole neural network
   * @param  {float}  learningRate  Learning rate of the trainer
   * @param  {int[]}  outputs       Expected output of the network
   * @param  {float}  momentum      Momentum value for the network
   * @return {int[]}
   */
  propagate(learningRate, outputs, momentum) {
    let stack = this.neurons;
    let result = [];
    for (let i = stack.length - 1; i >= 0; i--) {
      if (stack.length - 1 - i < outputs.length) {
        result.push(stack[i].propagate(learningRate, 
                                        outputs[stack.length - 1 - i], 
                                        momentum));
      } else{
        stack[i].propagate(learningRate, undefined, momentum);
      }
    }
    return result;
  }

  /**
   * Find the execution order of the whole network
   * @return {Neuron[]} stack  Neuron array in execution order
   */
  findCallStack() {
    let stack = [];
    for (let i = 0; i < this.output.length; i++) {
      stack = stack.concat(this.findLocalCallStack(this.output[i]))
    }

    return stack;
  }

  /**
   * @param  {[type]}
   * @param  {Object}
   * @return {[type]}
   */
  findLocalCallStack(neuron, visited = {}) {
    let stack = [];
    visited[neuron.id] = true;
    for (let i = 0; i < neuron.previous.length; i++) {
      if (!visited[neuron.previous[i].from.id]) {
        stack = stack.concat(this.findLocalCallStack(neuron.previous[i].from, visited));
      }
    }
    stack.push(neuron);
    return stack;
  }
}

class Perceptron extends Network {
  constructor(input, hidden, output) {
    let inputLayer = new Layer(input);
    let outputLayer = new Layer(output);
    let hiddenLayer = [];

    if (!hidden || hidden.length === 0) {
      inputLayer.project(outputLayer);
    } else {
      for (let i = 0; i < hidden.length; i++) {
        hiddenLayer.push(new Layer(hidden[i]));

        if (i !== 0) {
          hiddenLayer[i - 1].project(hiddenLayer[i]);
        }
      }

      inputLayer.project(hiddenLayer[0]);
      hiddenLayer[hiddenLayer.length - 1].project(outputLayer);
    }

    super({
      input: inputLayer.neurons,
      output: outputLayer.neurons
    });
  }
}

module.exports = {
  Perceptron,
  Network
}