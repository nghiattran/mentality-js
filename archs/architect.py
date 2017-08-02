from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import tensorflow as tf
import keras
from tensorkit.base import ArchitectBase


class Architect(ArchitectBase):
    def build_graph(self, hypes, input, phrase):
        with tf.name_scope('Network'):
            reshape_h = tf.reshape(tensor=input, shape=[-1, 66, 200, 3])

            input_1_h = keras.layers.Input(tensor=reshape_h)

            conv_h = keras.layers.Conv2D(filters=24,
                                         kernel_size=[5, 5],
                                         strides=[2, 2],
                                         padding='valid',
                                         data_format='channels_last',
                                         dilation_rate=[1, 1],
                                         activation='relu',
                                         use_bias=True,
                                         kernel_initializer='glorot_uniform',
                                         bias_initializer='zeros',
                                         kernel_regularizer=None,
                                         bias_regularizer=None,
                                         activity_regularizer=None,
                                         kernel_constraint=None,
                                         bias_constraint=None)(input_1_h)

            conv_1_h = keras.layers.Conv2D(filters=36,
                                           kernel_size=[5, 5],
                                           strides=[2, 2],
                                           padding='valid',
                                           data_format='channels_last',
                                           dilation_rate=[1, 1],
                                           activation='relu',
                                           use_bias=True,
                                           kernel_initializer='glorot_uniform',
                                           bias_initializer='zeros',
                                           kernel_regularizer=None,
                                           bias_regularizer=None,
                                           activity_regularizer=None,
                                           kernel_constraint=None,
                                           bias_constraint=None)(conv_h)

            conv_2_h = keras.layers.Conv2D(filters=48,
                                           kernel_size=[5, 5],
                                           strides=[2, 2],
                                           padding='valid',
                                           data_format='channels_last',
                                           dilation_rate=[1, 1],
                                           activation='relu',
                                           use_bias=True,
                                           kernel_initializer='glorot_uniform',
                                           bias_initializer='zeros',
                                           kernel_regularizer=None,
                                           bias_regularizer=None,
                                           activity_regularizer=None,
                                           kernel_constraint=None,
                                           bias_constraint=None)(conv_1_h)

            conv_3_h = keras.layers.Conv2D(filters=64,
                                           kernel_size=[3, 3],
                                           strides=[1, 1],
                                           padding='valid',
                                           data_format='channels_last',
                                           dilation_rate=[1, 1],
                                           activation='relu',
                                           use_bias=True,
                                           kernel_initializer='glorot_uniform',
                                           bias_initializer='zeros',
                                           kernel_regularizer=None,
                                           bias_regularizer=None,
                                           activity_regularizer=None,
                                           kernel_constraint=None,
                                           bias_constraint=None)(conv_2_h)

            conv_4_h = keras.layers.Conv2D(filters=64,
                                           kernel_size=[3, 3],
                                           strides=[1, 1],
                                           padding='valid',
                                           data_format='channels_last',
                                           dilation_rate=[1, 1],
                                           activation='relu',
                                           use_bias=True,
                                           kernel_initializer='glorot_uniform',
                                           bias_initializer='zeros',
                                           kernel_regularizer=None,
                                           bias_regularizer=None,
                                           activity_regularizer=None,
                                           kernel_constraint=None,
                                           bias_constraint=None)(conv_3_h)

            flatten_h = keras.layers.core.Flatten()(conv_4_h)

            dense_h = keras.layers.core.Dense(units=1164,
                                              activation='relu',
                                              use_bias=True,
                                              kernel_initializer='glorot_uniform',
                                              bias_initializer='zeros',
                                              kernel_regularizer=None,
                                              bias_regularizer=None,
                                              activity_regularizer=None,
                                              kernel_constraint=None,
                                              bias_constraint=None)(flatten_h)

            dense_1_h = keras.layers.core.Dense(units=100,
                                                activation='relu',
                                                use_bias=True,
                                                kernel_initializer='glorot_uniform',
                                                bias_initializer='zeros',
                                                kernel_regularizer=None,
                                                bias_regularizer=None,
                                                activity_regularizer=None,
                                                kernel_constraint=None,
                                                bias_constraint=None)(dense_h)

            dense_2_h = keras.layers.core.Dense(units=10,
                                                activation='relu',
                                                use_bias=True,
                                                kernel_initializer='glorot_uniform',
                                                bias_initializer='zeros',
                                                kernel_regularizer=None,
                                                bias_regularizer=None,
                                                activity_regularizer=None,
                                                kernel_constraint=None,
                                                bias_constraint=None)(dense_1_h)

            output_h = keras.layers.core.Dense(units=1,
                                               activation='tanh',
                                               use_bias=True,
                                               kernel_initializer='glorot_uniform',
                                               bias_initializer='zeros',
                                               kernel_regularizer=None,
                                               bias_regularizer=None,
                                               activity_regularizer=None,
                                               kernel_constraint=None,
                                               bias_constraint=None)(dense_2_h)

        return {'reshape_h': reshape_h,'input_1_h': input_1_h,'conv_h': conv_h,'conv_1_h': conv_1_h,'conv_2_h': conv_2_h,'conv_3_h': conv_3_h,'conv_4_h': conv_4_h,'flatten_h': flatten_h,'dense_h': dense_h,'dense_1_h': dense_1_h,'dense_2_h': dense_2_h,'output_h': output_h}
