"use strict";

/**
 * @param {string} searchString
 * @param {boolean} hasToRemoveFirstDot true
 * @returns {*}
 */
let returnCleanCsvString = function (searchString, hasToRemoveFirstDot = true) {
  if(typeof searchString !== 'string' || searchString === '') {
    return false;
  }

  let isACSSClassSelector = function (str) {
    return str.charAt(0) === '.';
  };

  searchString = searchString.replace(/\s{1,*}/g, ' ').trim();
  if (hasToRemoveFirstDot && isACSSClassSelector(searchString)) {
    searchString = searchString.substr(1);
  }
  return searchString;
};

module.exports = returnCleanCsvString;