'use strict';

let assert = require('assert');
let fs = require('fs');
let Network = require('./').Network;
let Perceptron = require('./').Perceptron;
let Trainer = require('./').Trainer;
let Layer = require('./').Layer;
let ValueError = require('./').ValueError;


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

describe('Test Trainer options parser', function() {
  it('Test epoch limit setting', function() {
    let network = new Perceptron(2, [], 1);
    let trainer = new Trainer(network);
    let epoch = 5;
    let result = trainer.XOR({
      epoch
    });

    assert(result.epoch === epoch);
  });

  it('Test rate setting', function() {
    let network = new Perceptron(2, [], 1);
    let trainer = new Trainer(network);
    let rate = 0.5;
    let result = trainer.XOR({
      rate, epoch: 5
    });
    assert(result.rate === rate);
  });

  it('Test adaptative learning rate', function() {
    let network = new Perceptron(2, [], 1);
    let trainer = new Trainer(network);
    let epoch = 10;
    let lastRate = 0.05;
    let result = trainer.XOR({
      epoch,
      rate: function (learningRate) {
        if (learningRate === -1) {
          return 0.1
        };
        assert(learningRate === lastRate + 0.05);
        lastRate = learningRate;
        return learningRate + 0.05;
      }
    });
  });

  it('Test error setting', function() {
    let network = new Perceptron(2, [10], 1);
    let trainer = new Trainer(network);
    let error = 0.05;
    let result = trainer.XOR({
      error
    });
    assert(error >= result.error);
  });
})

describe('Test error handler', function() {
  describe('Trainer', function() {
    it('Test train empty network', function() {
      let network = new Network();
      let trainer = new Trainer(network);
      let epoch = 5;

      assert.throws(trainer.XOR, TypeError);
    });
  })

  describe('Layer', function() {
    it('Test create empty Layer', function() {
      let createLayer = () => new Layer();
      assert.throws(createLayer, ValueError);
    });

    it('Test activate Layer with wrong number of inputs', function() {
      let layer = new Layer(5);
      let activate = () => layer.activate([0,0,0]);

      assert.throws(activate, ValueError);
    });

    it('Test propagate Layer with wrong number of inputs', function() {
      let layer = new Layer(5);
      let propagate = () => layer.propagate(0.1, [0,0,0]);

      assert.throws(propagate, ValueError);
    });

    it('Test project on non-Layer object: array', function() {
      let layer = new Layer(5);
      let project = () => layer.project([0,0,0]);
      
      assert.throws(project, ValueError);
    });

    it('Test project on non-Layer object: object', function() {
      let layer = new Layer(5);
      let project = () => layer.project({});
      
      assert.throws(project, ValueError);
    });

    it('Test project on non-Layer object: Network', function() {
      let layer = new Layer(5);
      let network = new Network();
      let project = () => layer.project(network);
      
      assert.throws(project, ValueError);
    });
  })
})