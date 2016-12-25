'use strict';

let Layer = require('./layer');

class Network {
  constructor(setting) {
    if (!setting) {
      return;
    }

    this.set(setting);
  }

  initialize(cb) {
    if (!cb) {
      cb = Math.random;
    }

    let neurons = this.getNeurons();
    for (let i = 0; i < neurons.length; i++) {
      neurons[i].initialize(cb);
    }

    let connections = this.getConnections();
    for (let i = 0; i < connections.length; i++) {
      connections[i].initialize(cb);
    }
  }

  set(setting) {
    if (!setting['input'] || !setting['output'])
      throw Error('Input layer or output layer for both are missing');

    if (!(setting['input'] instanceof Layer) || !(setting['output'] instanceof Layer))
      throw Error('Input layer, or output layer, or both are not Layer instances');

    this.input = setting['input'];
    this.output = setting['output'];

    if (setting['hidden']) {
      this.hidden = setting['hidden'];
    } else {
      this.hidden = [];
    }

    this.input.setName('input')
    this.output.setName('output')
    for (let i = 0; i < this.hidden.length; i++) {
      this.hidden[i].setName(i + '');
    }

    if (setting['connections']) {
      let neurons = this.getNeuronsDict()

      for (let i = 0; i < setting['connections'].length; i++) {
        let conn = setting['connections'][i];
        neurons[conn['from']].connect(neurons[conn['to']], conn['weight']);
      }
    } else {
      // Initialize all connections and neurons
      this.initialize(setting['init']);
    }

    return this;
  }

  getNeurons() {
    let neurons = [].concat(this.input.neurons)
                    .concat(this.output.neurons);
    for (let i = 0; i < this.hidden.length; i++) {
      neurons = neurons.concat(this.hidden[i].neurons);
    }
    return neurons;
  }

  getNeuronsDict() {
    let dict = {};
    let neurons = this.getNeurons();
    for (let i = 0; i < neurons.length; i++) {
      dict[neurons[i].id] = neurons[i];
    }
    return dict;
  }

  getConnections() {
    let connections = [].concat(this.input.getConnections())
                        .concat(this.output.getConnections());

    for (let i = 0; i < this.hidden.length; i++) {
      connections = connections.concat(this.hidden[i].getConnections());
    }
    return connections;
  }

  activate(inputs) {
    this.input.activate(inputs);
    for (let i = 0; i < this.hidden.length; i++) {
      this.hidden[i].activate();
    }
    return this.output.activate()
  }

  propagate(leaningRate, outputs, momentum = 0) {
    let errors = this.output.propagate(leaningRate, outputs, momentum);
    for (let i = 0; i < this.hidden.length; i++) {
      this.hidden[i].propagate(leaningRate, undefined, momentum);
    }
    this.input.propagate(leaningRate, undefined, momentum);
    return errors;
  }

  setSquash(squash) {
    let neurons = this.getNeurons();
    for (let i = 0; i < neurons.length; i++) {
      neurons[i].squash = squash;
    }
  }

  toJson() {
    let hidden = [];
    for (let i = 0; i < this.hidden.length; i++) {
      hidden.push(this.hidden[i].toJson());
    }

    let connections = this.getConnections();
    let connectionJson = []
    for (let i = 0; i < connections.length; i++) {
      connectionJson.push(connections[i].toJson());
     } 

    return {
      layer: {
        input: this.input.toJson(),
        hidden: hidden,
        output: this.output.toJson()
      },
      connections: connectionJson
    }
  }

  static fromJson(setting) {
    let hidden = [];
    for (let i = 0; i < setting['layers']['hidden'].length; i++) {
      hidden.push(new Layer(setting['layers']['hidden'][i]));
    }
    
    return new Network({
      input: new Layer(setting['layers']['input']),
      hidden: hidden,
      output: new Layer(setting['layers']['output']),
      connections: setting['connections']
    });
  }
}

class Perceptron extends Network {
  constructor(input, hidden, output) {
    super();
    let inputLayer = new Layer(input);
    let outputLayer = new Layer(output);

    let hiddenLayer = [];

    if (!hidden) {
      inputLayer.project(outputLayer);
    } else {
      for (let i = 0; i < hidden.length; i++) {
        hiddenLayer.push(new Layer(hidden[i]));

        if (i !== 0) {
          hiddenLayer[i - 1].project(hiddenLayer[i]);
        }
      }

      inputLayer.project(hiddenLayer[0]);
      hiddenLayer[hiddenLayer.length - 1].project(outputLayer);
    }

    this.set({
      input: inputLayer,
      hidden: hiddenLayer,
      output: outputLayer
    })
  }
}

module.exports = {
  Perceptron,
  Network
}