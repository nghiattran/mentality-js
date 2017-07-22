'use strict';

const Layer = require('../../layer');
const NameScopeOp = require('../ops/namescope');

let cnt = 0;

module.exports = class Conv extends Layer {
  constructor(info) {
    super(info.name);
    this.ops = new NameScopeOp(info.namescope, []);
  }
}