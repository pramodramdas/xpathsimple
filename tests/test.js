var expect = require('chai').expect,
	xpathSimple = require('../index');

var xml = "<book author='john'><br/><title>Harry Potter<a>cold</a></title></book>"
var xs = new xpathSimple(xml);
var tagCheck = ['/book[1]/title[1]'];
var dataCheck = ['/book[1]/title[1]/a[1]'];
var attributeCheck = ['/book[1]'];
var attributeValueTest = ['/book[1]'];

describe('tagtest', function () {
	it('should return xpaths of nodes containing tag "title"', function () {
		expect(xs.search('title','tag')).to.have.same.members(tagCheck);
	});
});

describe('datatest', function () {
	it('should return xpaths of nodes containing data "cold"', function () {
		expect(xs.search('cold','data')).to.have.same.members(dataCheck);
	});
});

describe('attributetest', function () {
	it('should return xpaths of nodes containing attribute "author"', function () {
		expect(xs.search('author','attribute')).to.have.same.members(attributeCheck);
	});
});

describe('attributevaluetest', function () {
	it('should return xpaths of nodes containing attribute value "john"', function () {
		expect(xs.search('john','attributeValue')).to.have.same.members(attributeValueTest);
	});
});