'use strict';

const Op = require('../../op');

let cnt = 0;

module.exports = class NameScopeOp extends Op {
  constructor(name, ops) {
    super(name + (cnt > 0 ? cnt : ''));
    this.ops = ops;
  }
}