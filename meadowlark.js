var express = require('express'),
  app = express(),
  handlebars = require('express-handlebars')
    .create({defaultLayout : 'main'});

var fortunes = [
  "Conquer your fears or they will conquer you.",
  "Rivers need spring.",
  "Do not fear what you don't know.",
  "You will have a pleasant surprise.",
  "Whenever possible, keep it simple."
]

app
  .use(express.static(__dirname + '/public'))
  .set('port', process.env.PORT || 3000);
  .engine('handlebars', handlebars.engine);
  .set('view engine', 'handlebars');

app
  .get('/', function(req, res) {
    res.render('home');
  })
  .get('/about', function(req, res) {
    var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render('about', { fortune:randomFortune });
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
  })

// Application listen
app.listen(app.get('port'), function() {
  console.log('Express started on  http://localhost:' + app.get('port')
                  +'; press Ctrl-c to terminate.');
});
