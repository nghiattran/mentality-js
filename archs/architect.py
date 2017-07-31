with tf.name_scope('Graph'):
    with tf.name_scope(layer1):
        layer1_w = tf.get_variable(layer1_w, shape=[3, 3, 3, 64])
        layer1_b = tf.get_variable(layer1_b, shape=[64])

    with tf.name_scope(layer2):
        layer2_w = tf.get_variable(layer2_w, shape=[1, 2, 2, 1])
        layer2_b = tf.get_variable(layer2_b, shape=[1])


