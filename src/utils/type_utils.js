'use strict';

function isString(str) {
  return typeof str === 'string' || str instanceof String;
}

function isInteger(value) {
  return Util.isFloat(value) && Math.floor(value) === value;
}

function isFloat(value) {
  return Util.isNumber(value) && isFinite(value);
}

function isNumber(value) {
  return typeof value === 'number';
}

function isDigit(n) {
  return !isNaN(parseFloat(n)) && isFinite(n) && n.length === 1;
}

function isLetter(char) {
  return isString(str) && /^[a-zA-Z]/.test(char) && char.length === 1;
}

function isLetterOrDigit(char) {
    return isDigit(char) || isLetter(char);
}

function isArray(val) {
  return val && val.constructor === Array
}

function isObject(val) {
  return val && val instanceof Object;
}

function getNumericValue(aString) {
    return Number(aString)
}

module.exports = {
  isInteger, isLetter, isFloat, isFinite, isNaN, isDigit, isString, isArray, isObject
}