const utils = require('./utils/utils');

const names = new Set();

/**
 * Sequential graph is a linear stack of layers.
 * @memberof mentality
 */
class Node {
  /**
   * Constructor.
   * @param  {string} [name=utils.getName(this.getType())] Name of the Node.
   * @throws {Error} If Node's name has been used.
   */
  constructor(name = utils.getName(this.getType())) {
    if (names.has(name)) throw new Error(`This name has bean used: ${name}`);

    names.add(name);

    /**
     * Link to other nodes.
     * @type {Node[]}
     */
    this.to = [];

    /**
     * Get name of the Node.
     * @return {string} Node's name.
     */
    this.getName = () => name;
  }

  build() {
    throw new Error('Not implemented');
  }

  link(node) {
    if (!(node instanceof Node)) throw new Error('Argument must be an instance of Node.');

    this.to.push(node);
  }

  /**
   * Export node as JSON.
   * @param  {Object} [opts={}] Options.
   * @return {Object}           Node's properties.
   */
  toJson(opts = {}) {
    return {
      name: this.getName(),
      type: this.getType(),
    };
  }

  /**
   * Get type of Node.
   * @return {string} Node's type.
   */
  getType() {
    return this.constructor.name;
  }
}

module.exports = Node;
