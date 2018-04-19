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
    node index.js searchHtml
  
    node index.js searchHtml notReplaced
  searchJs
    node index.js searchJs
  searchJsNotReplaced
    node index.js searchJs notReplaced
  searchCss
    node index.js searchCss
  searchCssNotReplaced
    node index.js searchCss notReplaced
  replaceHtml
    node index.js replaceHtml
  searchHtmlAfterReplace
    node index.js searchCssAfterReplace
  copyFixture
    cp test/files/fixture-bootstrap-3.html.bak test/fixtures/fixture-bootstrap-3.html
~~~

have fun && feel free to **extend and optimize**