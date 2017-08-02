const fs = require('fs');
const path = require('path');

const sprintf = require('sprintf-js').sprintf;
const utils = require('../utils/utils');

module.exports = class FileWriter {
  constructor(filename = path.join('archs', 'architect.py'), args = {}) {
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
    for (let i = 0; i < lines.length; i += 1) {
      this.emitLine(lines[i]);
    }
  }

  emitFunctionCall(lines) {
    function trim(entry) {
      return entry.trim();
    }

    let newLines = lines;
    const {
      mode = 'beautify',
    } = this.args;

    if (mode === 'beautify') {
      newLines = utils.allignArguments(newLines);
      for (let i = 0; i < newLines.length; i += 1) {
        this.emitLine(newLines[i]);
      }
    } else if (mode === 'compat') {
      newLines = newLines.split('\n');
      newLines = newLines.map(trim);
      this.emitLine(newLines.join(' '));
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
};
