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
  res.render(path.join(__dirname, `${distDir}/login.html`), { msg: req.flash('message') });
});

router.use('/register', checkRegister, (req, res) => {
  res.render(path.join(__dirname, `${distDir}/register.html`), { msg: req.flash('message') });
});

router.use('/dashboard', checkDashboard, (req, res) => {
  res.sendFile(path.join(__dirname, `${distDir}/app.html`));
});

router.use('/verify', checkVerify, (req, res) => {
  res.sendFile(path.join(__dirname, `${distDir}/verify.html`));
});

router.use('/resetPassword', (req, res) => {
  res.render(path.join(__dirname, `${distDir}/reset_password.html`), {
    msg: '',
  });
});

router.use('/changePassword/:token', (req, res) => {
  res.render(path.join(__dirname, `${distDir}/change_password.html`), {
    token: req.params.token,
  });
});

router.use('/notify', (req, res) => {
  res.render(path.join(__dirname, `${distDir}/notify.html`), {
    msg: req.flash('message'),
  });
});

module.exports = router;
