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
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const config = require('./config');
const views = require('../routes/view.route');
const routes = require('../routes/index.route');
const swaggerDocument = require('./swagger.json');

const app = express();
const distDir = '../../build/';
const uploadDir = '../../uploads/';
if (config.env === 'development') {
  app.use(logger('dev'));
}
app.set('strict routing', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(expressValidator());
app.use(flash());
app.engine('html', require('ejs').renderFile);

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

// app.use(express.static(path.join(__dirname, `${distDir}/`)), { index: false });
app.use('/uploads/', express.static(path.join(__dirname, `${uploadDir}`)));
app.use('/media/', express.static(path.join(__dirname, `${distDir}/media`)));
app.use('/scripts/', express.static(path.join(__dirname, `${distDir}/scripts`)));
app.use('/build/', express.static(path.join(__dirname, distDir)));
app.use('/api/', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use('/register', () => res.redirect('/app/register'));
app.use('/', views);

app.use((req, res, next) => {
  const err = new httpError(404);
  return next(err);
});

// error handler, send stacktrace only during development
const server = app.use((err, req, res, next) => {
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
