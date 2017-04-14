var express = require('express');

var app = express();

app.get('/', function(req, res) {
  res.type('text/plain');
  res.send('Meadwlark Travel');
});

app.get('/about', function(req, res) {
  res.type('text/plain');
  res.send('About Meadwlark Travel');
});

// 커스텀 404 페이지
app.use(function(req, res) {
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

// 커스텀 500 페이지
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.type('text/plain');
  res.status(500);
  res.send('500 - Server Error');
})

// Application listen
app.listen(app.get('port'), function() {
  console.log('Express started on  http://localhost:' + app.get('port')
                  +'; press Ctrl-c to terminate.');
});
