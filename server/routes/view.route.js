const express = require('express');
const path = require('path');
const router = express.Router();
const distDir = '../../build/';

const toDashboard = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('/app/dashboard');
  } else {
    next();
  }
};

const toLogin = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    next();
  } else {
    res.redirect('/app/login');
  }
};

router.use('/login', toDashboard, (req, res) => {
  res.sendFile(path.join(__dirname, distDir + '/login.html'));
});

router.use('/dashboard', toLogin, (req, res) => {
  res.sendFile(path.join(__dirname, distDir + '/app.html'));
});

module.exports = router;
