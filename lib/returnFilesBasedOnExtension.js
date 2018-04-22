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
    let fileNameWithPath = files[i].path,
      fileNameWithoutPath = path.basename(fileNameWithPath);

    if(microMatch.isMatch(fileNameWithPath, exclude)) {
      continue;
    }

    if (!files[i].stat.isDirectory()) {
      if (microMatch.any(fileNameWithoutPath, extension)) {
        ret.push(fileNameWithPath);
      }
    }
  }
  return ret;
};

module.exports = returnFilesBasedOnExtension;