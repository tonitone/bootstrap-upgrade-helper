'use strict';

/**
 *
 * @param {string} str
 * @returns {XML|string|void|*}
 */
module.exports = function (str) {
  if (typeof str === 'string') {
    return str.replace(".", " ");
  }
};