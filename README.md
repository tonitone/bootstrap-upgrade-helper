# Bootstrap upgrade helper for upgrade from V3 to V4

Small CSS-class-replacer to change Bootstrap's V3 markup to V4.

This project is created to help me convert the CSS-class-attributes for a project. 
I can not parse the DOM with a XML-parser, because the templates are not valid.

## upgrade-rules

_The upgrade-rules have been originally taken from http://upgrade-bootstrap.bootply.com/ (thank you) and extended by 
my self. Feel free to fix them or add more_

In the `/search-rules/`-folder you can find the csv-files for search and replace:
 - search-all.csv
 - will-replace.csv
 - wont-replace.csv 
 
## log-files
The log-files after each action will be saved in the output-folder.

### file-list
The files, that have been found during a searchHtml-requests, will be also stored in the output-folder. 

## DON'T USE THE REPLACE-MODE TWICE ON THE SAME FILE ;)

## How to use it
1. `git clone https://github.com/tonitone/bootstrap-upgrade-helper.git`
2. `cd bootstrap-upgrade-helper/`
3. `npm i`
4. `cp config.json.example config.json`
5. Edit the config.json
5. My actual replacement-workflow looks like this: (maybe you find another one better)
    1. Do a search: `npm run searchHtml`
    2. Do a replacement-action: `npm run replaceHtml`
    3. Do a search for elements, that will not be handled in replace-mode: `npm run searchHtml notReplaced`

### Possible actions
~~~
> npm run

available via `npm run-script`:
  searchHtml
    node index.js searchHtml > output/search-html.log.txt
  searchHtmlWontReplace
    node index.js searchHtml wontReplace > output/search-html-wont-replace.log.txt
  searchJs
    node index.js searchJs > output/search-js.log.txt
  searchJsWontReplace
    node index.js searchJs wontReplace > output/search-js-wont-replace.log.txt
  searchCss
    node index.js searchCss > output/search-css.log.txt
  searchCssWontReplace
    node index.js searchCss wontReplace > output/search-css-wont-replace.log.txt
  replaceHtml
    node index.js replaceHtml > output/replace-html.log.txt
  copyFixture
    cp test/files/fixture-bootstrap-3.html.bak test/fixtures/fixture-bootstrap-3.html

~~~

have fun && feel free to **extend and optimize**