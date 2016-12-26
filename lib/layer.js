'use strict';

let Neuron = require('./neuron').Neuron;
let ValueError = require('./errors').ValueError;


class Layer {
  constructor(setting) {
    this.neurons = [];

    if (!isNaN(parseFloat(setting)) && isFinite(setting)) {
      this.name = '';
      for (let i = 0; i < setting; i++) {
        this.neurons.push(new Neuron(this));
      }
    } else if (setting instanceof Object) {
      try {
        this.name = setting['name'];
        
        for (let i = 0; i < setting['neurons'].length; i++)  {
          this.neurons.push(new Neuron(this, setting['neurons'][i]));
        }
      } catch (e) {
        throw new ValueError('Input file is corrupted.');
      }
    } else {
      throw new ValueError('Layer constructor only takes either an integer argument for a dictionary.');
    }
  }

  toJson() {
    let neurons = [];
    for (let i = 0; i < this.neurons.length; i++) {
      neurons.push(this.neurons[i].toJson());
    }

    return {
      'name': this.name,
      'neurons': neurons
    }
  }

  setName(name) {
    this.name = name;
  }

  activate(inputs) {
    let neurons = []
    if (!inputs) {
      for (let i = 0; i < this.neurons.length; i++) {
        neurons.push(this.neurons[i].activate());
      }
      return neurons;
    }

    if (inputs.length !== this.neurons.length)
      throw new ValueError('Input size does not match number of neurons.');

    for (let i = 0; i < this.neurons.length; i++) {
      neurons.push(this.neurons[i].activate(inputs[i]));
    }
    return neurons;
  }

  propagate(learningRate, outputs, momentum) {
    momentum = momentum || 0;

    let result = [];

    if (!outputs) {
      for (let i = 0; i < this.neurons.length; i++) {
        result.push(this.neurons[i].propagate(learningRate, undefined, momentum));
      }
      return result;
    }

    if (outputs.length !== this.neurons.length)
      throw new ValueError('Output size does not match number of neurons.');

    for (let i = 0; i < this.neurons.length; i++) {
      result.push(this.neurons[i].propagate(learningRate, outputs[i], momentum));
    }
    return result;
  }

  project(layer) {
    if (!(layer instanceof Layer))
      throw new ValueError('Projected object is not a Layer instance');

    for (let x = 0; x < this.neurons.length; x++) {
      for (let y = 0; y < layer.neurons.length; y++) {
        this.neurons[x].connect(layer.neurons[y]);
      }
    }
  }

  getConnections() {
    let connections = [];
    for (let i = 0; i < this.neurons.length; i++) {
      connections = connections.concat(this.neurons[i].next);
    }
    return connections;
  }
}


module.exports = {
  Layer
}