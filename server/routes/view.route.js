const express = require('express');
const path = require('path');

const router = express.Router();
const distDir = '../../build/';

const checkLogin = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.isVerified) {
    res.redirect('/app/dashboard');
  } else if (req.session.user && !req.session.user.isVerified) {
    res.redirect('/app/verify');
  } else {
    next();
  }
};

const checkDashboard = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.isVerified) {
    next();
  } else if (req.session.user && !req.session.user.isVerified) {
    res.redirect('/app/verify');
  } else {
    res.redirect('/app/login');
  }
};

const checkRegister = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.isVerified) {
    res.redirect('/app/dashboard');
  } else if (req.session.user && !req.session.user.isVerified) {
    res.redirect('/app/verify');
  } else {
    next();
  }
};

const checkVerify = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.isVerified) {
    res.redirect('/app/dashboard');
  } else if (req.session.user && !req.session.user.isVerified) {
    next();
  } else if (req.session.user == undefined) {
    res.redirect('/app/login');
  }
};

router.use('/login', checkLogin, (req, res) => {
  res.render(path.join(__dirname, `${distDir}/login.html`), { msg: 'login' });
});

router.use('/register', checkRegister, (req, res) => {
  res.sendFile(path.join(__dirname, `${distDir}/register.html`));
});

router.use('/dashboard', checkDashboard, (req, res) => {
  res.sendFile(path.join(__dirname, `${distDir}/app.html`));
});

router.use('/verify', checkVerify, (req, res) => {
  res.sendFile(path.join(__dirname, `${distDir}/verify.html`));
});

router.use('/verifySuccess', (req, res) => {
  res.render(path.join(__dirname, `${distDir}/login.html`), {
    msg: 'Email verified, please login.',
  });
});

router.use('/verifyError', (req, res) => {
  res.render(path.join(__dirname, `${distDir}/login.html`), {
    msg: 'Already verified or token expired, please login.',
  });
});

module.exports = router;
