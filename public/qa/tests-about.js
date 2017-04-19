var jsdom = require('mocha-jsdom');
var $ = require('jquery');
var assert = require('chai').assert;

suite('"About" Page Tests', function () {
  test('page should contain link to contact page', function () {
    jsdom();
    assert($('a[href="/contact"]').length);
  });
});