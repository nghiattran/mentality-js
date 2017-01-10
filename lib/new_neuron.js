'use strict';

let Connection = require('./connection');

class NewNeuron {
  constructor(setting) {
    this.next = [];
    this.previous = [];
    this.errorGradient = 0;
    this.error = {
      responsibility: 0,
      projected: 0,
      gated: 0
    };
    this.selfconnection = new Connection(this, this, 0);
    this.bias = Math.random() * .2 - .1;
    if (setting) {
      try {
        this.id = setting['id'];
        this.activation = setting['activation'];
        this.state = setting['state'];
        this.old = setting['old'];
        this.threshold = setting['threshold'];
        switch (setting['squash']) {
          case 'TANH':
            this.squash = TANH;
            break;
          case 'LINEAR':
            this.squash = LINEAR;
            break;
          case 'RELU':
            this.squash = RELU;
            break;
          case 'LOGISTIC':
          default:
            this.squash = LOGISTIC;
            break;
        }
      } catch (e) {
        throw Error('Input file is corrupted.')
      }
    } else {
      this.id = NewNeuron.generateId();
      this.activation = 0;
      this.state = 0;
      this.old = 0;
      this.squash = LOGISTIC;
      this.threshold = 0;
    }
  }

  /**
   * ID generator for NewNeuron class
   * @return {int}
   */
  static generateId() {
    return NewNeuron.__id_count__++;
  }

  /**
   * Initialize the connection with thresholdGenerator.
   * @param  {function} thresholdGenerator
   * @return {Network}  self
   */
  initialize(thresholdGenerator) {
    return this;
  }

  toJson() {
    return {
      id: this.id,
      activation: this.activation,
      state: this.state,
      old: this.old,
      threshold: this.threshold,
      squash: this.squash.name
    }
  }

  static fromJson(json) {
    return new NewNeuron(json);
  }

  activate(input) {
    if(input !== undefined) {
      this.activation = input;
      this.bias = 0;
      this.derivative = 0;
      return this.activation;
    }

    // old state
    this.old = this.state;

    // eq. 15
    this.state = this.selfconnection.gain * this.selfconnection.weight *
      this.state + this.bias;

    for (var i = 0; i < this.previous.length; i++) {
      var input = this.previous[i];
      this.state += input.from.activation * input.weight;
    }
    
    // eq. 16
    this.activation = this.squash(this.state);

    // f'(s)
    this.derivative = this.squash(this.state, true);

    for (var i = 0; i < this.previous.length; i++) {
      var input = this.previous[i];

      // elegibility trace - Eq. 17
      input.elegibility = this.selfconnection.gain * this.selfconnection.weight * 
                          input.elegibility + input.gain * input.from.activation;
    }

    return this.activation;
  }

  propagate(learningRate, target, momentum) {
    let error = 0;
    // target is undefined means this is a neuron in hidden layer
    if (target === undefined) {

      for (var i = 0; i < this.next.length; i++) {
        var connection = this.next[i];
        var neuron = connection.to;
        // Eq. 21
        error += neuron.error.responsibility * connection.weight;
      }

      // projected error responsibility
      error = 0;

      // gated error responsibility
      this.error.gated = this.derivative * error;

      // error responsibility - Eq. 23
      this.error.responsibility = this.error.projected + this.error.gated;
    } else {
      this.error.responsibility = this.error.projected = target - this.activation; // Eq. 10
    }

    // adjust all the neuron's incoming connections
    for (var i = 0; i < this.previous.length; i++) {
      var input = this.previous[i];

      // Eq. 24
      var gradient = this.error.projected * this.previous[i].elegibility;
      input.weight += learningRate * gradient; // adjust weights - aka learn
    }

    // adjust bias
    this.bias += learningRate * this.error.responsibility;
    return this.error.responsibility;
  }

  /**
   * Connection 2 neurons
   * @param  {NewNeuron} nextNeuron
   * @param  {float}  weight
   * @return {NewNeuron} this
   */
  connect(nextNeuron, weight) {
    let conn = new Connection(this, nextNeuron, weight);
    this.next.push(conn);
    nextNeuron.previous.push(conn);
    return this;
  }

  /**
   * Compare 2 neurons
   * @param  {Neurons}  neuron
   * @return {bool}
   */
  compareTo(neuron) {
    return this.activation === neuron.activation && 
           this.threshold === neuron.threshold &&
           this.id === neuron.id; 
  }
}


function LOGISTIC(x, derivative) {
  if (derivative) {
    let fx = LOGISTIC(x);
    return fx * (1 - fx);
  }

  return 1 / (1 + Math.pow(Math.E , -x));
}

function TANH(x, derivate) {
  if (derivate)
    return 1 - Math.pow(TANH(x), 2);
  let eP = Math.exp(x);
  let eN = 1 / eP;
  return (eP - eN) / (eP + eN);
};

function RELU(x, derivate) {
  if (derivate)
    return x > 0 ? 1 : 0;
  return x > 0 ? x : 0;
};

NewNeuron.__id_count__ = 1;
NewNeuron.squash = {
  LOGISTIC, TANH, RELU
}

module.exports = {
  NewNeuron
};