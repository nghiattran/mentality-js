/**
 * This module contains functions used to check variable type.
 * @module typeUtils
 * @memberof mentality
 */

module.exports = {
  /**
   * Check if a value is a string.
   * @param  {Any}      value Value to be checked.
   * @return {Boolean}        Returns true if a value is a string, false otherwise.
   */
  isString(value) {
    return typeof value === 'string' || value instanceof String;
  },

  /**
   * Check if a value is a number.
   * @param  {Any}      value Value to be checked.
   * @return {Boolean}        Returns true if a value is a number, false otherwise.
   */
  isNumber(value) {
    return typeof value === 'number';
  },

  /**
   * Check if a value is a float.
   * @param  {Any}      value Value to be checked.
   * @return {Boolean}        Returns true if a value is a float, false otherwise.
   */
  isFloat(value) {
    return this.isNumber(value) && isFinite(value);
  },

  /**
   * Check if a value is an integer.
   * @param  {Any}      value Value to be checked.
   * @return {Boolean}        Returns true if a value is an integer, false otherwise.
   */
  isInteger(value) {
    return this.isFloat(value) && Math.floor(value) === value;
  },

  /**
   * Check if a value is a digit.
   * @param  {Any}      value Value to be checked.
   * @return {Boolean}        Returns true if a value is a digit, false otherwise.
   */
  isDigit(value) {
    return !isNaN(parseFloat(value)) &&
            this.isFinite(value) &&
            value.length === 1;
  },

  /**
   * Check if a value is a letter.
   * @param  {Any}      value Value to be checked.
   * @return {Boolean}        Returns true if a value is a letter, false otherwise.
   */
  isLetter(value) {
    return this.isString(value) &&
           /^[a-zA-Z]/.test(value) &&
           value.length === 1;
  },

  /**
   * Check if a value is a letter or a digit.
   * @param  {Any}      value Value to be checked.
   * @return {Boolean}        Returns true if a value is a letter or a digit, false otherwise.
   */
  isLetterOrDigit(value) {
    return this.isDigit(value) || this.isLetter(value);
  },

  /**
   * Check if a value is an array.
   * @param  {Any}      value Value to be checked.
   * @return {Boolean}        Returns true if a value is an array, false otherwise.
   */
  isArray(value) {
    return Array.isArray(value);
  },

  /**
   * Check if a value is an object.
   * @param  {Any}      value Value to be checked.
   * @return {Boolean}        Returns true if a value is an object, false otherwise.
   */
  isObject(value) {
    return value && value instanceof Object;
  },
};
