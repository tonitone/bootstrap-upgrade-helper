"use strict";

/**
 * simple counter
 *
 * @type {{registerCounter, count, returnCounter, resetCounter}}
 */
let Counter = (function () {
  /**
   * @example {aType: 0, anotherType: 0, :) ... }
   * @type {object}
   */
  var counter = {};

  /**
   *
   * @param {string} type
   */
  function registerCounter(type = '') {
    if (!counter.hasOwnProperty(type)) {
      counter[type] = 0;
    }
  }

  /**
   *
   * @param {string} type
   */
  function count(type = '') {
    if (counter.hasOwnProperty(type)) {
      counter[type]++;
    }
  }

  /**
   *
   * @param {string} type
   */
  function resetCounter(type = '') {
    if (counter.hasOwnProperty(type)) {
      counter[type] = 0;
    }
  }

  /**
   *
   * @param type
   * @returns {number}
   */
  function returnCounter(type = '') {
    if (counter.hasOwnProperty(type)) {
      return counter[type];
    }
  }

  return {
    registerCounter: registerCounter,
    count: count,
    returnCounter: returnCounter,
    resetCounter: resetCounter
  };
})();

module.exports = Counter;