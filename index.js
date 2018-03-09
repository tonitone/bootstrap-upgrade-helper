'use strict';

//Load the library and specify options
const replace = require('replace-in-file');
const path = require('path');
const fs = require('fs');
const args = process.argv.slice(2);
const filesToReplace = args[0];
const dryRun = args[1] || false;

let replaceInFileDefaults = {
  /*encoding: 'ISO8859-1'*/
};

let contentAsArray = [], templateEngineVariableStart = '\\[', templateEngineVariableEnd = '\\]',
  transformCSSSelectorToHTMLAttribute, isACSSClassSelector, getFileListToReplace, isDryRun;

transformCSSSelectorToHTMLAttribute = function (str) {
  return str.replace(".", " ");
};

isACSSClassSelector = function (str) {
  return str.charAt(0) === '.';
};

getFileListToReplace = function () {
  return filesToReplace;
};

isDryRun = function () {
  return !!dryRun;
};

console.log(isDryRun());

fs.readFile('upgrade-rules.txt.csv', "utf8", function (err, data) {
  contentAsArray = data.split("\n");
  //console.log(contentAsArray)
  //console.log(typeof contentAsArray)


  var isLineNotEmptyAndDontStartWithAHash = function () {
    return oneLine !== '' && oneLine.charAt(0) !== '#';
  };

  for (var oneLine of contentAsArray) {
    oneLine = oneLine.trim();
    if (isLineNotEmptyAndDontStartWithAHash()) {

      let searchString = oneLine.split(';')[0].trim(),
        replaceString = oneLine.split(';')[1].trim(),
        returnSearchStringRegexObject = function (searchString) {
          searchString = searchString.split('-').join('\-');

          // (<.*class=['"].*[^\-\s"'\[])(panel)([^\-\s"'\]]*)

          // + templateEngineVariableStart + searchString + templateEngineVariableEnd +
          return new RegExp('(class=["\'].*)'+templateEngineVariableStart + searchString + templateEngineVariableEnd +'|(' + searchString + ')(.*["\'])', "g")
        };

      if (isACSSClassSelector(searchString)) {
        searchString = searchString.substr(1);
      }
      if (isACSSClassSelector(replaceString)) {
        replaceString = replaceString.substr(1);
      }

      replaceString = transformCSSSelectorToHTMLAttribute(replaceString);


      let replaceInFileOptions = Object.assign({
        //files: './fixture-bootstrap-3-theme.html',
        files: './fixture-small.html',
        from: returnSearchStringRegexObject(searchString),
        to: '$1' + replaceString + '$3',
        dry: isDryRun(),
      }, replaceInFileDefaults);


      try {
        if (searchString === 'panel') {
          console.log(searchString)
        }
        let changes = replace.sync(replaceInFileOptions);
        console.log(searchString);
        if (changes.length > 0) {
          console.log('---');
          console.log('Modified files:', changes.join(', '));
          console.log('Search:  ' + returnSearchStringRegexObject(searchString));
          console.log('Replace: ' + '$1' + replaceString + '$3');
        }
      }
      catch (error) {
        console.error('Error occurred:', error);
      }
    }
  }

});