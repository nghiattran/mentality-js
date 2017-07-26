with tf.name_scope('Graph'):
    with tf.name_scope('layer1'):
        layer1_b = tf.get_variable(name='layer1_b', shape=[64])
        layer1_w = tf.get_variable(name='layer1_w', shape=[3, 3, 3, 64])
        layer1_h = tf.nn.conv2d(input=image, filter=layer1_w, strides=[1, 1, 1, 1], padding='SAME')
        layer1_h = tf.nn.bias_add(value=layer1_h, bias=layer1_b)
        layer1_h = tf.nn.relu(features=layer1_h, name='layer1_activation')

    with tf.name_scope('layer2'):
        layer2_b = tf.get_variable(name='layer2_b', shape=[1])
        layer2_w = tf.get_variable(name='layer2_w', shape=[1, 2, 2, 1])
        layer2_h = tf.nn.conv2d(input=layer1_h, filter=layer2_w, strides=[1, 1, 1, 1], padding='SAME')
        layer2_h = tf.nn.bias_add(value=layer2_h, bias=layer2_b)
        layer2_h = tf.nn.relu(features=layer2_h, name='layer2_activation')

    with tf.name_scope('layer3'):
        layer3_b = tf.get_variable(name='layer3_b', shape=[1000])
        layer3_w = tf.get_variable(name='layer3_w', shape=[-1, 1000])
        layer3_h = tf.matmul(layer2_h, layer3_w)
        layer3_h = tf.nn.bias_add(value=layer3_h, bias=layer3_b)
        layer3_h = tf.nn.relu(features=layer3_h, name='layer3_activation')

