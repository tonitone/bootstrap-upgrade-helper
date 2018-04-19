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
  let ret = [], i;
  for (i = 0; i < files.length; i++) {

    if (!files[i].stat.isDirectory()) {
      let fileNameWithPath = files[i].path,
        fileNameWithoutPath = path.basename(fileNameWithPath);

      if (microMatch.any(fileNameWithoutPath, exclude).length > 0) {
        continue;
      }

      if (microMatch.any(fileNameWithoutPath, extension)) {
        ret.push(fileNameWithPath);
      }
    }
  }
  return ret;
};

module.exports = returnFilesBasedOnExtension;