const fs = require('fs');

const utils = require('../utils/utils');
const typeUtils = require('../utils/type_utils');

module.exports = class FileWriter {
  constructor(args = {}) {
    const {
      filename,
      indentation = {},
    } = args;

    if (!typeUtils.isString(filename)) {
      throw new Error('filename must be a string.');
    }


    const {
      type = 'space',
      width = 2,
    } = indentation;

    this.indentation = {
      width,
      type: type === 'space' ? ' ' : '\t',
    };

    this.filename = filename;
    this.indent = 0;
    this.isNewline = true;
    this.args = args;
  }

  open() {
    this.stream = fs.createWriteStream(this.filename);
  }

  incIndent() {
    this.indent += 1;
  }

  decIndent() {
    this.indent -= 1;
  }

  emitNewline() {
    this.emit('\n');
    this.isNewline = true;
  }

  emitCurrentIndent() {
    const type = this.indentation.type;
    const width = this.indentation.width;
    const indent = type.repeat(width).repeat(this.indent);
    this.emit(indent);
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
      throw new Error(`Unrecognized writer mode. Got: ${mode}`);
    }
  }

  emit(str) {
    if (!this.stream) {
      throw new Error('Stream not opened yet.');
    }

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
