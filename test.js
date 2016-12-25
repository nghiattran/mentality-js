'use strict';

let assert = require('assert');
let fs = require('fs');
let Network = require('./').Network;

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
    networkJson = fs.readFileSync('./test/test_network.json').toString();
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