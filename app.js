var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var moviesRouter = require('./routes/movies');
var salasRouter = require('./routes/salas');
var funcionesRouter = require('./routes/funciones');
var metodosPagoRouter = require('./routes/metodos_pago');
var ventasRouter = require('./routes/ventas');
var ticketsRouter = require('./routes/tickets');
var authRouter = require('./routes/auth');
var publicRouter = require('./routes/public');
var userRouter = require('./routes/user');
var usersAdminRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Public routes (no auth required)
app.use('/', publicRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/users', usersAdminRouter);

// Admin dashboard and protected routes
app.use('/admin', indexRouter);
app.use('/movies', moviesRouter);
app.use('/salas', salasRouter);
app.use('/funciones', funcionesRouter);
app.use('/metodos_pago', metodosPagoRouter);
app.use('/ventas', ventasRouter);
app.use('/tickets', ticketsRouter);

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
