'use strict';

const assert = require('assert');
const mentalityJs = require('../');
const json = require('../example/network.json');


const Node = mentalityJs.Node;
const KerasSequenceGraph = mentalityJs.Keras.SequenceGraph;
const utils = mentalityJs.utils;
const KerasLayers = mentalityJs.Keras.layers;


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

// let graph = new KerasGraph();
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



class Program {
  contructor() {}

  setGraph(graph) {
    this.graph = graph;
  }

  compile(opts={}) {
    let writer = new mentalityJs.writers.FileWriter();
    opts.writer = writer;

    let imports = [
      'from __future__ import absolute_import',
      'from __future__ import division',
      'from __future__ import print_function',
      '',
      'import tensorflow as tf',
      'import keras',
      'from tensorkit.base import ArchitectBase',
      '',
      ''
    ]
    writer.emitLines(imports);
    writer.emitLine('class Architect(ArchitectBase):');
    writer.incIndent();
    writer.emitLine('def build_graph(self, hypes, input, phrase):');
    writer.incIndent();
    this.graph.compile(opts);

    let graphChildren = this.graph.children;

    function pyReturn(child) {
      return `'${child.output.name}': ${child.output.name}`;
    }

    writer.emitLine(`return {${graphChildren.map(pyReturn).join(',')}}`);

  }
}

let image = new mentalityJs.Variable(utils.getName('input'), [-1, 66, 200, 3]);

let layer0 = new KerasLayers.Reshape({
  "type": "Reshape",
  "targetShape": [66, 200, 3]
}, image);

let layer1 = new KerasLayers.Input({})

let layer2 = new KerasLayers.Conv({
  "type": "Conv",
  "activation": "relu",
  "filters": 24,
  "kernelSize": [5, 5],
  "strides": [2, 2],
  "padding": "valid"
});

let layer3 = new KerasLayers.Conv({
  "type": "Conv",
  "activation": "relu",
  "filters": 36,
  "kernelSize": [5, 5],
  "strides": [2, 2],
  "padding": "valid"
});

let layer4 = new KerasLayers.Conv({
  "type": "Conv",
  "activation": "relu",
  "filters": 48,
  "kernelSize": [5, 5],
  "strides": [2, 2],
  "padding": "valid"
});

let layer5 = new KerasLayers.Conv({
  "type": "Conv",
  "activation": "relu",
  "filters": 64,
  "kernelSize": [3, 3],
  "strides": [1, 1],
  "padding": "valid"
});

let layer6 = new KerasLayers.Conv({
  "type": "Conv",
  "activation": "relu",
  "filters": 64,
  "kernelSize": [3, 3],
  "strides": [1, 1],
  "padding": "valid"
});

let layer7 = new KerasLayers.Flatten({
  "type": "flatten",
  "activation": "relu",
  "units": 1164
});

let layer8 = new KerasLayers.Dense({
  "type": "dense",
  "activation": "relu",
  "units": 1164
});

let layer9 = new KerasLayers.Dense({
  "type": "dense",
  "activation": "relu",
  "units": 100
});

let layer10 = new KerasLayers.Dense({
  "type": "dense",
  "activation": "relu",
  "units": 10
});

let layer11 = new KerasLayers.Dense({
  "name": "output",
  "type": "dense",
  "activation": "tanh",
  "units": 1
});

let compile = [];

let layers = [layer0, layer1, layer2, layer3, layer4, layer5, layer6, layer7, layer8, layer9, layer10, layer11];

let graph = new KerasSequenceGraph({
  nodes: layers,
  nameScope: 'Network',
});

// layers.map((e) => {
//   console.log(e.name, e.output.shape); 
// })

let program = new Program();
program.setGraph(graph);
program.compile();

// console.log(utils.toJson(graph));

// graph.toFile('./graph.json');