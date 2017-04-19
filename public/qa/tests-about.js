var jsdom = require('jsdom');
var jquery = require('jquery');
var assert = require('chai').assert;
var $;

jsdom.env({
	url: 'http://localhost:3000/about',
	done: function(err, window) {
		$ = jquery(window);
	}
});

suite('"About" Page Tests', function () {
  test('page should contain link to contact page', function () {
    assert($('a[href="/contact"]').length);
  });
});