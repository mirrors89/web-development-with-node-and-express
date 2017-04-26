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
  bodyParser = require('body-parser'),
  formidable = require('formidable'),
  jqupload = require('jquery-file-upload-middleware');

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

app.use('/upload', function(req, res, next) {
    var now = Date.now();
    jqupload.fileHandler({
        uploadDir: function() {
            return __dirname + '/public/uploads/' + now;
        },

        uploadUrl: function() {
            return '/uploads/' + now;
        }
    })(req, res, next);
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

app.get('/nursery-rhyme', function(req, res) {
  res.render('nursery-rhyme');
});

app.get('/data/nursery-rhyme', function(req, res) {
  res.json({
    animal: 'squirrel',
    bodyPart: 'tail',
    adjective: 'bushy',
    noun: 'heck'
  });
});

app.get('/thank-you', function(req, res){
    res.render('thank-you');
});

app.get('/newsletter', function(req, res) {
  res.render('newsletter', {csrf: 'CSRF token goes here'});
});

app.post('/process', function(req, res) {
  if(req.xhr || req.accepts('json, html') === 'json') {
    res.send({ success: true});
  } else {
    res.redirect(303, '/thank-you')
  }

  // console.log('From (from querystring): ' + req.query.from);
  // console.log('CSRF token (from hidden from field): ' + req.body._csrf);
  // console.log('Name (from visible from field): ' + req.body.name);
  // console.log('Email (from visible from field): ' + req.body.email);
  // res.redirect(303, '/thank-you')
});


app.get('/contest/vacation-photo', function(req, res) {
  var now = new Date();
  res.render('contest/vacation-photo', {
    year: now.getFullYear(), month: now.getMonth()
  })
});

app.post('/contest/vacation-photo/:year/:month', function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    if(err) return res.redirect(303, '/error');
    console.log('received fields: ');
    console.log(fields);
    console.log('received files: ');
    console.log(files);
    res.redirect(303, '/thank-you')
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
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
        weather: 'Overcast',
        temp: '54.1 F (12.3 C)'
      },
      {
        name: 'Bend',
        forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
        weather: 'Partly Cloudy',
        temp: '55.0 F (12.8 C)'
      },
      {
        name: 'Manzanita',
        forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
        weather: 'Light Rain',
        temp: '55.0 F (12.8 C)'
      }
    ]
  };
}