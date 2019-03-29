let createError = require('http-errors');
let express = require('express');
let path = require('path');
let csrf = require('csurf');
let cookieParser = require('cookie-parser');
let logger = require('morgan');



//CONTROLLER LIST
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/user');



/*-------------------------------------------------------------*/
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//CSRF
app.use(csrf({cookie: true}));

app.use(express.static(path.join(__dirname, 'public')));

//ASSOCIATION CONTROLLERS AND ROUTES
app.use('/', indexRouter);
app.use('/user', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// // error handler CSRF
app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)

    // handle CSRF token errors here
    res.status(403)
    res.send('form tampered with problem token CSRF : error csurf')
})
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
