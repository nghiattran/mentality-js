'use strict';


module.exports = class Connection {
  constructor(from, to, weight) {
    this.from = from;
    this.to = to;
    this.weight = weight || 0;
    this.deltaWeight = 0;
    this.id = this.from.id + '-' + this.to.id;
    this.from.next.push(this);
    this.to.previous.push(this);
  }

  initialize(thresholdGenerator) {
    this.weight = thresholdGenerator();

    return this;
  }

  toJson() {
    return {
      'from': this.from.id,
      'to': this.to.id,
      'weight': this.weight
    }
  }

  calculateWeightCorrection(learningRate, momentum) {
    momentum = momentum || 0;

    // eq 6.17
    this.deltaWeight = momentum * this.deltaWeight + 
                        learningRate * this.from.activation * this.to.errorGradient;
    return this.deltaWeight;
  }
  update() {
    this.weight += this.deltaWeight;
    return this;
  }

  getState() {
    return this.weight * this.from.activation;
  }

  getError() {
    return this.weight * this.to.errorGradient;
  }
}