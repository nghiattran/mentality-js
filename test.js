'use strict';

let assert = require('assert');
let fs = require('fs');
let mentality = require('./');
let Network = mentality.Network;
let Perceptron = mentality.Perceptron;
let Trainer = mentality.Trainer;
let Layer = mentality.Layer;
let ValueError = mentality.Error.ValueError;
let Neuron = mentality.Neuron;


describe('Test fromJson/toJson', function() {
  describe('Network', function() {
    let network;
    let networkJson;
    before(function () {
      networkJson = fs.readFileSync('./sample/test_network.json').toString();
      networkJson = JSON.parse(networkJson);
      network = Network.fromJson(networkJson);
    })
    
    it('fromJson', function() {
      let tmpnetwork = Network.fromJson(networkJson);
      assert(network.compareTo(tmpnetwork));
    });

    it('toJson', function() {
      let tmpnetwork = Network.fromJson(networkJson);
      let json = network.toJson();
      assert(network.compareTo(tmpnetwork));
    });
  })
});

describe('Test object comparation', function() {
  describe('Perceptron', function() {
    it('Compare 2 different Perceptrons', function() {
      let network1 = new Perceptron(2, [1, 1], 1);
      let network2 = new Perceptron(1, [], 1);

      assert(!network1.compareTo(network2));
    });

    it('Compare 2 different but similar Perceptrons', function() {
      let network1 = new Perceptron(1, [1, 1, 1, 1], 1);
      let network2 = new Perceptron(1, [1, 1, 1, 1], 1);

      assert(!network1.compareTo(network2));
    });

    it('Compare 2 identical Perceptrons', function() {
      let network1 = new Perceptron(2, [1, 1, 1, 1], 1);
      let network2 = Perceptron.fromJson(network1.toJson())

      assert(network1.compareTo(network2));
    });
  })

  describe('Network', function() {
    it('Compare 2 different Networks', function() {
      let layer11 = new Layer(5);
      let layer12 = new Layer(5);
      layer11.project(layer12);
      let network1 = new Network({
        input: layer11.neurons,
        output: layer12.neurons
      });

      let layer21 = new Layer(5);
      let layer22 = new Layer(5);
      let layer23 = new Layer(5);
      let layer24 = new Layer(5);
      layer21.project(layer22);
      layer22.project(layer23);
      layer23.project(layer24);
      let network2 = new Network({
        input: layer21.neurons,
        output: layer24.neurons
      });

      assert(!network1.compareTo(network2));
    });

    it('Compare 2 different but similar Networks', function() {
      let layer11 = new Layer(5);
      let layer12 = new Layer(5);
      layer11.project(layer12);
      let network1 = new Network({
        input: layer11.neurons,
        output: layer12.neurons
      });

      let layer21 = new Layer(5);
      let layer22 = new Layer(5);
      layer21.project(layer22);
      let network2 = new Network({
        input: layer21.neurons,
        output: layer22.neurons
      });

      assert(!network1.compareTo(network2));
    });

    it('Compare 2 identical Networks', function() {
      let layer11 = new Layer(5);
      let layer12 = new Layer(5);
      layer11.project(layer12);

      let network1 = new Network({
        input: layer11.neurons,
        output: layer12.neurons
      });

      let network2 = new Network({
        input: layer11.neurons,
        output: layer12.neurons
      });

      assert(network1.compareTo(network2));
    });
  })

  describe('Neuron', function() {
    it('Compare 2 different Neurons', function() {
      let neuron1 = new Neuron();
      let neuron2 = new Neuron();

      assert(!neuron1.compareTo(neuron2));
    });

    it('Compare 2 identical Neurons', function() {
      let neuron1 = new Neuron();
      let neuron2 = Neuron.fromJson(neuron1.toJson());
      assert(neuron1.compareTo(neuron2));
    });
  })
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
  describe('Layer', function() {
    it('Test create empty Layer', function() {
      let createLayer = () => new Layer();
      assert.throws(createLayer, ValueError);
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
  })
})

describe('Test functionality', function() {
  function sum(arr) {
    return arr.reduce(function(a, b) {
      return a + b;
    }, 0);
  }

  describe('Network', function() {
    it('Test XOR operation', function() {
      let input = new Layer(2);
      let hidden = new Layer(2);
      let output = new Layer(1);

      input.project(hidden);
      hidden.project(output);

      let network = new Network({
        input: input.neurons,
        output: output.neurons
      });

      let trainer = new Trainer(network);
      let result = trainer.XOR();
      assert(result.error < 0.1);
      let errorBound = Math.sqrt(0.1);

      assert(Math.abs(sum(network.activate([0, 0])) - 0) < errorBound);
      assert(Math.abs(sum(network.activate([1, 0])) - 1) < errorBound);
      assert(Math.abs(sum(network.activate([0, 1])) - 1) < errorBound);
      assert(Math.abs(sum(network.activate([1, 1])) - 0) < errorBound);
      this.retries(3);
    });

    it('Test AND operation', function() {
      let input = new Layer(2);
      let hidden = new Layer(2);
      let output = new Layer(1);

      input.project(hidden);
      hidden.project(output);

      let network = new Network({
        input: input.neurons,
        output: output.neurons
      });
      let trainer = new Trainer(network);
      let result = trainer.AND();
      assert(result.error < 0.1);
      let errorBound = Math.sqrt(0.1);

      assert(Math.abs(sum(network.activate([0, 0])) - 0) < errorBound);
      assert(Math.abs(sum(network.activate([1, 0])) - 0) < errorBound);
      assert(Math.abs(sum(network.activate([0, 1])) - 0) < errorBound);
      assert(Math.abs(sum(network.activate([1, 1])) - 1) < errorBound);
      this.retries(3);
    });
  })

  describe('Perceptron', function() {
    it('Test XOR operation', function() {
      let network = new Perceptron(2, [2], 1);
      let trainer = new Trainer(network);
      let result = trainer.XOR();
      assert(result.error < 0.1);
      let errorBound = Math.sqrt(0.1);

      assert(Math.abs(sum(network.activate([0, 0])) - 0) < errorBound);
      assert(Math.abs(sum(network.activate([1, 0])) - 1) < errorBound);
      assert(Math.abs(sum(network.activate([0, 1])) - 1) < errorBound);
      assert(Math.abs(sum(network.activate([1, 1])) - 0) < errorBound);
      this.retries(3);
    });

    it('Test AND operation', function() {
      let network = new Perceptron(2, [2], 1);
      let trainer = new Trainer(network);
      let result = trainer.AND();
      assert(result.error < 0.1);
      let errorBound = Math.sqrt(0.1);

      assert(Math.abs(sum(network.activate([0, 0])) - 0) < errorBound);
      assert(Math.abs(sum(network.activate([1, 0])) - 0) < errorBound);
      assert(Math.abs(sum(network.activate([0, 1])) - 0) < errorBound);
      assert(Math.abs(sum(network.activate([1, 1])) - 1) < errorBound);
      this.retries(3);
    });
  })
})