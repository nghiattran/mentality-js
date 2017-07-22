'use strict';

const BaseObject = require('./baseObject');

module.exports = class Node extends BaseObject {
  constructor(nodeInfo) {
    super(nodeInfo.name);
  }
}