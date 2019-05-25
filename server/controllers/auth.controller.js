const bcrypt = require('bcrypt');
const Joi = require('joi');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const config = require('../config/config');
const User = require('../models/user.model');
const SignupToken = require('../models/signup-token.model');
const userCtrl = require('../controllers/user.controller');
const fileCtrl = require('../controllers/file.controller');

mongoose.Promise = global.Promise;

module.exports = {
  register,
  login,
  logout,
  resendToken,
  confirmationToken,
  resetPassword,
  changePassword,
};

const transporter = nodemailer.createTransport(config.smtp);
const NOT_VERIFIED = {
  type: 'not-verified',
  msg: 'We were unable to find a valid token. Your token my have expired.',
};
const ALREADY_VERIFIED = { type: 'already-verified', msg: 'This user has already been verified.' };
const VERIFIED_SUCCESS = {
  type: 'verified',
  msg: 'The account has been verified. Please log in.',
};

function verifyMailOptions(req, res, token, email) {
  const mailOptions = {
    from: 'no-reply@owndrive.com',
    to: email,
    subject: 'Account Verification Token',
    text: `${'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp://'}${
      req.headers.host
    }/api/auth/confirmation/${token.token}.\n`,
  };
  return mailOptions;
}

function resetMailOptions(req, res, token, email) {
  const mailOptions = {
    from: 'no-reply@owndrive.com',
    to: email,
    subject: 'Account Reset Token',
    text: `${'Hello,\n\n' + 'Please change your password by clicking the link: \nhttp://'}${
      req.headers.host
    }/changePassword/${token.token}.\n`,
  };
  return mailOptions;
}

function logout(req, res) {
  req.session.destroy();
  res.redirect('/login');
}

function login(req, res) {
  const { email, password } = req.body;
  User.findOne({ email }).then(user => {
    if (!user) {
      req.flash('message', 'invalid user name');
      res.redirect('/login');
    } else if (user && !user.validPassword(password)) {
      req.flash('message', 'invalid password');
      res.redirect('/login');
    } else if (user && !user.isVerified) {
      // req.session.user = { id: user._id, email: user.email, isVerified: false };
      res.redirect('/verify');
    } else if (user && user.isVerified) {
      req.session.user = { id: user._id, email: user.email, isVerified: true };
      fileCtrl.createDefaultDrive(user._id);
      res.redirect('/dashboard');
    }
  });
}

function register(req, res) {
  req.assert('firstName', 'First name cant be blank').notEmpty();
  req.assert('lastName', 'Last name cant be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.checkBody('password', 'Passwords does not match').equals(req.body.repeatPassword);
  req.checkBody('password', 'Passwords should be 8 chars in length').isLength({ min: 8 });
  req.assert('repeatPassword', 'Confirm Password cannot be blank').notEmpty();
  req.assert('mobileNumber', 'Mobile Number cannot be blank').notEmpty();

  // req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();
  if (errors) {
    req.flash('message', errors[0].msg);
    return res.redirect('/register');
  }

  const userProps = Joi.validate(req.body, userCtrl.userSchema, { abortEarly: false }).value;
  userProps.hashedPassword = bcrypt.hashSync(userProps.password, 10);
  userProps.isVerified = false;
  delete userProps.password;

  const user = new User(userProps);

  user.save(error => {
    if (error) {
      req.flash('message', error.message);
      return res.redirect('/register');
    }
    createEmailToken(req, res, user._id, userProps.email, verifyMailOptions).then(
      token => {
        const mailOption = verifyMailOptions(req, res, token, userProps.email);
        transporter.sendMail(mailOption, err => {
          if (err) {
            req.flash('message', err.message);
            return res.redirect('/register');
          }
          req.flash('message', 'Email has been sent');
          return res.redirect('/notify');
        });
      },
      err => {
        if (err) {
          req.flash('message', err.message);
          res.redirect('/register');
        }
      },
    );
  });
}

function createEmailToken(req, res, userId, email, emailOption) {
  const token = new SignupToken({
    _userId: userId,
    token: crypto.randomBytes(16).toString('hex'),
  });
  return token.save();
}

function confirmationToken(req, res, next) {
  SignupToken.findOne({ token: req.params.token }, (err, token) => {
    if (!token) {
      req.flash('message', 'Token expired or not found');
      return res.redirect('/notify');
    }
    User.findOne({ _id: token._userId }, (err, user) => {
      SignupToken.remove({ token: req.params.token }, tokenError => {
        // req.session.user = { email: user.email, id: user._id, isVerified: false };

        if (tokenError) {
          req.flash('message', 'Token expired or not found');
          return res.redirect('/notify');
        }

        if (user) {
          user.isVerified = true;
          user.save(err => {
            if (err) {
              return res.status(500).send({ msg: err.message });
            }
            // req.session.user = { email: user.email, id: user._id, isVerified: true };
            req.flash('message', 'User has been verfied already, login now');
            // fileCtrl.createDefaultDrive(user._id);
            return res.redirect('/notify');
          });
        }
      });
    });
  });
}

function resendToken(req, res) {
  User.findOne({ email: req.body.email }, (err, user) => {
    req.session.destroy();
    if (!user) {
      req.flash('message', 'Invalid user');
      return res.redirect('/notify');
    }
    if (user.isVerified) {
      req.flash('message', 'User has been verfied already, login now');
      return res.redirect('/notify');
    }
    createEmailToken(req, res, user._id, req.body.email).then(
      token => {
        const mailOption = verifyMailOptions(req, res, token, req.body.email);
        transporter.sendMail(mailOption, err => {
          if (err) {
            return res.json(500, { msg: err.message });
          }
        });
      },
      err => {
        if (err) {
          return res.json(500, { msg: err.message });
        }
      },
    );
  });
}

function resetPassword(req, res) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    req.flash('message', errors[0].msg);
    return res.redirect('/resetPassword');
  }

  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      req.flash('message', 'No User');
      return res.redirect('/resetPassword');
    }
    createEmailToken(req, res, user._id, req.body.email, resetMailOptions).then(
      token => {
        transporter.sendMail(resetMailOptions(req, res, token, req.body.email), err => {
          if (err) {
            req.flash('message', err.message);
            return res.redirect('/resetPassword');
          }
          req.flash('message', 'Reset information has been sent');
          res.redirect('/notify');
        });
      },
      err => {
        if (err) {
          req.flash('message', err.message);
          res.redirect('/resetPassword');
        }
      },
    );
  });
}

function changePassword(req, res) {
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.checkBody('password', 'Passwords does not match').equals(req.body.confirmPassword);
  req.checkBody('password', 'Passwords should be 8 chars in length').isLength({ min: 8 });
  req.assert('confirmPassword', 'Confirm Password cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('message', errors[0].msg);
    return res.redirect(`/changePassword/${req.body.token}`);
  }

  SignupToken.findOne({ token: req.body.token }, (err, token) => {
    if (!token) {
      req.flash('message', 'Invalid Token');
      return res.redirect(`/changePassword/${req.body.token}`);
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    User.findOneAndUpdate({ _id: token._userId }, { $set: { hashedPassword } }).then(
      user => {
        req.flash('message', 'Password has been changed');
        res.redirect('/notify');
      },
      err => {
        if (err) {
          req.flash('message', err.message);
          return res.redirect(`/changePassword/${req.body.token}`);
        }
      },
    );
  });
}
