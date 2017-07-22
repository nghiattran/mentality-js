'use strict';

const Op = require('./op');

module.exports = class Layer extends Op {
  constructor(info) {
    super(info);
    this.info = info;
    this.to = [];
  }
}