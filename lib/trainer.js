'use strict';

class Trainer {
  constructor(network) {
    if (network) {
      this.setNetwork(network);
    }
  }

  setNetwork(network) {
    this.network = network;
  }

  train(trainingSet, setting) {
    if (!this.network)
      throw Error('Network has to be set before trainning.');

    if (!setting)
      setting = {};
    else if (!(setting instanceof Object))
      throw Error('The second argument must be a dictionary.');


    let epoch_limit = setting['epoch'] || 5000;
    let log = setting['log'] || 0;
    let shuffle = setting['shuffle'] || false;
    let rate = setting['rate'] || 0.1;
    let error = setting['error'] || 0.1;
    let momentum = setting['momentum'] || 0.95;
    if  (momentum < 0 || 1 <= momentum)
      throw Error('Momemtum value must be: 0 <= momemtum < 1.');
    let cost = setting['cost'] || Cost.SE;

    let learningRate = -1;
    if (rate && typeof rate === 'number') {
      learningRate = rate;
      rate = false;
    } else if (typeof rate === 'function') {
      learningRate = rate(learningRate);
    } else {
      throw Error('Rate value must be a number of a function.');
    }

    let sum_error = 1
    let epoch = 0
    let last_error;
    while (sum_error > error && epoch < epoch_limit) {
      sum_error = 0
      last_error = error
      for (let i = 0; i < trainingSet.length; i++) {
        let data = trainingSet[i];
        let outputs = this.network.activate(data['input'])
        this.network.propagate(learningRate, data['output'], momentum);
        sum_error += cost(data['output'], outputs);
      }
          

      if (log !== 0 && epoch % log === 0)
        console.log(epoch + 1, sum_error, learningRate);

      if (rate)
        learningRate = rate(learningRate, sum_error, last_error);

      if (shuffle)
        shuffleArray(trainingSet);

      epoch += 1
    }
    return {
      error: sum_error,
      rate: learningRate,
      epoch
    }
  }

  XOR(setting) {
    if (!setting) {
      setting = {
        shuffle: true,
        momentum: 0.99,
        // rate: 0.1,
        error: 0.01
      }
    }

    return this.train([{
      input: [0, 0],
      output: [0]
    }, {
      input: [0, 1],
      output: [1]
    }, {
      input: [1, 0],
      output: [1]
    },{
      input: [1, 1],
      output: [0]
    }], setting)
  }

  AND(setting) {
    if (!setting) {
      setting = {
        shuffle: true,
        momentum: 0,
        rate: 0.1,
        error: 0.01
      }
    }

    return this.train([{
      input: [0, 0],
      output: [0]
    }, {
      input: [0, 1],
      output: [0]
    }, {
      input: [1, 0],
      output: [0]
    }, {
      input: [1, 1],
      output: [1]
    }], setting)
  }
}

class Cost {
  static SE(targets, outputs) {
    let cost = 0
    for (let i = 0; i < targets.length; i++) {
      cost += Math.pow(targets[i] - outputs[i], 2);
    }
    return cost;
  }
}

function shuffleArray(a) {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
  return a;
}

module.exports = {
  Trainer, Cost
}