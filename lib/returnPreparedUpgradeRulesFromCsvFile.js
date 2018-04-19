"use strict";

const returnCleanCsvString = require(__dirname + '/returnCleanCsvString');
const returnCssSelectorToHtmlAttribute = require(__dirname + '/returnCssSelectorToHtmlAttribute');

/**
 *
 * @param {string} upgradeRulesFileContent
 * @param {string} runningMode
 * @returns {Array}
 */
let returnPreparedUpgradeRulesFromCsvFile = function (upgradeRulesFileContent, runningMode) {

  let upgradeRulesAsLines = upgradeRulesFileContent.split("\n"),
    rulesArray = [],

    /**
     *
     * @param {string} oneLine
     * @returns {boolean}
     */
    isLineNotStartWithAHash = function (oneLine) {
      return oneLine.charAt(0) === '#';
    },

    /**
     *
     * @param {string} oneLine
     * @returns {boolean}
     */
    isLineNotEmpty = function (oneLine) {
      return oneLine !== '';
    };

  for (let oneLine of upgradeRulesAsLines) {
    if (isLineNotEmpty(oneLine)) {
      if (!isLineNotStartWithAHash(oneLine)) {
        oneLine = oneLine.substr(1);

        let csvColumns = oneLine.split(','),
          searchString = returnCleanCsvString(
            csvColumns[0],
            (runningMode === 'searchJs')
              ? false
              : true
          ),
          replaceString = (typeof csvColumns[1] !== 'undefined') ? returnCssSelectorToHtmlAttribute(
            returnCleanCsvString(csvColumns[1])
          ) : '';

        rulesArray.push({
          'search': searchString,
          'replace': replaceString
        });

      }
    }
  }
  return rulesArray;
};

module.exports = returnPreparedUpgradeRulesFromCsvFile;