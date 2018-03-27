'use strict';

const fs = require('fs');
const enfslist = require("enfslist");
const path = require('path');
const args = process.argv.slice(2);
const runningMode = args[0] || 'searchHtml';
const config = require(__dirname + '/config.json');

const returnPreparedUpgradeRulesFromCsvFile = require(__dirname + '/lib/returnPreparedUpgradeRulesFromCsvFile');
const returnTransformedCSSSelectorToHtmlAttribute = require(__dirname + '/lib/returnTransformedCSSSelectorToHtmlAttribute');
const returnFilesBasedOnExtension = require(__dirname + '/lib/returnFilesBasedOnExtension');
const Counter = require(__dirname + '/lib/Counter');
const returnCleanCsvString = require(__dirname + '/lib/returnCleanCsvString');

let runJsAndCssActions = function () {
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
    let result;
    while (result = regExForHtmlClassAttribute.exec(fileToReplaceFileContent)) {
      let htmlClassAttributesString = result[2],
        htmlClassAttributes = htmlClassAttributesString.split(' ');

      // Todo: refactor to for(i=0;i<....length){}
      for (let actualRule of config[runningMode].searchReplaceRules.rules) {
        let replaceString = actualRule.replace,
          itemIndexToReplace;

        //if(searchString.indexOf('label') !== -1)
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
              break;
          }
        }
      }

      if (runningMode === 'replaceHtml') {
        let htmlClassAttributesNew = htmlClassAttributes.join(' ');
        if (htmlClassAttributesString !== htmlClassAttributesNew) {
          fileToReplaceFileContent = fileToReplaceFileContent.replace(htmlClassAttributesString, htmlClassAttributesNew);
          console.log('replaced ' + htmlClassAttributesString + ' > ' + htmlClassAttributesNew);
        }
      }

    }
    return {htmlClassAttributesString, htmlClassAttributes, replaceString, htmlClassAttributesNew};
  },
  regExForHtmlClassAttribute = /(\s+class=['"]?)(.[^'"]*)(['"]?>)/g,
  suffixForGlobalCounter = 'All',
  foundFiles = [];


Counter.registerCounter(runningMode);
Counter.registerCounter(runningMode + suffixForGlobalCounter);
Counter.registerCounter('files');

try {
  config[runningMode].files.filteredFiles = fs.readFileSync(config[runningMode].searchReplaceRules.file, "utf8");
} catch (err) {
  console.log('error in config[runningMode].files.filteredFiles :', err);
  process.exit(1);
}
config[runningMode].searchReplaceRules.rules = returnPreparedUpgradeRulesFromCsvFile(config[runningMode].files.filteredFiles, runningMode);
//console.log(config[runningMode].searchReplaceRules.rules);

config[runningMode].files.filteredFiles = returnFilesBasedOnExtension(
  enfslist.listSync(config[runningMode].files.folder),
  config[runningMode].files.filesMatcher,
  config[runningMode].files.exclude
);


for (let i = 0; i < config[runningMode].files.filteredFiles.length; i++) {
  var actualFile = config[runningMode].files.filteredFiles[i],
    fileToReplaceFileContent, result;

  try {
    fileToReplaceFileContent = fs.readFileSync(actualFile, 'utf8');
  } catch (err) {
    console.log('error in config[runningMode].files.filteredFiles = ' +
      'fs.readFileSync(config[runningMode].searchReplaceRules.file ... ) ', err);
    process.exit(1);
  }

  Counter.resetCounter(runningMode);

  if (runningMode === 'searchJs' || runningMode === 'searchCss' || runningMode === 'replaceJs') {
    var {splittedCssClasses, iSplittedCssClasses, actualSplittedRule, regExpObject} = runJsAndCssActions();
  }

  if (runningMode === 'searchHtml' || runningMode === 'replaceHtml') {
    var {htmlClassAttributesString, htmlClassAttributes, replaceString, htmlClassAttributesNew} = runHtmlActions();
    if (runningMode === 'replaceHtml') {
      try {
        fs.writeFileSync(actualFile, fileToReplaceFileContent);
      } catch (err) {
        console.log('error in fs.writeFileSync(actualFile, fileToReplaceFileContent); :', err);
        process.exit(1);
      }
    }
  }
  if (Counter.returnCounter(runningMode) > 0) {
    console.log('---\nfound: ' + Counter.returnCounter(runningMode) + ' replaceable attributes!\n\n');
  }
}
console.log('---------------------\nfound: ' + Counter.returnCounter(runningMode + suffixForGlobalCounter) + ' ' +
  'replaceable attributes in ' + foundFiles.length + ' files.');

console.log('\nsuccessful finished!');
process.exit(0);
