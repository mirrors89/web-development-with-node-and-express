var assert = require('chai').assert;
var jsdom = require('jsdom');
var globalWindow;

jsdom.env({
	url: "http://localhost:3000",
	done: function(err, window) {
		globalWindow = window;
	}

});

suite('Global Tests', function () {
  test('page has a valid title', function () {
	  assert(globalWindow.document.title && globalWindow.document.title.match(/\S/) &&
		  globalWindow.document.title.toUpperCase() !== 'TODO');
  });
});