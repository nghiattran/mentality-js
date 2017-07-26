'use strict';

const FunctionCall = require('../function_call');
const utils = require('../../../utils');


module.exports = class Relu extends FunctionCall {
  constructor(input, name=utils.getName('relu')) {
    let parameters = {
      features: input,
      name
    };

    super('tf.nn.relu', parameters);
  }
}