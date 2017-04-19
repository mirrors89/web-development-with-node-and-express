var fortune = require('./lib/fortune');
var express = require('express'),
  app = express(),
  handlebars = require('express-handlebars')
    .create({defaultLayout : 'main'}),
  bodyParser = require('body-parser');

var tours = [
    { id : 0, name: 'Hood River', price: 99.99 },
    { id : 1, name: 'Oregon Coast', price: 149.95 }
];

app
  .use(express.static(__dirname + '/public'))
  .set('port', process.env.PORT || 3000)
  .engine('handlebars', handlebars.engine)
  .set('view engine', 'handlebars');

app
  .use(bodyParser.json({
	limit: '50mb'
  }))
  .use(bodyParser.urlencoded({
	limit: '50mb',
	extended: true
  }));


app.use(function(req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
});

app
  .get('/', function(req, res) {
    res.render('home');
  })
  .get('/about', function(req, res) {
    res.render('about', {
      fortune : fortune.getFortune(),
      pageTestScript: '/qa/tests-about.js'
    });
  });

app
  .get('/tours/hood-river', function(req, res) {
    res.render('tours/hood-river');
  })
  .get('/tours/request-group-rate', function(req, res) {
      res.render('tours/request-group-rate');
  });

// 커스텀 404 페이지
app.
  use(function(req, res) {
    res.status(404);
    res.render('404');
  })
  .use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
  });

// Application listens
app.listen(app.get('port'), function() {
  console.log('Express started on  http://localhost:' + app.get('port') +
                  '; press Ctrl-c to terminate.');
});