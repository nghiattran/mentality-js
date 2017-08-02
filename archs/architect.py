from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import tensorflow as tf
import keras
from tensorkit.base import ArchitectBase


class Architect(ArchitectBase):
    def build_graph(self, hypes, input, phrase):
        with tf.name_scope('Network'):
            Reshape_h = tf.reshape(tensor=input, shape=[, , , ])

            Input_h = keras.layers.Input(tensor=Reshape_h)

            Conv2D_h = keras.layers.Conv2D(filters=24,
                                           kernel_size=[, ],
                                           strides=[, ],
                                           padding='valid',
                                           data_format='channels_last',
                                           dilation_rate=[, ],
                                           activation='relu',
                                           use_bias=True,
                                           kernel_initializer='glorot_uniform',
                                           bias_initializer='zeros',
                                           kernel_regularizer=None,
                                           bias_regularizer=None,
                                           activity_regularizer=None,
                                           kernel_constraint=None,
                                           bias_constraint=None)(Input_h)

            Conv2D_1_h = keras.layers.Conv2D(filters=36,
                                             kernel_size=[, ],
                                             strides=[, ],
                                             padding='valid',
                                             data_format='channels_last',
                                             dilation_rate=[, ],
                                             activation='relu',
                                             use_bias=True,
                                             kernel_initializer='glorot_uniform',
                                             bias_initializer='zeros',
                                             kernel_regularizer=None,
                                             bias_regularizer=None,
                                             activity_regularizer=None,
                                             kernel_constraint=None,
                                             bias_constraint=None)(Conv2D_h)

            MaxPool2D_h = keras.layers.pooling.MaxPool2D(pool_size=[, ],
                                                         strides=[, ],
                                                         padding='valid',
                                                         data_format='channels_last')(Conv2D_1_h)

            Conv2D_2_h = keras.layers.Conv2D(filters=64,
                                             kernel_size=[, ],
                                             strides=[, ],
                                             padding='valid',
                                             data_format='channels_last',
                                             dilation_rate=[, ],
                                             activation='relu',
                                             use_bias=True,
                                             kernel_initializer='glorot_uniform',
                                             bias_initializer='zeros',
                                             kernel_regularizer=None,
                                             bias_regularizer=None,
                                             activity_regularizer=None,
                                             kernel_constraint=None,
                                             bias_constraint=None)(MaxPool2D_h)

            Conv2D_3_h = keras.layers.Conv2D(filters=64,
                                             kernel_size=[, ],
                                             strides=[, ],
                                             padding='valid',
                                             data_format='channels_last',
                                             dilation_rate=[, ],
                                             activation='relu',
                                             use_bias=True,
                                             kernel_initializer='glorot_uniform',
                                             bias_initializer='zeros',
                                             kernel_regularizer=None,
                                             bias_regularizer=None,
                                             activity_regularizer=None,
                                             kernel_constraint=None,
                                             bias_constraint=None)(Conv2D_2_h)

            Flatten_h = keras.layers.core.Flatten()(Conv2D_3_h)

            Dense_h = keras.layers.core.Dense(units=1164,
                                              activation='relu',
                                              use_bias=True,
                                              kernel_initializer='glorot_uniform',
                                              bias_initializer='zeros',
                                              kernel_regularizer=None,
                                              bias_regularizer=None,
                                              activity_regularizer=None,
                                              kernel_constraint=None,
                                              bias_constraint=None)(Flatten_h)

            Dense_1_h = keras.layers.core.Dense(units=100,
                                                activation='relu',
                                                use_bias=True,
                                                kernel_initializer='glorot_uniform',
                                                bias_initializer='zeros',
                                                kernel_regularizer=None,
                                                bias_regularizer=None,
                                                activity_regularizer=None,
                                                kernel_constraint=None,
                                                bias_constraint=None)(Dense_h)

            Dense_2_h = keras.layers.core.Dense(units=10,
                                                activation='relu',
                                                use_bias=True,
                                                kernel_initializer='glorot_uniform',
                                                bias_initializer='zeros',
                                                kernel_regularizer=None,
                                                bias_regularizer=None,
                                                activity_regularizer=None,
                                                kernel_constraint=None,
                                                bias_constraint=None)(Dense_1_h)

            output_h = keras.layers.core.Dense(units=1,
                                               activation='tanh',
                                               use_bias=True,
                                               kernel_initializer='glorot_uniform',
                                               bias_initializer='zeros',
                                               kernel_regularizer=None,
                                               bias_regularizer=None,
                                               activity_regularizer=None,
                                               kernel_constraint=None,
                                               bias_constraint=None)(Dense_2_h)

        return {'Reshape_h': Reshape_h,'Input_h': Input_h,'Conv2D_h': Conv2D_h,'Conv2D_1_h': Conv2D_1_h,'MaxPool2D_h': MaxPool2D_h,'Conv2D_2_h': Conv2D_2_h,'Conv2D_3_h': Conv2D_3_h,'Flatten_h': Flatten_h,'Dense_h': Dense_h,'Dense_1_h': Dense_1_h,'Dense_2_h': Dense_2_h,'output_h': output_h}
