'use strict';

let Perceptron = require('./lib/network').Perceptron;
let Network = require('./lib/network').Network;
let Trainer = require('./lib/trainer').Trainer;
let Cost = require('./lib/trainer').Cost;
let Neuron = require('./lib/neuron').Neuron;
let squash = require('./lib/neuron').squash;
let Connection = require('./lib/connection').Connection;
let fs = require('fs');

module.exports = {
  Perceptron, Trainer, Cost, Neuron, squash, Connection, Network
};

// let content = fs.readFileSync('./sample/test_network.json').toString();
// content = JSON.parse(content);
// let network = Perceptron.fromJson(content);
// console.log(network);
// let network = new Perceptron(2, [20], 1);
// let trainer = new Trainer(network)
// let settings = {
//     'momentum': 0.,    
//     'log': 1,
//     // epoch: 2,
//     'error': 0.01,
//     'cost': Cost.SE
// }

// let res = trainer.AND(settings)
// console.log(res);
// console.log(network.toJson());