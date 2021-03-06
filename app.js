var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var markdownRouter = require('express-markdown-router');

var app = express();

//Base de datos
require('./lib/connectMongoose');
//Models
require('./models/Article');
require('./models/User');
require('./models/PushToken');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
    req.lang = req.get('x-lang') || 'es';
    next();
});

// app.use('/',markdownRouter(__dirname + '/views'));
// app.use('/apiv1',markdownRouter(__dirname + '/views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images/articles', express.static(path.join(__dirname, 'public/images')));

app.use('/', routes);
app.use('/apiv1', routes);
app.use('/apiv1/articles', require('./routes/apiv1/articles'));
app.use('/apiv1/users', require('./routes/apiv1/users'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);

    if (req.path.match(/\/apiv\d+/)) {
      // llamada de API, devuelvo JSON
      return res.json({success: false, message: err.message, err: err});

        // return res.status(status).json({success:false, message: error, error: err});

    }

    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
