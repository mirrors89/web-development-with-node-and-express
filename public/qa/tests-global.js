var jsdom = require('mocha-jsdom');
var assert = require('chai').assert;

suite('Global Tests', function () {
  test('page has a valid title', function () {
    jsdom();
    assert(document.title && window.document.title.match(/\S/) &&
        window.document.title.toUpperCase() !== 'TODO');
  });
});