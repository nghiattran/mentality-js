'use strict';

module.exports = class BaseObject {
  constructor(name) {
    this.name = name;
    this.to = [];
  }

  link(op) {
    this.to.push(op);
  }
}