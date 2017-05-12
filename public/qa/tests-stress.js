var loadtest = require('loadtest');
var expect = require('chai').expect;

suite('Stress test', function() {
   test('Homepage should handle 50 requests in a second', function() {
       var options = {
           url: 'http://localhost:3000',
           concurrency: 4,
           maxRequest: 500
       };
       loadtest.loadTest(options, function(err, result) {
           expect(!err);
           expect(result.totalTimeSeconds < 1);
           done();
       })
   })
});