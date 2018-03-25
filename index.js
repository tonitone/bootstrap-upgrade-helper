'use strict';

const fs = require('fs');
const enfslist = require("enfslist");
const path = require('path');
const minimatch = require('minimatch');
const recursive = require("recursive-readdir");
const args = process.argv.slice(2);
const runningMode = args[0] || 'searchHtml';
const filesToReplace = args[1] || './fixtures-small.html';

/**
 *
 * @param {string} upgradeRulesFileContent
 * @returns {Array}
 */
const returnPreparedUpgradeRulesFromCsvFile = function (upgradeRulesFileContent) {
    let isACSSClassSelector, returnCleanCsvString,
      upgradeRulesAsLines = upgradeRulesFileContent.split("\n"), oneLine, rulesArray = [];

    isACSSClassSelector = function (str) {
      return str.charAt(0) === '.';
    };

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
    };

    /**
     *
     * @param {string} oneLine
     * @returns {boolean}
     */
    isLineNotEmptyAndDontStartWithAHash = function (oneLine) {
      return oneLine !== '' && oneLine.charAt(0) !== '#';
    };

    for (let oneLine of upgradeRulesAsLines) {
      if (isLineNotEmptyAndDontStartWithAHash(oneLine)) {
        let csvColumns = oneLine.split(','),
          searchString = returnCleanCsvString(csvColumns[0]),
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

var config = require(__dirname + '/config.json'),

  /**
   *
   * @param {object} files
   * @param {string} extension
   * @returns {Array}
   */
  returnFilesBasedOnExtension = function (files, extension) {
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
  foundFiles = [],
  isLineNotEmptyAndDontStartWithAHash,
  suffixForGlobalCounter = 'All';


Counter.registerCounter(runningMode);
Counter.registerCounter(runningMode + suffixForGlobalCounter);
Counter.registerCounter('files');

try {
  config.searchHtml.files.filteredFiles = fs.readFileSync(config.searchHtml.searchReplaceRules.file, "utf8");
} catch (err) {
  console.log('error in upgradeRulesFileContent :', err);
  process.exit(1);
}
config.searchHtml.searchReplaceRules.rules = returnPreparedUpgradeRulesFromCsvFile(config.searchHtml.files.filteredFiles);

config.searchHtml.files.filteredFiles = returnFilesBasedOnExtension(
  enfslist.listSync(config.searchHtml.files.folder),
  config.searchHtml.files.filesMatcher
);

for (let i = 0; i < config.searchHtml.files.filteredFiles.length; i++) {
  let actualFile = config.searchHtml.files.filteredFiles[i],
    fileToReplaceFileContent = fs.readFileSync(actualFile, 'utf8'),
    result;

  Counter.resetCounter(runningMode);

  //console.log(fileToReplaceFileContent);
  while (result = regExForHtmlClassAttribute.exec(fileToReplaceFileContent)) {
    let htmlClassAttributesString = result[2],
      htmlClassAttributes = htmlClassAttributesString.split(' ');

    // Todo: refactor to for(i=0;i<....length){}
    for (let actualRule of config.searchHtml.searchReplaceRules.rules) {
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

    /*
     if (runningMode === 'replace') {
     let htmlClassAttributesNew = htmlClassAttributes.join(' ');
     if (htmlClassAttributesString !== htmlClassAttributesNew) {
     fileToReplaceFileContent = fileToReplaceFileContent.replace(htmlClassAttributesString, htmlClassAttributesNew);
     console.log('replace in ' + filesToReplace + ': ' + htmlClassAttributesString + ' > ' + htmlClassAttributesNew);
     }
     }
     */
  }
  /* if (runningMode === 'replace') {
   fs.writeFile(filesToReplace, fileToReplaceFileContent, 'utf8', function (err) {
   if (err) return console.log(err);
   });
   }*/
  if (runningMode === 'searchHtml') {
    if (Counter.returnCounter(runningMode) > 0) {
      console.log('---\nfound: ' + Counter.returnCounter(runningMode) + ' replaceable attributes!\n\n');
    }
  }
}
console.log('---------------------\nfound: ' + Counter.returnCounter(runningMode + suffixForGlobalCounter) + ' replaceable attributes! ' +
  'in ' + foundFiles.length + ' files');


//console.log(config.searchHtml.files.filteredFiles);

//console.log(config.searchHtml.searchReplaceRules.rules)
process.exit(1)

try {
  config.searchHtml.files.filteredFiles = fs.readFileSync(config.searchHtml.searchReplaceRules.file, "utf8");
} catch (err) {
  console.log('error in config.searchHtml.files.filteredFiles :', err);
  process.exit(1);
}

config.searchHtml.searchReplaceRules.rules = returnPreparedUpgradeRulesFromCsvFile(upgradeRulesFileContent);


/*
 switch (runningMode) {

 case 'searchHtml':
 //console.log('searchHtml')
 let filteredFilesList = returnFilesBasedOnExtension(files, filesPath.searchHtml.filesMatcher);
 console.log('filteredFilesList =', filteredFilesList);
 break;
 case 'searchJs':

 break;
 case 'searchCss':
 case 'searchLess':
 case 'searchScss':
 break;
 }

 */
//console.log(config.searchHtml.searchReplaceRules)
//        /\
//        /\
//        /\
//        /\
//        /\
//        /\
//        /\
//        /\
//        /\
//        /\
//        /\
//        /\
//        /\
//        /\
//        /\
//        /\
process.exit(0)
//        \/
//        \/
//        \/
//        \/
//        \/
//        \/
//        \/
//        \/
//        \/
//        \/
//        \/
//        \/
//        \/
//        \/
//        \/
//        \/
/*
 fs.readFile(filesToReplace, 'utf8', function (err, fileToReplaceFileContent) {
 if (err) {
 return console.log(err);
 }

 let result;

 while (result = regExForHtmlClassAttribute.exec(fileToReplaceFileContent)) {
 let htmlClassAttributesString = result[2],
 htmlClassAttributes = htmlClassAttributesString.split(' ');

 if (runningMode === 'replace') {
 let htmlClassAttributesNew = htmlClassAttributes.join(' ');
 if (htmlClassAttributesString !== htmlClassAttributesNew) {
 fileToReplaceFileContent = fileToReplaceFileContent.replace(htmlClassAttributesString, htmlClassAttributesNew);
 console.log('replace in ' + filesToReplace + ': ' + htmlClassAttributesString + ' > ' + htmlClassAttributesNew);
 }
 }
 }
 /!* if (runningMode === 'replace') {
 fs.writeFile(filesToReplace, fileToReplaceFileContent, 'utf8', function (err) {
 if (err) return console.log(err);
 });
 }*!/
 if (runningMode === 'searchHtml') {
 console.log('---\nfound: ' + searchMatches + ' replacable attributes');
 }
 });
 */


let upgradeRulesFileContent = fs.readFileSync(config.searchHtml.searchReplaceRules.file, "utf8");
config.searchHtml.searchReplaceRules.rules = returnPreparedUpgradeRulesFromCsvFile(upgradeRulesFileContent);

/*
 recursive(config[].files.folder, config.searchHtml.files.exclude, function (err, files) {

 });
 */

