const bcrypt = require('bcrypt');
const Joi = require('joi');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const config = require('../config/config');
const User = require('../models/user.model');
const SignupToken = require('../models/signup-token.model');
const userCtrl = require('../controllers/user.controller');

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

const smpt = {
  host: 'smtp.gmail.com',
  port: 587,
  // secure: true, // use TLS
  auth: {
    user: 'noreplyowndrive@gmail.com',
    pass: 'owndrivepp@4483',
  },
};

const transporter = nodemailer.createTransport(smpt);
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
    }/app/changePassword/${token.token}.\n`,
  };
  return mailOptions;
}

function logout(req, res) {
  req.session.destroy();
  res.redirect('/app/login');
}

function login(req, res) {
  const { email, password } = req.body;
  User.findOne({ email }).then(user => {
    if (!user) {
      res.json(401, resCodes['401']);
    } else if (user && !user.validPassword(password)) {
      // res.json(401, resCodes['401']);
      req.flash('message', 'invalid password');
      res.redirect('/app/login');
    } else if (user && !user.isVerified) {
      req.session.user = { id: user.email, isVerified: false };
      res.redirect('/app/verify');
    } else if (user && user.isVerified) {
      req.session.user = { id: user.email, isVerified: true };
      res.redirect('/app/dashboard');
    }
  });
}

function register(req, res) {
  const userProps = Joi.validate(req.body, userCtrl.userSchema, { abortEarly: false }).value;
  userProps.hashedPassword = bcrypt.hashSync(userProps.password, 10);
  userProps.isVerified = false;
  delete userProps.password;

  const user = new User(userProps);

  user.save(error => {
    if (error) {
      req.flash('message', error.message);
      return res.redirect('/app/register');
    }
    createEmailToken(req, res, user._id, userProps.email, verifyMailOptions).then(
      token => {
        const mailOption = verifyMailOptions(req, res, token, userProps.email);
        transporter.sendMail(mailOption, err => {
          if (err) {
            req.flash('message', err.message);
            return res.redirect('/app/register');
          }
          req.flash('message', 'Email has been sent');
          return res.redirect('/app/notify');
        });
      },
      err => {
        if (err) {
          req.flash('message', err.message);
          res.redirect('/app/register');
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
      return res.redirect('/app/verifyError');
    }
    User.findOne({ _id: token._userId }, (err, user) => {
      SignupToken.remove({ token: req.params.token }, tokenError => {
        req.session.user = { id: user.email, isVerified: false };

        if (tokenError) {
          req.flash('message', 'Token expired or not found');
          return res.redirect('/app/notify');
        }

        if (user) {
          user.isVerified = true;

          user.save(err => {
            if (err) {
              return res.status(500).send({ msg: err.message });
            }
            req.session.user = { id: user.email, isVerified: true };
            req.flash('message', 'User has been verfied already, login now');
            return res.redirect('/app/notify');
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
      return res.redirect('/app/notify');
    }
    if (user.isVerified) {
      req.flash('message', 'User has been verfied already, login now');
      return res.redirect('/app/notify');
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
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      req.flash('message', 'No User');
      return res.redirect('/app/notify');
    }
    createEmailToken(req, res, user._id, req.body.email, resetMailOptions).then(
      token => {
        transporter.sendMail(resetMailOptions(req, res, token, req.body.email), err => {
          if (err) {
            req.flash('message', err.message);
            return res.redirect('/app/notify');
          }
          req.flash('message', 'Reset information has been sent');
          res.redirect('/app/notify');
        });
      },
      err => {
        if (err) {
          req.flash('message', err.message);
          res.redirect('/app/notify');
        }
      },
    );
  });
}

function changePassword(req, res) {
  SignupToken.findOne({ token: req.body.token }, (err, token) => {
    if (!token) {
      req.flash('message', 'Invalid Token');
      return res.redirect('/app/notify');
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    User.findOneAndUpdate({ _id: token._userId }, { $set: { hashedPassword } }).then(
      user => {
        req.flash('message', 'Password has been changed');
        res.redirect('/app/notify');
      },
      err => {
        if (err) {
          req.flash('message', err.message);
          return res.redirect('/app/notify');
        }
      },
    );
  });
}
