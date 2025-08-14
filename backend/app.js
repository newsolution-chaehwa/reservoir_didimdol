var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

process.env.PORT = 3000

var app = express();
app.use(cors())

process.env.TZ = 'Asia/Seoul'

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var yesterdayRouter = require('./routes/dynamic/yesterday')
var predictRouter = require('./routes/dynamic/predict')
var requestRouter = require('./routes/dynamic/request')
var searchRouter = require('./routes/dynamic/search')
var comparisonRouter = require('./routes/dynamic/comparison')
var mobileRouter = require('./routes/dynamic/mobile')
var branchesRouter = require('./routes/static/branches')
var weatherRouter = require('./routes/dynamic/weather')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/yesterday', yesterdayRouter)
app.use('/predict', predictRouter)
app.use('/request', requestRouter)
app.use('/search', searchRouter)
app.use('/comparison', comparisonRouter)
app.use('/mobile', mobileRouter)
app.use('/static',  branchesRouter)
app.use('/weather', weatherRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
