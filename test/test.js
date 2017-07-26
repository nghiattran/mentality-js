'use strict';

const assert = require('assert');
const mentalityJs = require('../');
const json = require('../example/network.json');

const Node = mentalityJs.Node;
const TFGraph = mentalityJs.Tensorflow.Graph;
const utils = mentalityJs.utils;
const TFLayers = mentalityJs.Tensorflow.layers;

// let node1 = new Node('node1');
// let node2 = new Node('node2');
// let node3 = new Node('node3');
// let node4 = new Node('node4');
// let node5 = new Node('node5');
// let node6 = new Node('node6');
// let node7 = new Node('node7');
// let node8 = new Node('node8');

// node1.link(node3);
// node2.link(node3);
// node3.link(node6);
// node5.link(node6);
// node1.link(node5);
// node2.link(node4);
// node6.link(node4);

// let graph = new TFGraph();
// graph.addNodes([node1, node2, node3, node4, node5, node6, node7, node8])

// // 1   2
// //   3
// //  5 
// //  6
// //    4

// // node1.link(node2);
// // node2.link(node3);
// // node3.link(node1);

// graph.compile();

let image = new mentalityJs.Variable('image');
let graph = new TFGraph();

let layer1 = new TFLayers.Conv({
  "name": "layer1",
  "type": "Conv",
  "activation": "Relu",
  "filter": [3, 3, 3, 64],
  "strides": [1, 1, 1, 1],
  "padding": "SAME",
  "to": ["layer2"]
}, image);

let layer2 = new TFLayers.Conv({
  "type": "Conv",
  "name": "layer2",
  "activation": "Relu",
  "filter": [1, 2, 2, 1],
  "strides": [1, 1, 1, 1],
  "padding": "SAME"
}, layer1.state);

let layer3 = new TFLayers.FC({
  "type": "fc",
  "name": "layer3",
  "activation": "Relu",
  "neurons": 1000
}, layer2.state);

layer1.link(layer2);
layer2.link(layer3);

graph.addNodes([layer1, layer2, layer3]);
graph.compile();

// console.log(graph);