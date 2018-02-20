'use strict';

//Load the library and specify options
const replace = require('replace-in-file');
const path = require('path');
const fs = require('fs');

let selectors = {}, contentAsArray = [], templateEngineVariableStart = '[', templateEngineVariableEnd = ']' ;

let transformCSSSelectorToHTMLAttribute = function (str) {
  return str.replace(".", " ");
};
let isACSSClassSelector = function (str) {
  return str.charAt(0) === '.';
};
fs.readFile('upgrade-rules.txt.csv', "utf8", function (err, data) {
	contentAsArray = data.split("\n");
	//console.log(contentAsArray)
	//console.log(typeof contentAsArray)


	for(var oneLine of contentAsArray) {
		oneLine = oneLine.trim();
		if(oneLine !== '' && oneLine.charAt(0) !== '#') {

			let searchString = oneLine.split(';')[0].trim();
      let replaceString = oneLine.split(';')[1].trim();

			selectors[searchString] = replaceString;

      if(isACSSClassSelector(searchString)) {
        searchString = searchString.substr(1);
      }
      if(isACSSClassSelector(replaceString)) {
        replaceString = replaceString.substr(1);
      }

      replaceString = transformCSSSelectorToHTMLAttribute(replaceString);

      let options = {
				files: './test.html',
				from:new RegExp('(["|\'].*)('+searchString+')(.*["|\'])',"g"),
				to: '$1'+replaceString+'$3'
			};
			//console.log(options);
			try {
				let changes = replace.sync(options);
				console.log('Modified files:', changes.join(', '));
			}
			catch (error) {
				console.error('Error occurred:', error);
			}
		}
	}
	
});


/*const changes = replace(options)
 .then(changes = > {
 console.log('Modified files:', changes.join(', '));
 })
 .
 catch(error = > {
 console.error('Error occurred:', error);
 })
 ;*/

/*
try {
  const changes = replace.sync(options);
  console.log('Modified files:', changes.join(', '));
}
catch (error) {
  console.error('Error occurred:', error);
}
*/
