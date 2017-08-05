const Layer = require('./layer');
const Flatten = require('./core/flatten');
const Dense = require('./core/dense');
const Input = require('./core/input');
const Reshape = require('./core/reshape');
const Conv1D = require('./conv/conv1d');
const Conv2D = require('./conv/conv2d');
const Conv3D = require('./conv/conv3d');

const AveragePool2D = require('./conv/average_pool2d');
const MaxPool2D = require('./conv/max_pool2d');

/**
 * @memberof mentality.keras
 * @namespace mentality.keras.layers
 */
module.exports = {
  Layer,
  Flatten,
  Dense,
  Input,
  Reshape,
  Conv1D,
  Conv2D,
  Conv3D,

  AveragePool2D,
  MaxPool2D,
};
