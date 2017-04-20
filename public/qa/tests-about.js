var jquery = require('jquery');
var Browser = require('zombie');
var browser;

suite('"About" Page Tests', function () {
	setup(function(){
		browser = new Browser();
	});

	test('page should contain link to contact page', function () {
		browser.visit('http://localhost:3000/about', function() {
			browser.assert.element('a[href="/contact"]');
		});
	  // assert($('a[href="/contact"]').length);
  });
});