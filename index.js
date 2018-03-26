'use strict';

const fs = require('fs');
const enfslist = require("enfslist");
const path = require('path');
const minimatch = require('minimatch');
const recursive = require("recursive-readdir");
const args = process.argv.slice(2);
const runningMode = args[0] || 'searchHtml';
const filesToReplace = args[1] || './fixtures-small.html';
const config = require(__dirname + '/my-config.json');

/**
 *
 * @param {string} upgradeRulesFileContent
 * @returns {Array}
 */
const returnPreparedUpgradeRulesFromCsvFile = function (upgradeRulesFileContent) {
    let isLineStartWithAHash,
      upgradeRulesAsLines = upgradeRulesFileContent.split("\n"), oneLine, rulesArray = [];

    /**
     *
     * @param {string} oneLine
     * @returns {boolean}
     */
    isLineStartWithAHash = function (oneLine) {
      return oneLine.charAt(0) === '#';
    };

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
        if (isLineStartWithAHash(oneLine)) {
          if (runningMode === 'replaceHtml') {
            continue;
          } else {
            oneLine = oneLine.substr(1);
          }
        }
        let csvColumns = oneLine.split(','),
          searchString = returnCleanCsvString(csvColumns[0], (runningMode === 'searchJs') ? false : true),
          replaceString = returnTransformedCSSSelectorToHtmlAttribute(
            returnCleanCsvString(csvColumns[1])
          );
        rulesArray.push({
          'search': searchString,
          'replace': replaceString
        })
      }
    }
    return rulesArray;
  },
  returnTransformedCSSSelectorToHtmlAttribute = function (str) {
    return str.replace(".", " ");
  };

  /**
   *
   * @param {object} files
   * @param {string} extension
   * @returns {Array}
   */
  var returnFilesBasedOnExtension = function (files, extension) {
    let ret = [], i, newElementIndex = 0;
    for (i = 0; i < files.length; i++) {
      if (!files[i].stat.isDirectory()) {
        let fileNameWithoutPath = path.basename(files[i].path);
        if (minimatch(fileNameWithoutPath, extension)) {
          //console.log(fileNameWithoutPath)
          //console.log(files[i], extension, newElementIndex)
          ret[newElementIndex++] = files[i].path;
        }
      }
    }
    return ret;
  },
  regExForHtmlClassAttribute = /(\s+class=['"]{1})(.[^'"]*)(['"]{1}>)/g,
  Counter = (function () {
    /**
     *
     * @type {{aType: number, anotherType: number, :) ... }}
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
  })(),

  /**
   *
   * @param {string} searchString
   * @param {bool} hasToRemoveFirstDot true
   * @returns {string|*}
   */
  returnCleanCsvString = function (searchString, hasToRemoveFirstDot = true) {
    searchString = searchString.trim();
    if (hasToRemoveFirstDot && isACSSClassSelector(searchString)) {
      searchString = searchString.substr(1);
    }
    return searchString;
  },
  isACSSClassSelector = function (str) {
    return str.charAt(0) === '.';
  },
  runJsAndCssActions = function () {
    for (let actualRule of config[runningMode].searchReplaceRules.rules) {
      let splittedCssClasses = returnCleanCsvString(actualRule.search).split('.');
      for (let iSplittedCssClasses = 0; iSplittedCssClasses < splittedCssClasses.length; iSplittedCssClasses++) {
        let actualSplittedRule, regExpObject;
        if (runningMode === 'searchJs') {
          actualSplittedRule = '\\.' + splittedCssClasses[iSplittedCssClasses];
          regExpObject = new RegExp('([\'"]{1})' + actualSplittedRule + '([\'"]{1})', 'g');
        }
        if (runningMode === 'searchCss') {
          actualSplittedRule = '\\.' + splittedCssClasses[iSplittedCssClasses] + ' ';
          regExpObject = new RegExp(actualSplittedRule, 'g');
        }
        //console.log(regExpObject);
        while (result = regExpObject.exec(fileToReplaceFileContent)) {

          if (foundFiles.indexOf(actualFile) === -1) {
            foundFiles.push(actualFile);
            console.log('---\nfile: ' + actualFile + '\n');
          }

          Counter.count(runningMode);
          Counter.count(runningMode + suffixForGlobalCounter);

          console.log('found selector', actualSplittedRule.substr(1));
        }
      }
    }
    return {splittedCssClasses, iSplittedCssClasses, actualSplittedRule, regExpObject};
  },
  runHtmlActions = function () {
    while (result = regExForHtmlClassAttribute.exec(fileToReplaceFileContent)) {
      let htmlClassAttributesString = result[2],
        htmlClassAttributes = htmlClassAttributesString.split(' ');

      // Todo: refactor to for(i=0;i<....length){}
      for (let actualRule of config[runningMode].searchReplaceRules.rules) {
        let replaceString = actualRule.replace,
          itemIndexToReplace;

        //if(searchString.indexOf('label') !== -1)
        //console.log(searchString, replaceString)
        //console.log(actualRule);
        itemIndexToReplace = htmlClassAttributes.indexOf(actualRule.search);

        if (itemIndexToReplace !== -1) {
          if (foundFiles.indexOf(actualFile) === -1) {
            foundFiles.push(actualFile);
            console.log('---\nfile: ' + actualFile + '\n');
          }
          switch (runningMode) {
            case 'searchHtml':

              Counter.count(runningMode);
              Counter.count(runningMode + suffixForGlobalCounter);

              console.log('found selector: ' + actualRule.search);
              break;
            case 'replaceHtml':

              Counter.count(runningMode);
              Counter.count(runningMode + suffixForGlobalCounter);

              replaceString = returnTransformedCSSSelectorToHtmlAttribute(replaceString);
              htmlClassAttributes[itemIndexToReplace] = replaceString;
              //console.log('replaced in ' + filesToReplace + ' found-selector: ' + actualRule.searchHtml + ' replaced-to: ' + actualRule.replace);
              break;
          }

          if (runningMode === 'searchHtml') {
          }
          //  console.log(htmlClassAttributes);
        }
      }

      if (runningMode === 'replaceHtml') {
        let htmlClassAttributesNew = htmlClassAttributes.join(' ');
        if (htmlClassAttributesString !== htmlClassAttributesNew) {
          fileToReplaceFileContent = fileToReplaceFileContent.replace(htmlClassAttributesString, htmlClassAttributesNew);
          console.log('replace in ' + filesToReplace + ': ' + htmlClassAttributesString + ' > ' + htmlClassAttributesNew);
        }
      }

    }
    return {htmlClassAttributesString, htmlClassAttributes, replaceString, htmlClassAttributesNew};
  },
  foundFiles = [],
  isLineNotEmpty,
  suffixForGlobalCounter = 'All';


Counter.registerCounter(runningMode);
Counter.registerCounter(runningMode + suffixForGlobalCounter);
Counter.registerCounter('files');

try {
  config[runningMode].files.filteredFiles = fs.readFileSync(config[runningMode].searchReplaceRules.file, "utf8");
} catch (err) {
  console.log('error in upgradeRulesFileContent :', err);
  process.exit(1);
}
config[runningMode].searchReplaceRules.rules = returnPreparedUpgradeRulesFromCsvFile(config[runningMode].files.filteredFiles);
//console.log(config[runningMode].searchReplaceRules.rules);
config[runningMode].files.filteredFiles = returnFilesBasedOnExtension(
  enfslist.listSync(config[runningMode].files.folder),
  config[runningMode].files.filesMatcher
);


for (let i = 0; i < config[runningMode].files.filteredFiles.length; i++) {
  var actualFile = config[runningMode].files.filteredFiles[i],
    fileToReplaceFileContent = fs.readFileSync(actualFile, 'utf8'),
    result;

  Counter.resetCounter(runningMode);

  //console.log(fileToReplaceFileContent);
  if (runningMode === 'searchJs' || runningMode === 'searchCss' || runningMode === 'replaceJs') {
    var {splittedCssClasses, iSplittedCssClasses, actualSplittedRule, regExpObject} = runJsAndCssActions();
  }

  if (runningMode === 'searchHtml' || runningMode === 'replaceHtml') {
    var {htmlClassAttributesString, htmlClassAttributes, replaceString, htmlClassAttributesNew} = runHtmlActions();
  }
  if (runningMode === 'replaceHtml') {
    fs.writeFileSync(actualFile, fileToReplaceFileContent);
  }
  if (Counter.returnCounter(runningMode) > 0) {
    console.log('---\nfound: ' + Counter.returnCounter(runningMode) + ' replaceable attributes!\n\n');
  }
}
console.log('---------------------\nfound: ' + Counter.returnCounter(runningMode + suffixForGlobalCounter) + ' replaceable attributes! ' +
  'in ' + foundFiles.length + ' files ');


//console.log(config.searchHtml.files.filteredFiles);

//console.log(config.searchHtml.searchReplaceRules.rules)
process.exit(0);
