'use strict';

const fs = require('fs');
const path = require('path');

const sprintf = require('sprintf-js').sprintf;
const utils = require('../utils');

module.exports = class FileWriter {
  constructor(filename=path.join('archs', 'architect.py'), args={}) {
    this.stream = fs.createWriteStream(filename);
    this.indent = 0;
    this.isNewline = true;
    this.args = args;
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

  emitLines(lines) {
    for (var i = 0; i < lines.length; i++) {
      this.emitLine(lines[i]);
    }
  }

  emitFunctionCall(lines) {
    const {mode='beautify'} = this.args;

    if (mode === 'beautify') {
      lines = utils.allignArguments(lines);
      for (var i = 0; i < lines.length; i++) {
        this.emitLine(lines[i]);
      }
    } else if (mode === 'compat'){
      function trim(entry) {
        return entry.trim();
      }
      lines = lines.split('\n');
      lines = lines.map(trim);
      this.emitLine(lines.join(' '));
    } else {
      throw Error(`Unrecognized writer mode. Got: ${mode}`);
    }
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