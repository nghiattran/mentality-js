'use strict';

let assert = require('assert');
let fs = require('fs');
let Network = require('./').Network;
let Perceptron = require('./').Perceptron;
let Trainer = require('./').Trainer;
let Layer = require('./').Layer;
let ValueError = require('./').ValueError;
let Neuron = require('./').Neuron;

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
      network = Network.fromJson(networkJson);
      assert(network.compareTo(networkJson.layers));
    });

    it('toJson', function() {
      network = Network.fromJson(networkJson);
      let json = network.toJson();
      assert(network.compareTo(json.layers));
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
        input: layer11,
        output: layer12
      });

      let layer21 = new Layer(5);
      let layer22 = new Layer(5);
      let layer23 = new Layer(5);
      let layer24 = new Layer(5);
      layer21.project(layer22);
      layer22.project(layer23);
      layer23.project(layer24);
      let network2 = new Network({
        input: layer21,
        hidden: [layer22, layer23],
        output: layer24
      });

      assert(!network1.compareTo(network2));
    });

    it('Compare 2 different but similar Networks', function() {
      let layer11 = new Layer(5);
      let layer12 = new Layer(5);
      layer11.project(layer12);
      let network1 = new Network({
        input: layer11,
        output: layer12
      });

      let layer21 = new Layer(5);
      let layer22 = new Layer(5);
      layer21.project(layer22);
      let network2 = new Network({
        input: layer21,
        output: layer22
      });

      assert(!network1.compareTo(network2));
    });

    it('Compare 2 identical Networks', function() {
      let layer11 = new Layer(5);
      let layer12 = new Layer(5);
      layer11.project(layer12);

      let network1 = new Network({
        input: layer11,
        output: layer12
      });

      let network2 = new Network({
        input: layer11,
        output: layer12
      });

      assert(network1.compareTo(network2));
    });
  })

  describe('Layer', function() {
    it('Compare 2 different Layers', function() {
      let layer1 = new Layer(10);
      let layer2 = new Layer(6);

      assert(!layer1.compareTo(layer2));
    });

    it('Compare 2 different but similar Layers', function() {
      let layer1 = new Layer(10);
      let layer2 = new Layer(10);

      assert(!layer1.compareTo(layer2));
    });

    it('Compare 2 identical Layers', function() {
      let layer1 = new Layer(10);
      let layer2 = Layer.fromJson(layer1.toJson());

      assert(layer1.compareTo(layer2));
    });
  })

  describe('Neuron', function() {
    it('Compare 2 different Layers', function() {
      let neuron1 = new Neuron();
      let neuron2 = new Neuron();

      assert(!neuron1.compareTo(neuron2));
    });

    it('Compare 2 identical Layers', function() {
      let neuron1 = new Neuron(10);
      let neuron2 = Neuron.fromJson(neuron1.toJson());
      // console.log(neuron2);
      // console.log(neuron1);
      assert(neuron1.compareTo(neuron2));
    });
  })
})

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

describe('Test master network', function() {

})