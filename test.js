'use strict';

let assert = require('assert');
let fs = require('fs');
let Network = require('./').Network;
let Perceptron = require('./').Perceptron;
let Trainer = require('./').Trainer;

describe('Test fromJson/toJson', function(){
  function checkNeurons(first, second) {
    assert(first.activation === second.activation);
    assert(first.threshold === second.threshold);
  }

  function checkLayers(first, second) {
    assert(first.neurons.length === second.neurons.length);

    for (var i = 0; i < first.neurons.length; i++) {
      checkNeurons(first.neurons[i], second.neurons[i])
    }
  }

  function checkNetworks(first, second) {
    checkLayers(first.input, second.layers.input);

    assert(first.hidden.length === second.layers.hidden.length);
    for (var i = 0; i < first.hidden.length; i++) {
      checkLayers(first.hidden[i], second.layers.hidden[i]);
    }

    checkLayers(first.output, second.layers.output);
  }

  let network;
  let networkJson;
  before(function () {
    networkJson = fs.readFileSync('./sample/test_network.json').toString();
    networkJson = JSON.parse(networkJson);
    network = Network.fromJson(networkJson);
  })
  
  it('fromJson', function() {
    network = Network.fromJson(networkJson);

    checkNetworks(network, networkJson);
  });

  it('toJson', function() {
    network = Network.fromJson(networkJson);
    let json = network.toJson();
    checkNetworks(network, json);
  });
});

describe('Test Perceptron', function() {
  function sum(arr) {
    return arr.reduce(function(a, b) {
      return a + b;
    }, 0);
  }

  it('Test XOR operation', function() {
    let network = new Perceptron(2, [20], 1);
    let trainer = new Trainer(network);
    let result = trainer.XOR();
    assert(result.error < 0.1);

    assert(Math.abs(sum(network.activate([0, 0])) - 0) < 0.1);
    assert(Math.abs(sum(network.activate([1, 0])) - 1) < 0.1);
    assert(Math.abs(sum(network.activate([0, 1])) - 1) < 0.1);
    assert(Math.abs(sum(network.activate([1, 1])) - 0) < 0.1);
  });

  it('Test AND operation', function() {
    let network = new Perceptron(2, [20], 1);
    let trainer = new Trainer(network);
    let result = trainer.AND();
    assert(result.error < 0.1);

    assert(Math.abs(sum(network.activate([0, 0])) - 0) < 0.1);
    assert(Math.abs(sum(network.activate([1, 0])) - 0) < 0.1);
    assert(Math.abs(sum(network.activate([0, 1])) - 0) < 0.1);
    assert(Math.abs(sum(network.activate([1, 1])) - 1) < 0.1);
  });
})