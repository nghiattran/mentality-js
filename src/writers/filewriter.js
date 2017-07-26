'use strict';

const fs = require('fs');
const util = require('util');
const path = require('path');

const sprintf = require('sprintf-js').sprintf;

module.exports = class FileWriter {
  constructor(filename=path.join('archs', 'architect.py')) {
    this.stream = fs.createWriteStream(filename);
    this.indent = 0;
    this.isNewline = true;
  }

  incIndent() {
    this.indent += 1;
  }

  decIndent() {
    this.indent -= 1;
  }

  emitNewline() {
    this.stream.write('\n');
    this.isNewline = true;
  }

  emitCurrentIndent() {
    this.stream.write(sprintf(`%${this.indent * 4}s`, ''));
  }

  emitLine(line) {
    this.emit(line);
    this.emitNewline();
  }

  emit(str) {
    if (this.isNewline) {
      this.isNewline = false;
      this.emitCurrentIndent();
    }
    this.stream.write(str);
  }

  close() {
    this.stream.end();
  }
}