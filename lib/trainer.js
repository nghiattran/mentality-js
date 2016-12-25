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
      throw Error('The second argument must be a dictionary');


    let epoch_limit = setting['epoch'] || 5000;
    let log = setting['log'] || 0;
    let shuffle = setting['shuffle'] || false;
    let rate = setting['rate'] || false;
    let error = setting['error'] || 0.1;
    let momentum = setting['momentum'] || 0.95;
    if  (momentum < 0 || 1 <= momentum)
        throw Error('Momemtum value has to be: 0 <= momemtum < 1');
    let cost = setting['cost'] || Cost.SE;

    let leaningRate = 0.1;

    let sum_error = 1
    let epoch = 1
    let last_error;
    while (sum_error > error && epoch < epoch_limit) {
      sum_error = 0
      last_error = error
      for (let i = 0; i < trainingSet.length; i++) {
        let data = trainingSet[i];
        let outputs = this.network.activate(data['input'])
        this.network.propagate(leaningRate, data['output'], momentum);
        sum_error += cost(data['output'], outputs);
      }
          

      if (log !== 0 && epoch % log === 0)
        console.log(epoch, sum_error, leaningRate);

      if (rate)
        leaningRate = rate(leaningRate, sum_error, last_error)

      // if (shuffle)
      //     random.shuffle(trainingSet)

      epoch += 1
    }
    return sum_error, epoch
  }

  XOR(setting) {
    if (!setting) {
      setting = {
        shuffle: true,
        momentum: 0.99,
        rate: 0.1,
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

module.exports = {
  Trainer, Cost
}