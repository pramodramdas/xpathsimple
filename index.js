'use strict';

var xpath = require('xpath')
  , dom = require('xmldom').DOMParser;


var mainPath = {};
var result = [];


class xpathjson{
	  constructor(){
	  	this.childNodes = {};
	  	this.attributes = {};
	  	this.tagName = null;
	  	this.data = null;
	  	this.nextSibling = null;
	  	this.xpath = '';
	  	this.tags = {}
	  }
}

class xpathParse{
	constructor(html){
		this.doc = new dom().parseFromString(html);
		this.nodes = xpath.select("/*", this.doc);
		this.main = extractXpath(this.nodes);
	}

	search(key , option = 'tag')
	{	result = [];
		if(option === 'tag')
		{
			return getByTag(this.main,key);
		}
		else if(option === 'data')
		{
			return getByData(this.main,key,'/');
		}
		else if(option === 'attribute')
		{
			return getByAttrTag(this.main,key);
		}
		else if(option === 'attributeValue')
		{
			return getByAttrValue(this.main,key);
		}
		return result;
	}
	
}


function getByTag(nodes,tag)
{
	let node = nodes;

	for( var key in Object.keys(node))
	{	
		if(node[key].tagName && node[key].tagName === tag)
		{	
			result[result.length] = node[key].xpath;
		}
		if(node[key].childNodes)
			getByTag(node[key].childNodes,tag);
	}

	return result;
}

function getByAttrTag(nodes,attrTag)
{
	let node = nodes;

	for( var key in Object.keys(node))
	{	
		if(node[key].attributes[attrTag])
		{	
			result[result.length] = node[key].xpath;
		}
		if(node[key].childNodes)
			getByAttrTag(node[key].childNodes,attrTag);
	}

	return result;
}

function getByData(nodes,data,parentXpath)
{
	let node = nodes;

	for( var key in Object.keys(node))
	{	
		if(node[key].data && node[key].data.indexOf(data) > -1)
		{	
			result[result.length] = parentXpath;
		}
		if(node[key].childNodes)
			getByData(node[key].childNodes,data,node[key].xpath);
	}

	return result;
}

function getByAttrValue(nodes,attrTagValue)
{
	let node = nodes;

	for(let key in Object.keys(node))
	{	
		for (let i in node[key].attributes)
		{	
			if(node[key].attributes[i] === attrTagValue)
				result[result.length] = node[key].xpath;
		}
		if(node[key].childNodes)
			getByAttrValue(node[key].childNodes,attrTagValue);
	}

	return result;
}


function extractXpath(nodes){
		let node = nodes[0];
		let maintags = {};
		let j = 0;
		while(1){
			let xjson = new xpathjson();
			xjson.tagName = node.tagName;

			if(node.tagName){
				//xjson.xpath = '/'+node.tagName;
				if(maintags[node.tagName])
				{
					maintags[node.tagName] = maintags[node.tagName] + 1;
					xjson.xpath = '/'+node.tagName+'['+maintags[node.tagName]+']';
				}
				else
				{
					xjson.xpath = '/'+node.tagName+'[1]';
					maintags[node.tagName] = 1;
				}
			}

    		if(node.childNodes)
				for(let i = 0; i<node.childNodes.length;i++)
				{
					xjson.childNodes[i] = build(node.childNodes[i],xjson.xpath,xjson.tags);
				}
			for(let k = 0; k<node.attributes.length;k++)
			{
				xjson.attributes[node.attributes[k].name] = node.attributes[k].value;
			}
			mainPath[j] = xjson;

			if(!node.nextSibling)
				break;
			else{
				node = node.nextSibling;
				j++;
			}

		}
		return mainPath;
	}


function build(node,parentPath,tags)
{
	let xjson = new xpathjson();
	xjson.tagName = node.tagName;

	if(node.tagName){
		//xjson.xpath = parentPath+'/'+node.tagName;
		if(tags[node.tagName])
		{
			tags[node.tagName] = tags[node.tagName] + 1;
			xjson.xpath = parentPath+'/'+node.tagName+'['+tags[node.tagName]+']';
		}
		else
		{
			tags[node.tagName] = 1;
			xjson.xpath = parentPath+'/'+node.tagName+'[1]';
		}
	}

	if(node.childNodes)
	{
		for(let i = 0; i<node.childNodes.length;i++)
		{
			xjson.childNodes[i] = build(node.childNodes[i],xjson.xpath,xjson.tags);
		}
		for(let k = 0; k<node.attributes.length;k++)
		{
			xjson.attributes[node.attributes[k].name] = node.attributes[k].value;
		}
	}
	else if(node.data)
	{
		xjson.data = node.data;
	}
	return xjson;
}

module.exports = xpathParse;

