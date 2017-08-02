'use strict';

const assert = require('assert');
const path = require('path');
const mentalityJs = require('../');
const json = require('../example/network.json');


const Node = mentalityJs.Node;
const KerasSequenceGraph = mentalityJs.Keras.SequenceGraph;
const utils = mentalityJs.utils;
const KerasLayers = mentalityJs.Keras.layers;


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

let layer2 = new KerasLayers.Conv2D({
  "type": "Conv",
  "activation": "relu",
  "filters": 24,
  "kernelSize": [5, 5],
  "strides": [2, 2],
  "padding": "valid"
});

let layer3 = new KerasLayers.Conv2D({
  "type": "Conv",
  "activation": "relu",
  "filters": 36,
  "kernelSize": [5, 5],
  "strides": [2, 2],
  "padding": "valid"
});

let layer4 = new KerasLayers.MaxPool2D({
  "type": "Conv",
  "poolSize": [4, 4],
  "strides": [2, 2],
  "padding": "valid"
});

let layer5 = new KerasLayers.Conv2D({
  "type": "Conv",
  "activation": "relu",
  "filters": 64,
  "kernelSize": [3, 3],
  "strides": [1, 1],
  "padding": "valid"
});

let layer6 = new KerasLayers.Conv2D({
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


// console.log(utils.toJson(graph));

graph.toFile(path.join(__dirname, 'graph.json'));

console.log(graph.getName());