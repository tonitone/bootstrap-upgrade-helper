"use strict";

/**
 *
 * @param {string} searchString
 * @param {boolean} hasToRemoveFirstDot true
 * @returns {string}
 */
let returnCleanCsvString = function (searchString, hasToRemoveFirstDot = true) {
  let isACSSClassSelector = function (str) {
    return str.charAt(0) === '.';
  };
  searchString = searchString.trim();
  if (hasToRemoveFirstDot && isACSSClassSelector(searchString)) {
    searchString = searchString.substr(1);
  }
  return searchString;
};

module.exports = returnCleanCsvString;