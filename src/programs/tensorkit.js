const FileWriter = require('../writers/filewriter');

/**
 * Graph used to generate TensorKit archtecture file.
 * @memberof mentality.programs
 */
class TensorKitProgram {
  constructor(args) {
    const {
      writerOpts = {},
      writer = new FileWriter(writerOpts),
    } = args;

    this.writer = writer;
  }

  setGraph(graph) {
    this.graph = graph;
  }

  compile(mopts = {}) {
    const opts = mopts;
    opts.writer = this.writer;
    this.writer.open();

    const imports = [
      'from __future__ import absolute_import',
      'from __future__ import division',
      'from __future__ import print_function',
      '',
      'import tensorflow as tf',
      'import keras',
      'from tensorkit.base import ArchitectBase',
      '',
      '',
    ];

    this.writer.emitLines(imports);
    this.writer.emitLine('class Architect(ArchitectBase):');
    this.writer.incIndent();
    this.writer.emitLine('def build_graph(self, hypes, input, phrase):');
    this.writer.incIndent();
    this.graph.compile(opts);

    const graphChildren = this.graph.children;

    function pyReturn(child) {
      return `'${child.getName()}': ${child.getName()}`;
    }

    this.writer.emitLine(`return {${graphChildren.map(pyReturn).join(',')}}`);
  }
}

module.exports = TensorKitProgram;
