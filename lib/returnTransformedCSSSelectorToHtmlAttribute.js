'use strict';

/**
 *
 * @param str
 * @returns {string}
 */
let returnTransformedCSSSelectorToHtmlAttribute = function (str) {
  return str.replace(".", " ");
};

module.exports = returnTransformedCSSSelectorToHtmlAttribute;