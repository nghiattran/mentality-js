const Node = require('./node');
const Variable = require('./variable');
const Graph = require('./graph');
const utils = require('./utils/utils');
const keras = require('./keras');
const FileWriter = require('./writers/filewriter');
const programs = require('./programs');


/**
 * @namespace mentality
 */
module.exports = {
  Node,
  Variable,
  Graph,
  utils,
  keras,
  writers: {
    FileWriter,
  },
  programs,
};
