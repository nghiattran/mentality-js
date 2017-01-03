'use strict';

let Perceptron = require('./lib/network').Perceptron;
let Network = require('./lib/network').Network;
let Trainer = require('./lib/trainer').Trainer;
let Cost = require('./lib/trainer').Cost;
let Neuron = require('./lib/neuron').Neuron;
let squash = require('./lib/neuron').squash;
let Connection = require('./lib/connection').Connection;
let Layer = require('./lib/layer').Layer;
let ValueError = require('./lib/errors').ValueError;

module.exports = {
  Perceptron, Trainer, Cost, Neuron, squash, Connection, 
  Network, Layer, ValueError
};