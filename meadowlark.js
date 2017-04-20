var fortune = require('./lib/fortune');
var express = require('express'),
  app = express(),
  handlebars = require('express-handlebars')
    .create({
      defaultLayout : 'main',
      helpers: {
        section: function (name, option) {
          if(!this._sections) this._sections = {};
          this._sections[name] = option.fn(this);
          return null;
        }
      }
    }),
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


app.use(function(req, res, next) {
  if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weatherContext = getWeatherData();
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
	.get('/test', function(req, res) {
		res.render('jquery-test');
	});

app
  .get('/tours/hood-river', function(req, res) {
    res.render('tours/hood-river');
  })
  .get('/tours/request-group-rate', function(req, res) {
      res.render('tours/request-group-rate');
  });

app.get('/headers', function(req, res) {
  res.set('Content-Type', 'text/plain');
  var s = '';
  for(var name in req.headers) s += name + ' : ' + req.headers[name] + '\n';
  res.send(s);
});

app.get('/api/tours', function(req, res) {
  var toursXml = '' +
      tours.map(function(p) {
        return '" id ="' + p.id + '">' + p.name + '';
      }).join('') + '';
  var toursText = tours.map(function(p) {
        return p.id + ': ' + p.name + ' (' + p.price + ')';
      }).join('\n');

  res.format({
    'application/json': function() {
      res.json(tours);
    },
    'application/xml': function() {
      res.type('application/xml');
      res.send(toursXml);
    },
    'text/xml': function() {
      res.type('text/xml');
      res.send(toursXml);
    },
	'text/plain': function() {
      res.type('text/plain');
      res.send(toursXml);
    }
  });
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

function getWeatherData() {
  return {
    location: [
      {
        name: 'Portland',
        forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
        iconUrl: 'http://icon-ak.xwug.com/i/c/k/cloudy.gif',
        weather: 'Overcast',
        temp: '54.1 F (12.3 C)'
      },
      {
        name: 'Bend',
        forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
        iconUrl: 'http://icon-ak.xwug.com/i/c/k/partlycloudy.gif',
        weather: 'Partly Cloudy',
        temp: '55.0 F (12.8 C)'
      },
      {
        name: 'Manzanita',
        forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
        iconUrl: 'http://icon-ak.xwug.com/i/c/k/rain.gif',
        weather: 'Light Rain',
        temp: '55.0 F (12.8 C)'
      }
    ]
  };
}