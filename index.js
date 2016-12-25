'use strict';

let Perceptron = require('./lib/network').Perceptron;
let Trainer = require('./lib/trainer').Trainer;
let Cost = require('./lib/trainer').Cost;
let fs = require('fs');

// module.exports = function(){
// };

// let my = new Perceptron(2, [20], 1);
// my.initialize();
// let trainer = new Trainer(my);

// trainer.XOR({
//   log: 1,
//   // epoch: 2
// })

let content = fs.readFileSync('./test/test_network.json').toString();
content = JSON.parse(content);
console.log(content);

let network = Perceptron.fromJson(content);
// console.log(network);
let trainer = new Trainer(network)
let settings = {
    'momentum': 0.99,    
    'log': 1,
    epoch: 2,
    'error': 0.1,
    'cost': Cost.SE
}

trainer.XOR(settings)
console.log(network.toJson());