This module can be used parse search xpth in html or xml.
note: You have to pass html or xml string, tree starts from root. Search will return array of xpaths.
	  Pass options as {'tag','data','attribute','attributeValue'}


Example:

## installation
 

npm install xpathsimple


## usage

	var xml = "<book author='john'><br/><title>Harry Potter<a>cold</a></title></book>"
	var xp = require('xpathsimple');
	var obj = new xp(xml);

	console.log(obj.search('title','tag'));
	outpt: [ '/book[1]/title[1]' ]

	console.log(obj.search('cold','data'));
	[ '/book[1]/title[1]/a[1]' ]

	console.log(obj.search('author','attribute'));
	[ '/book[1]' ]

	console.log(obj.search('john','attributeValue'));
	[ '/book[1]' ]