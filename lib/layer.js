'use strict';

let Neuron = require('./neuron').Neuron;
let ValueError = require('./errors').ValueError;


class Layer {
  constructor(setting) {
    this.neurons = [];

    if (!isNaN(parseFloat(setting)) && isFinite(setting)) {
      this.name = '';
      for (let i = 0; i < setting; i++) {
        this.neurons.push(new Neuron());
      }
    } else {
      throw new ValueError('Layer constructor only takes an integer argument.');
    }
  }

  /**
   * Project this layer onto another layer with a specific projection type
   * @param  {Layer}    layer
   * @param  {function} projection
   * @return {Layer}    this
   */
  project(layer, projection = Layer.projection.ALL_TO_ALL) {
    if (!(layer instanceof Layer))
      throw new ValueError('Projected object is not a Layer instance');
    projection(this, layer);
    return this;
  }
}

Layer.projection = {
  ALL_TO_ALL: function (first, second) {
    for (let x = 0; x < first.neurons.length; x++) {
      for (let y = 0; y < second.neurons.length; y++) {
        first.neurons[x].connect(second.neurons[y]);
      }
    }
  },
  ONE_TO_ONE: function (first, second) {
    if (first.neurons.length !== second.neurons.length) {
      throw new ValueError('Cannot applay ONE_TO_ONE projection on 2 networks with different neuron numbers.');
    }

    for (let x = 0; x < first.neurons.length; x++) {
      first.neurons[x].connect(second.neurons[x], 1);
    }
  }
}

module.exports = {
  Layer
}