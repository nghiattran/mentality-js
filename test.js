'use strict';

let assert = require('assert');
let fs = require('fs');
let mentality = require('./');
let synaptic = require('synaptic');
let Network = mentality.Network;
let Perceptron = mentality.Perceptron;
let Trainer = synaptic.Trainer;
let Layer = synaptic.Layer;

// describe('Test fromJson/toJson', function() {
//   describe('Network', function() {
//     let network;
//     let networkJson;
//     before(function () {
//       networkJson = fs.readFileSync('./sample/test_network.json').toString();
//       networkJson = JSON.parse(networkJson);
//       network = Network.fromJson(networkJson);
//     })
    
//     it('fromJson', function() {
//       let tmpnetwork = Network.fromJson(networkJson);
//       assert(network.compareTo(tmpnetwork));
//     });

//     it('toJson', function() {
//       let tmpnetwork = Network.fromJson(networkJson);
//       let json = network.toJson();
//       assert(network.compareTo(tmpnetwork));
//     });
//   })
// });

// describe('Test object comparation', function() {
//   describe('Perceptron', function() {
//     it('Compare 2 different Perceptrons', function() {
//       let network1 = new Perceptron(2, [1, 1], 1);
//       let network2 = new Perceptron(1, [], 1);

//       assert(!network1.compareTo(network2));
//     });

//     it('Compare 2 different but similar Perceptrons', function() {
//       let network1 = new Perceptron(1, [1, 1, 1, 1], 1);
//       let network2 = new Perceptron(1, [1, 1, 1, 1], 1);

//       assert(!network1.compareTo(network2));
//     });

//     it('Compare 2 identical Perceptrons', function() {
//       let network1 = new Perceptron(2, [1, 1, 1, 1], 1);
//       let network2 = Perceptron.fromJson(network1.toJson())

//       assert(network1.compareTo(network2));
//     });
//   })

//   describe('Network', function() {
//     it('Compare 2 different Networks', function() {
//       let layer11 = new Layer(5);
//       let layer12 = new Layer(5);
//       layer11.project(layer12);
//       let network1 = new Network({
//         input: layer11.neurons,
//         output: layer12.neurons
//       });

//       let layer21 = new Layer(5);
//       let layer22 = new Layer(5);
//       let layer23 = new Layer(5);
//       let layer24 = new Layer(5);
//       layer21.project(layer22);
//       layer22.project(layer23);
//       layer23.project(layer24);
//       let network2 = new Network({
//         input: layer21.neurons,
//         output: layer24.neurons
//       });

//       assert(!network1.compareTo(network2));
//     });

//     it('Compare 2 different but similar Networks', function() {
//       let layer11 = new Layer(5);
//       let layer12 = new Layer(5);
//       layer11.project(layer12);
//       let network1 = new Network({
//         input: layer11.neurons,
//         output: layer12.neurons
//       });

//       let layer21 = new Layer(5);
//       let layer22 = new Layer(5);
//       layer21.project(layer22);
//       let network2 = new Network({
//         input: layer21.neurons,
//         output: layer22.neurons
//       });

//       assert(!network1.compareTo(network2));
//     });

//     it('Compare 2 identical Networks', function() {
//       let layer11 = new Layer(5);
//       let layer12 = new Layer(5);
//       layer11.project(layer12);

//       let network1 = new Network({
//         input: layer11.neurons,
//         output: layer12.neurons
//       });

//       let network2 = new Network({
//         input: layer11.neurons,
//         output: layer12.neurons
//       });

//       assert(network1.compareTo(network2));
//     });
//   })

//   describe('Neuron', function() {
//     it('Compare 2 different Neurons', function() {
//       let neuron1 = new Neuron();
//       let neuron2 = new Neuron();

//       assert(!neuron1.compareTo(neuron2));
//     });

//     it('Compare 2 identical Neurons', function() {
//       let neuron1 = new Neuron();
//       let neuron2 = Neuron.fromJson(neuron1.toJson());
//       assert(neuron1.compareTo(neuron2));
//     });
//   })
// })

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
        input: input.list,
        output: output.list
      });

      let trainer = new Trainer(network);
      let result = trainer.XOR({
        error: 0.05,
        shuffle: true
      });
      assert(result.error < 0.05);
      this.retries(3);
    });
  })

  describe('Perceptron', function() {
    it('Test XOR operation', function() {
      let network = new Perceptron(2, [2], 1);
      let trainer = new Trainer(network);
      let result = trainer.XOR({
        error: 0.05,
        shuffle: true
      });
      assert(result.error < 0.05);
      this.retries(3);
    });
  })
})