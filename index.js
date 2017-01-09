'use strict';

let Perceptron = require('./lib/network').Perceptron;
let Network = require('./lib/network').Network;
let Trainer = require('./lib/trainer').Trainer;
let Cost = require('./lib/trainer').Cost;
let Neuron = require('./lib/neuron').Neuron;
let Connection = require('./lib/connection').Connection;
let Layer = require('./lib/layer').Layer;
let Error = require('./lib/errors');

module.exports = {
  Perceptron, Trainer, Cost, Neuron, Connection, 
  Network, Layer, Error
};