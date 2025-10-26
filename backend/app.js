const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
dotenv.config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const sequelize = require('./config/database');

// Test database connection and sync models
sequelize.authenticate()
  .then(() => {
    console.log('Database connected!');
    return sequelize.sync({ alter: true }); // Use alter: true for development
  })
  .then(() => {
    console.log('Database synced!');
  })
  .catch((err) => {
    console.error('Database error:', err);
  });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
var adminRouter = require('./routes/admin');
var organizerRouter = require('./routes/organizer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// CORS configuration - Allow all origins for development
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);  // Admin routes di luar /api
app.use('/api/organizer', organizerRouter);  // Organizer routes
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
