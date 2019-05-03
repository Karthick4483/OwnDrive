const path = require('path');
const express = require('express');
const httpError = require('http-errors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const routes = require('../routes/index.route');
const views = require('../routes/view.route');
const config = require('./config');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();
const distDir = '../../build/';

if (config.env === 'development') {
  app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
// app.use(methodOverride());
// app.use(helmet());
// app.use(cors());

app.use(
  session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    store: new MongoStore({ url: config.mongo.host }),
    resave: false,
    saveUninitialized: false,
    cookie: {},
  }),
);

app.use(express.static(path.join(__dirname, distDir)));
app.use('/api/', routes);
app.use('/app/', views);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('/app/dashboard');
  } else {
    res.redirect('/app/login');
  }
});

app.use((req, res, next) => {
  const err = new httpError(404);
  return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) => {
  // customize Joi validation errors
  if (err.isJoi) {
    err.message = err.details.map(e => e.message).join('; ');
    err.status = 400;
  }

  res.status(err.status || 500).json({
    message: err.message,
  });
  next(err);
});

module.exports = app;
