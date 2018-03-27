# css class replacer for bootstrap upgrade from v3 to v4

Small CSS-class-replacer to change bootstrap v3 markup to v4

This project is created to help me convert the CSS-class-attributes for a project. 
I can not parse the DOM with a XML-parser, because the templates are not valid.

In the **upgrade-rules.txt** you can see what kind of markup will be replaced. 
Lines that starts with an `#` will be ignored for replacements, to reduce time consuming complexity - 
and will be replaced by hand :) 

For `searchXYZ`-actions the lines that start with a hash `#` will be used.

in the `fixture-small.html` is a some small piece of sample html.

## How to use it
1. git clone https://github.com/tonitone/css-class-replacer-for-bootstrap-upgrade-from-v3-to-v4.git
2. cd css-class-replacer-for-bootstrap-upgrade-from-v3-to-v4/
3. npm i
4. Edit the config.json
5. Do a search (FYI): `npm run searchHtml`
6. Do a replacement-action: npm run replaceHtml
7. Do a search-action (to see what you have to replace by hand): `npm run searchHtml`


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

> node index.js searchCss

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