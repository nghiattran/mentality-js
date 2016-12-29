'use strict';

let Layer = require('./layer').Layer;
let ValueError = require('./errors').ValueError;

class Network {
  static generateId() {
    return Network.__id_count__++;
  }

  constructor(setting) {
    this.next = [];
    this.previous = [];
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
    this.id = setting['id'] || Network.generateId();

    if (!setting['input'] || !setting['output'])
      throw ReferenceError('Input layer or output layer for both are missing.');

    if (!(setting['input'] instanceof Layer) || !(setting['output'] instanceof Layer))
      throw TypeError('Input layer, or output layer, or both are not Layer instances');

    // Set all layer
    this.input = setting['input'];
    this.output = setting['output'];
    if (setting['hidden']) {
      this.hidden = setting['hidden'];
    } else {
      this.hidden = [];
    }

    // Set layer name
    this.input.setName(setting['input']['name'] || 'input');
    this.output.setName(setting['output']['name'] || 'output');
    for (let i = 0; i < this.hidden.length; i++) {
      this.hidden[i].setName(setting['hidden'][i]['name'] || i + '');
    }

    if (setting['connections']) {
      let neurons = this.getNeuronsDict()

      for (let i = 0; i < setting['connections'].length; i++) {
        let conn = setting['connections'][i];

        if (neurons[conn['to']]) {
          neurons[conn['from']].connect(neurons[conn['to']], conn['weight']);
        }
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

  propagate(learningRate, outputs, momentum) {
    momentum = momentum || 0;

    let errors = this.output.propagate(learningRate, outputs, momentum);
    for (let i = 0; i < this.hidden.length; i++) {
      this.hidden[i].propagate(learningRate, undefined, momentum);
    }
    this.input.propagate(learningRate, undefined, momentum);
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

    let to = [];
    for (var i = 0; i < this.next.length; i++) {
      to.push(this.next[i].id);
    }

    return {
      id: this.id,
      layers: {
        input: this.input.toJson(),
        hidden: hidden,
        output: this.output.toJson()
      },
      to,
      connections: connectionJson
    }
  }

  project(network, projection = Layer.projection.ONE_TO_ONE) {
    if (! (network instanceof Network)) {
      throw new TypeError('Network object can only project on another Network object.');
    }

    this.next.push(network);
    network.previous.push(this);

    this.output.project(network.input, projection);
  }

  projectJson(network, connections) {
    this.next.push(network);
    network.previous.push(this);

    this.output.projectJson(network.input, connections);
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
      connections: setting['connections'],
      id: setting['id']
    });
  }

  compareTo(network) {
    if (!this.input.compareTo(network.input)) {
      return false;
    }

    if (this.hidden.length !== network.hidden.length) {
      return false;
    }

    for (var i = 0; i < this.hidden.length; i++) {
      if (!this.hidden[i].compareTo(network.hidden[i])) {
        return false;
      }
    }
    
    return this.output.compareTo(network.output);
  }
}

class Perceptron extends Network {
  constructor(input, hidden, output) {
    super();
    let inputLayer = new Layer(input);
    let outputLayer = new Layer(output);

    let hiddenLayer = [];

    if (!hidden || hidden.length === 0) {
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

class MasterNetwork {
  constructor(network) {
    this.network = network;
    this.stack = [];
  }

  ready() {
    this.stack = this.findCallStack();
  }

  activate(inputs) {
    // TODO: validate parameter
    // let starts = findStart(this.network);
    // if (starts.length !== inputs.length) {
    //   throw new ValueError("Inputs don't match with number of input neurons.");
    // }
    // let ends = findEnd(this.network);

    if (this.stack === undefined) {
      throw ValueError('Read function must be called before activating.');
    }

    inputs = [inputs];
    let stack = this.stack;
    let result = [];

    for (let i = 0; i < stack.length; i++) {
      if (stack[i].next.length === 0) {
        result = result.concat(stack[i].activate(inputs[i]));
      } else {
        stack[i].activate(inputs[i]);
      }
    }

    return result;
  }

  propagate(learningRate, outputs, momentum) {
    outputs = [outputs];
    let stack = this.stack;
    let result = [];
    for (let i = stack.length - 1; i >= 0; i--) {
      if (stack.length - 1 - i < outputs.length) {
        result = result.concat(stack[i].propagate(learningRate, outputs[stack.length - 1 - i], momentum));
      } else{
        stack[i].propagate(learningRate, undefined, momentum);
      }
    }
    return result;
  }

  findCallStack() {
    let stack = [];
    let nodes = MasterNetwork.findEnd(this.network);
    for (let i = 0; i < nodes.length; i++) {
      stack = stack.concat(this.findLocalCallStack(nodes[i]))
    }
    return stack;
  }

  findLocalCallStack(network, visited = {}) {
    let stack = [];
    visited[network.id] = true;
    for (let i = 0; i < network.previous.length; i++) {
      if (!visited[network.previous[i].id]) {
        stack = stack.concat(this.findLocalCallStack(network.previous[i], visited));
      }
    }
    stack.push(network);
    return stack;
  }

  static findStart(network) {
    let starts = []
    let pointer = network;

    // Move to one of the last network
    while(pointer.next && pointer.next.length !== 0) pointer = pointer.next[0];

    let visited = {};
    let queue = [];
    while (pointer) {
      visited[pointer.id] = true;

      if (pointer.previous.length === 0) {
        starts.push(pointer);
      }

      for (let i = 0; i < pointer.previous.length; i++) {
        if (!visited[pointer.previous[i].id]) {
          queue.push(pointer.previous[i]);
        }
      }

      pointer = queue.pop();
    }

    return starts;
  }

  static findEnd(network) {
    let ends = []
    let pointer = network;

    // Move to one of the first network
    while(pointer.previous && pointer.previous.length !== 0) pointer = pointer.previous[0];

    let visited = {};
    let queue = [];
    while (pointer) {
      visited[pointer.id] = true;

      if (pointer.next.length === 0) {
        ends.push(pointer);
      }

      for (let i = 0; i < pointer.next.length; i++) {
        if (!visited[pointer.next[i].id]) {
          queue.push(pointer.next[i]);
        }
      }

      pointer = queue.pop();
    }

    return ends;
  }

  toJson() {
    let stack = this.findCallStack();
    let networks = [];
    for (var i = 0; i < stack.length; i++) {
      networks.push(stack[i].toJson());
    }
    return {
      networks
    }
  }

  static fromJson(setting) {
    // Create all networks
    let networks = {};
    for (var i = 0; i < setting['networks'].length; i++) {
      networks[setting['networks'][i].id] = Network.fromJson(setting['networks'][i]);
    }

    // Create connections that link networks
    for (var x = 0; x < setting['networks'].length; x++) {
      for (var y = 0; y < setting['networks'][x]['to'].length; y++) {
        let currentNetwork = networks[setting['networks'][x].id];
        let nextNetwork = networks[setting['networks'][x]['to'][y]];
        currentNetwork
          .projectJson(nextNetwork, setting['networks'][x]['connections']);
      }
    }

    return new MasterNetwork(networks[setting['networks'][0].id]);
  }

  getNeurons() {
    let stack = this.findCallStack();
    let neurons = [];

    for (var i = 0; i < stack.length; i++) {
      neurons = neurons.concat(stack[i].getNeurons());
    }
    return neurons;
  }

  getInputNetworks() {
    return MasterNetwork.findStart(this.network);
  }

  getOutputNetworks() {
    return MasterNetwork.findEnd(this.network);
  }
}

Network.__id_count__ = 1;

module.exports = {
  Perceptron,
  Network,
  MasterNetwork
}