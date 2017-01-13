'use strict';

let synaptic = require('synaptic');
let SynapticNetwork = synaptic.Network;
let Layer = synaptic.Layer;
let Neuron = synaptic.Neuron;
let fs = require('fs');

class Network {
  constructor(setting) {
    this.inputNeurons = setting.input;
    this.outputNeurons = setting.output;
    this.neurons = this.findCallStack();
  }

  /**
   * Activate the whole neural network.
   * @param  {int[]}  inputs  All input values for the neural network
   * @return {int[]}  result  
   */
  activate(inputs) {
    if (this.inputNeurons.length !== inputs.length) {
      throw new Error('Number of inputs and input neurons don\'t match.');
    }

    let stack = this.neurons;
    let result = [];

    for (let i = 0; i < stack.length; i++) {
      if (Object.keys(stack[i].connections.projected).length === 0) {
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
   * @return {int[]}
   */
  propagate(learningRate, outputs) {
    let stack = this.neurons;
    let result = [];
    let count = outputs.length - 1;
    for (let i = stack.length - 1; i >= 0; i--) {
      if (Object.keys(stack[i].connections.projected).length === 0) {
        result.push(stack[i].propagate(learningRate, 
                                        outputs[count]));
        count--;
      } else{
        stack[i].propagate(learningRate, undefined);
      }
    }
  }

  /**
   * Find the execution order of the whole network
   * @return {Neuron[]} stack  Neuron array in execution order
   */
  findCallStack() {
    function findLocalCallStack(neuron, stack, visited) {
      visited[neuron.ID] = true;
      for (let id in neuron.connections.inputs) {
        let currentNeuron = neuron.connections.inputs[id].from;
        if (!visited[currentNeuron.ID]) {
          findLocalCallStack(currentNeuron, stack, visited);
        }
      }
      stack.push(neuron);
      return stack;
    }

    let stack = [];
    let visited = {};
    for (let i = 0; i < this.outputNeurons.length; i++) {
      findLocalCallStack(this.outputNeurons[i], stack, visited);
    }

    return stack;
  }

  inputs() {
    return this.inputNeurons.length;
  }

  outputs() {
    return this.outputNeurons.length;
  }

  /**
   * Export Network object as json.
   * @return {Object}
   */
  toJSON() {
    let neurons = [];
    let connections = [];

    for (let x = 0; x < this.neurons.length; x++) {
      let neuron = this.neurons[x];
      let label;
      if (Object.keys(neuron.connections.inputs).length === 0)
        label = 'input';
      else if (Object.keys(neuron.connections.projected).length === 0)
        label = 'output';
      else
        label = 'hidden';

      let copy = {
        trace: {
          elegibility: {},
          extended: {}
        },
        state: neuron.state,
        old: neuron.old,
        activation: neuron.activation,
        bias: neuron.bias,
        label
      };

      copy.squash = neuron.squash == Neuron.squash.LOGISTIC ? "LOGISTIC" :
        neuron.squash == Neuron.squash.TANH ? "TANH" :
        neuron.squash == Neuron.squash.IDENTITY ? "IDENTITY" :
        neuron.squash == Neuron.squash.HLIM ? "HLIM" :
        null;

      neurons.push(copy);

      for (let id in neuron.connections.projected) {
        let connection = neuron.connections.projected[id];
        connections.push({
          from: connection.from.ID,
          to: connection.to.ID,
          weight: connection.weight,
          gater: connection.gater,
        });
      }
    }

    return {
      neurons,
      connections
    }
  }

  static fromJSON(json) {
    let input = [];
    let output = [];
    let neurons = [];

    for (let i in json.neurons) {
      let config = json.neurons[i];

      let neuron = new Neuron();
      neuron.trace.elegibility = {};
      neuron.trace.extended = {};
      neuron.state = config.state;
      neuron.old = config.old;
      neuron.activation = config.activation;
      neuron.bias = config.bias;
      neuron.squash = config.squash in Neuron.squash ? Neuron.squash[config.squash] : Neuron.squash.LOGISTIC;
      neurons.push(neuron);

      switch (config.label) {
        case 'input':
          input.push(neuron)
          break;
        case 'output':
          output.push(neuron)
          break;
      }
    }

    for (let i in json.connections) {
      let config = json.connections[i];
      let from = neurons[config.from];
      let to = neurons[config.to];
      let weight = config.weight;
      let gater = neurons[config.gater];

      let connection = from.project(to, weight);
      if (gater)
        gater.gate(connection);
    }

    return new Network({
      input, output
    })
  }

  /**
   * Write Network json object to a file
   * @param  {string}   filepath
   * @return {Network}  this
   */
  toFile(filepath) {
    fs.writeFileSync(filepath, JSON.stringify(this.toJSON(), null, 4));
    return this;
  }

  /**
   * Read Network json object to a file
   * @param  {string}   filepath
   * @return {Network}
   */
  static fromFile(filepath) {
    try {
      let networkJson = JSON.parse(fs.readFileSync(filepath).toString());
      return Network.fromJSON(networkJson);
    } catch(e) {
      throw new Error(filepath + ' does not contain a JSON object.');
    }
  }
}


class Perceptron extends Network {
  constructor(input, hidden, output) {
    // create the layers
    let inputLayer = new Layer(input);
    let hiddenLayer = [];
    for (let i = 0; i < hidden.length; i++) {
        hiddenLayer.push(new Layer(hidden[i]));
        if (i > 0) {
            hiddenLayer[i-1].project(hiddenLayer[i])
        }
    }
    let outputLayer = new Layer(output);
    // connect the layers
    inputLayer.project(hiddenLayer[0]);
    hiddenLayer[hiddenLayer.length - 1].project(outputLayer);

    // set the layers
    super({
        input: inputLayer.list,
        output: outputLayer.list
    });
  }
}

module.exports = {
  Network, Perceptron
};