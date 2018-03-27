"use strict";

const path = require('path');
const microMatch = require('micromatch');

/**
 *
 * @param {Array} files
 * @param {string|Array} extension
 * @param {string|Array} exclude
 * @returns {Array}
 */
let returnFilesBasedOnExtension = function (files, extension, exclude) {
  let ret = [], i, newElementIndex = 0;
  for (i = 0; i < files.length; i++) {
    let fileNameWithoutPath = path.basename(files[i].path);

    if (microMatch(fileNameWithoutPath, exclude).length > 0) {
      continue;
    }

    if (!files[i].stat.isDirectory()) {
      if (microMatch(fileNameWithoutPath, extension)) {
        ret[newElementIndex++] = files[i].path;
      }
    }
  }
  return ret;
};

module.exports = returnFilesBasedOnExtension;