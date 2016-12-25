'use strict';

let Neuron = require('./neuron').Neuron;


module.exports = class Layer{
  constructor(setting) {
    this.neurons = [];

    if (!isNaN(parseFloat(setting)) && isFinite(setting)) {
      this.name = '';
      for (var i = 0; i < setting; i++) {
        this.neurons.push(new Neuron(this));
      }
    } else if (setting instanceof Object) {
      try {
        this.name = setting['name'];
        
        for (var i = 0; i < setting['neurons'].length; i++)  {
          this.neurons.push(new Neuron(this, setting['neurons'][i]));
        }
      } catch (e) {
        throw Error('Input file is corrupted.');
      }
    } else {
      throw Error('Layer constructor only takes either an integer argument for a dictionary.');
    }
  }

  toJson() {
    let neurons = [];
    for (var i = 0; i < this.neurons.length; i++) {
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
      for (var i = 0; i < this.neurons.length; i++) {
        neurons.push(this.neurons[i].activate());
      }
      return neurons;
    }

    if (inputs.length !== this.neurons.length)
      throw Error('Input size does not match number of neurons.');

    for (var i = 0; i < this.neurons.length; i++) {
      neurons.push(this.neurons[i].activate(inputs[i]));
    }
    return neurons;
  }

  propagate(leaningRate, outputs, momentum=0) {
    let result = [];

    if (!outputs) {
      for (var i = 0; i < this.neurons.length; i++) {
        result.push(this.neurons[i].propagate(leaningRate, undefined, momentum));
      }
      return result;
    }

    if (outputs.length !== this.neurons.length)
      throw Error('Output size does not match number of neurons.');

    for (var i = 0; i < this.neurons.length; i++) {
      result.push(this.neurons[i].propagate(leaningRate, outputs[i], momentum));
    }
    return result;
  }

  project(layer) {
    if (!(layer instanceof Layer))
      throw Error('Projected object is not a Layer instance')

    for (var x = 0; x < this.neurons.length; x++) {
      for (var y = 0; y < layer.neurons.length; y++) {
        this.neurons[x].connect(layer.neurons[y]);
      }
    }
  }

  getConnections() {
    let connections = [];
    for (var i = 0; i < this.neurons.length; i++) {
      connections = connections.concat(this.neurons[i].next);
    }
    return connections;
  }
}
