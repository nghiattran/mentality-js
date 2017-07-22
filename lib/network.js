'use strict';

const Layer = require('./layer');
const Node = require('./node');
const BaseObject = require('./baseObject');
const Tensorflow = require('./tensorflow');


class LinkedListObj {
  constructor(content, from) {
    this.content = content;
    this.to = content.to;

    if (from) {
      this.head = from.head;
      from.next = this;
    } else {
      this.head = this;
    }
  }
}

module.exports = class Network {
  constructor(factory=Tensorflow, inputNodes) {
    this.factory = factory;
    this.inputNodes = inputNodes;
    this.layers = [];
  }

  addLayer(layerInfo, toLayerName = undefined) {
    if (layerInfo['name'] in this.layers)
      throw Error('Layer must have distinct name');

    let LayerType = this.factory.layers[layerInfo.type];
    let layer = new LayerType(layerInfo);
    this.layers[layer.name] = layer;

    if (toLayerName) {
      layer.link(this.layers[toLayerName]);
    }
  }


  static fromJson(json, factory) {
    // create input nodes
    let inputNodes = [];
    for (let i = 0; i < json.inputs.length; i++) {
      inputNodes.push(new Node(json.inputs[i]));
    }

    // create network
    let network = new Network(factory, inputNodes);

    // create layers
    for (let i = 0; i < json.layers.length; i++) {
      network.addLayer(json.layers[i]);
    }

    // Setup variables
    let layersDict = network.layers;
    let layers = [];
    for (let key in layersDict) {
      layers.push(layersDict[key]);
    }

    // Linking nodes, ops, and layers
    // Link input nodes
    for (let a = 0; a < inputNodes.length; a++) {
      const toNodes = json.inputs[a].to;
      for (let b = 0; b < toNodes.length; b++) {
        inputNodes[a].link(layersDict[toNodes[b]]);
      }
    }

    for (let a = 0; a < layers.length; a++) {
      if (!layersDict[json.layers[a].to]) continue;

      const toNodes = json.layers[a].to;
      for (let b = 0; b < toNodes.length; b++) {
        layers[a].link(layersDict[toNodes[b]]);
      }
    }

    return network;
  }

  rolling() {
    let memory = {};
    let stack = [];
    for (let i = 0; i < this.inputNodes.length; i++) {
      let node = new LinkedListObj(this.inputNodes[i], undefined);
      memory[this.inputNodes[i].name] = node;
      stack.push(node);
    }

    while (stack.length > 0) {
      let currentNode = stack.pop();
      for (let i = 0; i < currentNode.to.length; i++) {
        let newNode;
        if (currentNode.to[i].name in memory) {
          newNode = memory[currentNode.to[i].content.name];
          newNode.from.next = currentNode.head;
          currentNode.next = newNode;
        } else {
          newNode = new LinkedListObj(currentNode.to[i], currentNode);
          stack.push(newNode);
        }
        memory[newNode.content.name] = newNode;
      }
    }

    let head;
    let tail;
    for (let key in memory) {
      if (!memory[key].next) {
        if (tail) {
          tail.next = memory[key].head;
        } else {
          tail = memory[key];
          head = memory[key].head;
        }
      }
    }

    return head;
  }

  toJson() {

  }
};