'use strict';

let Connection = require('./connection');

class Neuron {
  constructor(layer, setting) {
    this.previous = [];
    this.next = [];
    this.layer = layer;
    this.trainer = undefined;
    this.errorGradient = 0;

    if (setting) {
      try {
        this.id = setting['id'];
        this.activation = setting['activation'];
        this.threshold = setting['threshold'];
        this.state = setting['state'];
        this.old = setting['old'];
        this.squash = LOGISTIC;
        // this.squash = {
        //     'LOGISTIC': LOGISTIC,
        //     'TANH': TANH,
        //     'LINEAR': LINEAR,
        //     'RELU': RELU
        // }[setting['squash']]
      } catch (e) {
        throw Error('Input file is corrupted.')
      }
    } else {
      this.id = Neuron.generateId();
      this.activation = 0;
      this.threshold = 0;
      this.state = 0;
      this.old = 0;
      this.squash = LOGISTIC;
    }
  }

  static generateId() {
    return Neuron.__id_count__++;
  }

  initialize(thresholdGenerator) {
    this.threshold = thresholdGenerator();
    return this;
  }

  toJson() {
    return {
      id: this.id,
      activation: this.activation,
      state: this.state,
      old: this.old,
      threshold: this.threshold,
      squash: this.quash
    }
  }

  activate(input) {
    if(input !== undefined) {
      this.activation = input;
      return this.activation;
    }

    this.old = this.state;
    this.state = 0;
    for (var i = 0; i < this.previous.length; i++) {
      this.state += this.previous[i].getState();
    }

    // eq 6.2
    this.activation = this.squash(this.state - this.threshold);

    return this.activation;
  }

  propagate(learningRate, output, momentum = 0) {
    let error = 0;
    // output is None means this is a neuron in hidden layer
    if (output === undefined) {
      // eq 6.15
      error = 0
      for (var i = 0; i < this.next.length; i++) {
        error += this.next[i].getError();
      }
      // console.log(error, 2);
    } else {
      // eq 6.4
      error = output - this.activation;
    }

    // eq 6.13
    this.errorGradient = this.squash(this.state - this.threshold, true) * error;

    // Update all connections
    for (var i = 0; i < this.previous.length; i++) {
      this.state += this.previous[i].calculateWeightCorrection(learningRate, momentum);
    }

    for (var i = 0; i < this.next.length; i++) {
      this.next[i].update();
    }

    // Update threshold
    this.threshold += (-1) * learningRate * this.errorGradient

    return error
  }

  connect(nextNeuron, weight) {
    new Connection(this, nextNeuron, weight);
    return this;
  }
}

function LOGISTIC(x, derivative = false) {
  if (derivative) {
    let fx = LOGISTIC(x);
    return fx * (1 - fx);
  }
  return 1 / (1 + Math.pow(x , 2))
}

function TANH(x, derivate) {
  if (derivate)
    return 1 - Math.pow(TANH(x), 2);
  var eP = Math.exp(x);
  var eN = 1 / eP;
  return (eP - eN) / (eP + eN);
};

function RELU(x, derivate) {
  if (derivate)
    return x > 0 ? 1 : 0;
  return x > 0 ? x : 0;
};

Neuron.__id_count__ = 0;

module.exports = {
  Neuron,
  squash: {
    LOGISTIC
  }
};