'use strict';

const assert = require('assert');
const path = require('path');
const mentalityJs = require('../../');
console.log(mentalityJs);
const Node = mentalityJs.Node;
const KerasSequenceGraph = mentalityJs.keras.graphs.SequentialGraph;
const utils = mentalityJs.utils;
const KerasLayers = mentalityJs.keras.layers;
const TensorKit = mentalityJs.programs.TensorKit;

let image = new mentalityJs.Variable(utils.getName('input'), [-1, 224, 224, 3]);

let layer0 = new KerasLayers.Reshape({
  targetShape: [224, 224, 3]
}, image);

let layer1 = new KerasLayers.Input({})

let layer2 = new KerasLayers.Conv2D({
  name: 'conv1_1',
  activation: 'relu',
  filters: 64,
  kernelSize: [3, 3],
  padding: 'same'
});

let layer3 = new KerasLayers.Conv2D({
  name: 'conv1_2',
  activation: 'relu',
  filters: 64,
  kernelSize: [3, 3],
  padding: 'same'
});

let layer4 = new KerasLayers.MaxPool2D({
  name: 'pool1',
  poolSize: [2, 2],
  padding: 'same'
});

let layer5 = new KerasLayers.Conv2D({
  name: 'conv2_1',
  activation: 'relu',
  filters: 128,
  kernelSize: [3, 3],
  padding: 'same'
});

let layer6 = new KerasLayers.Conv2D({
  name: 'conv2_2',
  activation: 'relu',
  filters: 128,
  kernelSize: [3, 3],
  padding: 'same'
});

let layer7 = new KerasLayers.MaxPool2D({
  name: 'pool2',
  poolSize: [2, 2],
  strides: [2, 2],
  padding: 'same'
});


let layer8 = new KerasLayers.Conv2D({
  name: 'conv3_1',
  activation: 'relu',
  filters: 256,
  kernelSize: [3, 3],
  padding: 'same'
});

let layer9 = new KerasLayers.Conv2D({
  name: 'conv3_2',
  activation: 'relu',
  filters: 256,
  kernelSize: [3, 3],
  strides: [1, 1],
  padding: 'same'
});

let layer10 = new KerasLayers.Conv2D({
  name: 'conv3_3',
  activation: 'relu',
  filters: 256,
  kernelSize: [3, 3],
  strides: [1, 1],
  padding: 'same'
});

let layer11 = new KerasLayers.MaxPool2D({
  name: 'pool3',
  poolSize: [2, 2],
  strides: [2, 2],
  padding: 'same'
});

let layer12 = new KerasLayers.Conv2D({
  name: 'conv4_1',
  activation: 'relu',
  filters: 512,
  kernelSize: [3, 3],
  strides: [1, 1],
  padding: 'same'
});

let layer13 = new KerasLayers.Conv2D({
  name: 'conv4_2',
  activation: 'relu',
  filters: 512,
  kernelSize: [3, 3],
  strides: [1, 1],
  padding: 'same'
});

let layer14 = new KerasLayers.Conv2D({
  name: 'conv4_3',
  activation: 'relu',
  filters: 512,
  kernelSize: [3, 3],
  strides: [1, 1],
  padding: 'same'
});

let layer15 = new KerasLayers.MaxPool2D({
  name: 'pool4',
  poolSize: [2, 2],
  strides: [2, 2],
  padding: 'same'
});

let layer16 = new KerasLayers.Conv2D({
  name: 'conv5_1',
  activation: 'relu',
  filters: 512,
  kernelSize: [3, 3],
  strides: [1, 1],
  padding: 'same'
});

let layer17 = new KerasLayers.Conv2D({
  name: 'conv5_2',
  activation: 'relu',
  filters: 512,
  kernelSize: [3, 3],
  strides: [1, 1],
  padding: 'same'
});

let layer18 = new KerasLayers.Conv2D({
  name: 'conv5_3',
  activation: 'relu',
  filters: 512,
  kernelSize: [3, 3],
  strides: [1, 1],
  padding: 'same'
});

let layer19 = new KerasLayers.MaxPool2D({
  name: 'pool5',
  poolSize: [2, 2],
  strides: [2, 2],
  padding: 'same'
});

let layer20 = new KerasLayers.Flatten();

let layer21 = new KerasLayers.Dense({
  name: 'fc1',
  activation: 'relu',
  units: 4056
});

let layer22 = new KerasLayers.Dense({
  name: 'fc2',
  activation: 'relu',
  units: 4056
});

let layer23 = new KerasLayers.Dense({
  name: 'predictions',
  activation: 'softmax',
  units: 21
});

let compile = [];

let layers = [layer0, layer1, layer2, layer3, layer4, layer5, layer6, layer7, layer8, layer9, layer10, layer11, layer12, layer13, layer14, layer15, layer16, layer17, layer18, layer19, layer20, layer21, layer22, layer23];

let graph = new KerasSequenceGraph({
  nodes: layers,
  nameScope: 'Network',
});

layers.map((e) => {
  console.log(e.getName(), e.computeOutputShape()); 
})

const writer = new mentalityJs.writers.FileWriter({
  filename: path.join(__dirname, 'vgg16.py')
});

const program = new TensorKit({
  writer
});

program.setGraph(graph);
program.compile({
  verbose: false
});
graph.toFile(path.join(__dirname, 'vgg16.json'), {
  verbose: false
})

// console.log(layer0);