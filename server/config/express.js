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
const swaggerDocument = require('./swagger.json');
const routes = require('../routes/index.route');
const config = require('./config');
const passport = require('./passport');

const viewRouter = express.Router();
const app = express();
const distDir = '../../build/';

if (config.env === 'development') {
  app.use(logger('dev'));
}

const corsOptions = {
  origin: 'http://localhost:4040',
  credentials: true,
};

app.use(express.static(path.join(__dirname, distDir)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());

app.use(methodOverride());
app.use(helmet());
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/', routes);
app.use('/app', (req, res) => {
  res.sendFile(path.join(__dirname, `${distDir}/app.html`));
});

viewRouter.get('/', (req, res) => {
  console.log(req.session);
  res.send('Welcome');
});

viewRouter.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, `${distDir}/login.html`));
});

viewRouter.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return console.log(err);
    }
    res.redirect('/login');
  });
});

app.use('/', viewRouter);

// catch 404 and forward to error handler
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
