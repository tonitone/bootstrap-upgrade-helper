# Bootstrap upgrade helper for upgrade from V3 to V4

Small CSS-class-replacer to change Bootstrap's V3 markup to V4.

This project is created to help me convert the CSS-class-attributes for a project. 
I can not parse the DOM with a XML-parser, because the templates are not valid.

## upgrade-rules

_The upgrade-rules have been originally taken from http://upgrade-bootstrap.bootply.com/ (thank you) and extended by my self._

In the `upgrade-rules.csv.txt` you can see what kind of markup will be replaced. 

Lines that starts with an `#` will be ignored for replacements, to reduce time consuming complexity - 
and will be replaced by hand :) 

For `searchXYZ`-actions the lines that start with a hash `#` will be used.

## How to use it
1. `git clone https://github.com/tonitone/bootstrap-upgrade-helper.git`
2. `cd bootstrap-upgrade-helper/`
3. `npm i`
4. `cp config.json.example config.json`
5. Edit the config.json
5. My actual replacement-workflow looks like this: (maybe you find another one better)
    1. Do a search: `npm run searchHtml`
    2. Do a replacement-action: `npm run replaceHtml`
    3. Do a search-action (to see what you have to replace by hand): `npm run searchHtml`


### Possible actions
~~~
> npm run

searchHtml
  node index.js searchHtml
searchJs
  node index.js searchJs
searchCss
  node index.js searchCss
replaceHtml
  node index.js replaceHtml

~~~

### Example: npm run searchCss

~~~

> npm run searchCss

---
file: c:\my-path\xy.custom-theme.css

found selector .item 
found selector .item 
found selector .item 
found selector .item 
found selector .item 
---
found: 5 replaceable attributes!


---
file: c:\my-path\css\some.css

found selector .well 
found selector .well 
found selector .btn-default 
---
found: 3 replaceable attributes!


---
file: c:\my-path\less\flexer.less

found selector .panel-heading 
found selector .panel-default 
---
found: 2 replaceable attributes!


---------------------
found: 10 replaceable attributes in 3 files 

~~~

have fun && feel free to **extend and optimize**