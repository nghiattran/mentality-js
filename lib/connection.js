'use strict';

let ValueError = require('./errors').ValueError;

module.exports = class Connection {
  constructor(from, to, weight) {
    if (from === undefined || to === undefined) {
      throw new ValueError('Origin object and destination object must not be undefined');
    }

    this.from = from;
    this.to = to;
    this.weight = weight || 0;
    this.deltaWeight = 0;
    this.id = this.from.id + '-' + this.to.id;
    this.from.next.push(this);
    this.to.previous.push(this);
  }

  /**
   * Initialize the connection with thresholdGenerator.
   * @param  {function} thresholdGenerator
   * @return {Network}  self
   */
  initialize(thresholdGenerator) {
    this.weight = thresholdGenerator();

    return this;
  }

  /**
   * Export Network object as json.
   * @return {Object}
   */
  toJson() {
    return {
      'from': this.from.id,
      'to': this.to.id,
      'weight': this.weight
    }
  }

  /**
   * Compare 2 connections
   * @param  {Connection} connection
   * @return {bool}
   */
  compareTo(connection) {
    return this.weight === connection.weight &&
            this.from.id === connection.from.id &&
            this.to.id === connection.to.id;
  }

  /**
   * Calculate the weight correction for the connection.
   * @param  {float}  learningRate
   * @param  {float}  momentum
   * @return {float}  this.deltaWeight  Weight correction
   */
  calculateWeightCorrection(learningRate, momentum) {
    momentum = momentum || 0;

    // eq 6.17
    this.deltaWeight = momentum * this.deltaWeight + 
                        learningRate * this.from.activation * this.to.errorGradient;
    return this.deltaWeight;
  }

  /**
   * Update connection's weight with its weight correction.
   * @return {Connection}
   */
  update() {
    this.weight += this.deltaWeight;
    return this;
  }

  /**
   * Calculate current state of a connection.
   * @return {float}
   */
  getState() {
    return this.weight * this.from.activation;
  }

  /**
   * Calculate error for a connection
   * @return {float}
   */
  getError() {
    return this.weight * this.to.errorGradient;
  }
}