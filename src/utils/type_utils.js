function isString(str) {
  return typeof str === 'string' || str instanceof String;
}

function isNumber(value) {
  return typeof value === 'number';
}

function isFloat(value) {
  return isNumber(value) && isFinite(value);
}

function isInteger(value) {
  return isFloat(value) && Math.floor(value) === value;
}

function isDigit(n) {
  return !isNaN(parseFloat(n)) && isFinite(n) && n.length === 1;
}

function isLetter(char) {
  return isString(char) && /^[a-zA-Z]/.test(char) && char.length === 1;
}

function isLetterOrDigit(char) {
  return isDigit(char) || isLetter(char);
}

function isArray(val) {
  return val && val.constructor === Array;
}

function isObject(val) {
  return val && val instanceof Object;
}

module.exports = {
  isNumber,
  isInteger,
  isDigit,
  isLetter,
  isLetterOrDigit,
  isFloat,
  isFinite,
  isNaN,
  isString,
  isArray,
  isObject,
};
