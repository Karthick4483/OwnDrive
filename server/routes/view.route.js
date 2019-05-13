const express = require('express');
const path = require('path');

const router = express.Router({ strict: true });
const distDir = '../../build/';

const checkLogin = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.isVerified) {
    res.redirect('/dashboard');
  } else if (req.session.user && !req.session.user.isVerified) {
    res.redirect('/verify');
  } else {
    next();
  }
};

const checkDashboard = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.isVerified) {
    next();
  } else if (req.session.user && !req.session.user.isVerified) {
    res.redirect('/verify');
  } else {
    res.redirect('/login');
  }
};

const checkRegister = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.isVerified) {
    res.redirect('/dashboard');
  } else if (req.session.user && !req.session.user.isVerified) {
    res.redirect('/verify');
  } else {
    next();
  }
};

const checkVerify = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.isVerified) {
    res.redirect('/dashboard');
  } else if (req.session.user && !req.session.user.isVerified) {
    next();
  } else if (req.session.user == undefined) {
    res.redirect('/login');
  }
};

router.use('/login', checkLogin, (req, res) => {
  res.render(path.join(__dirname, `${distDir}/base.html`), {
    template: require('fs').readFileSync(path.join(__dirname, `${distDir}/login.html`), 'utf-8'),
    data: JSON.stringify({ msg: req.flash('message') }),
  });
});

router.use('/register', checkRegister, (req, res) => {
  res.render(path.join(__dirname, `${distDir}/base.html`), {
    template: require('fs').readFileSync(path.join(__dirname, `${distDir}/register.html`), 'utf-8'),
    data: JSON.stringify({ msg: req.flash('message') }),
  });
});

router.use('/dashboard', checkDashboard, (req, res) => {
  res.sendFile(path.join(__dirname, `${distDir}/index.html`));
});

router.use('/verify', (req, res) => {
  res.render(path.join(__dirname, `${distDir}/base.html`), {
    template: require('fs').readFileSync(path.join(__dirname, `${distDir}/verify.html`), 'utf-8'),
    data: JSON.stringify({ msg: req.flash('message') }),
  });
});

router.use('/resetPassword', (req, res) => {
  res.render(path.join(__dirname, `${distDir}/base.html`), {
    template: require('fs').readFileSync(
      path.join(__dirname, `${distDir}/reset_password.html`),
      'utf-8',
    ),
    data: JSON.stringify({ msg: req.flash('message') }),
  });
});

router.use('/changePassword/:token', (req, res) => {
  res.render(path.join(__dirname, `${distDir}/base.html`), {
    template: require('fs').readFileSync(
      path.join(__dirname, `${distDir}/change_password.html`),
      'utf-8',
    ),
    data: JSON.stringify({ msg: req.flash('message'), token: req.params.token }),
  });
});

router.use('/notify', (req, res) => {
  res.render(path.join(__dirname, `${distDir}/base.html`), {
    template: require('fs').readFileSync(path.join(__dirname, `${distDir}/notify.html`), 'utf-8'),
    data: JSON.stringify({ msg: req.flash('message') }),
  });
});

router.use('', checkDashboard, (req, res) => {
  res.sendFile(path.join(__dirname, `${distDir}/index.html`));
});

module.exports = router;
