'use strict';

const path = require('path');
const fs = require('fs');
const args = process.argv.slice(2);
const runningMode = args[0] || 'searchHtml';
//const fileExtension = args[1] || '.html';
const filesToReplace = args[1] || './fixture-small.html';

let upgradeRulesAsLines = [], returnTransformedCSSSelectorToHTMLAttribute,
  isACSSClassSelector, returnCleanCsvString,
  regExForHtmlClassAttribute = /(\s+class=['"]{1})(.[^'"]*)(['"]{1}>)/g;

returnTransformedCSSSelectorToHTMLAttribute = function (str) {
  return str.replace(".", " ");
};

isACSSClassSelector = function (str) {
  return str.charAt(0) === '.';
};

returnCleanCsvString = function (searchString) {
  searchString = searchString.trim();
  if (isACSSClassSelector(searchString)) {
    searchString = searchString.substr(1);
  }
  return searchString;
};

let isLineNotEmptyAndDontStartWithAHash = function (oneLine) {
  return oneLine !== '' && oneLine.charAt(0) !== '#';
};

fs.readFile('upgrade-rules.txt.csv', "utf8", function (err, upgradeRulesFileContent) {
  upgradeRulesAsLines = upgradeRulesFileContent.split("\n");

  fs.readFile(filesToReplace, 'utf8', function (err, fileToReplaceFileContent) {
    if (err) {
      return console.log(err);
    }

    let result;

    while (result = regExForHtmlClassAttribute.exec(fileToReplaceFileContent)) {
      let htmlClassAttributesString = result[2],
        htmlClassAttributes = htmlClassAttributesString.split(' '),
        oneLine;

      for (oneLine of upgradeRulesAsLines) {
        if (isLineNotEmptyAndDontStartWithAHash(oneLine)) {

          let csvColumns = oneLine.split(','),
            searchString = returnCleanCsvString(csvColumns[0]),
            replaceString = returnCleanCsvString(csvColumns[1]),
            itemIndexToReplace;

          replaceString = returnTransformedCSSSelectorToHTMLAttribute(replaceString);
          //if(searchString.indexOf('label') !== -1)
          //console.log(searchString, replaceString)
          itemIndexToReplace = htmlClassAttributes.indexOf(searchString);

          if (itemIndexToReplace !== -1) {
            htmlClassAttributes[itemIndexToReplace] = replaceString;

            if (runningMode === 'searchHtml') {
              console.log('found in' + filesToReplace + ' selector: ' + csvColumns[0]);
            }
            //  console.log(htmlClassAttributes);
          }
        }
      }

      if (runningMode === 'replace') {
        let htmlClassAttributesNew = htmlClassAttributes.join(' ');
        if (htmlClassAttributesString !== htmlClassAttributesNew) {
          fileToReplaceFileContent = fileToReplaceFileContent.replace(htmlClassAttributesString, htmlClassAttributesNew);
          console.log('replace in ' + filesToReplace + ': ' + htmlClassAttributesString + ' > ' + htmlClassAttributesNew);
        }
      }
    }
    if (runningMode === 'replace') {
      fs.writeFile(filesToReplace, fileToReplaceFileContent, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    }
  });
});
