const bcrypt = require('bcrypt');
const Joi = require('joi');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const config = require('../config/config');
const User = require('../models/user.model');

module.exports = {
  register,
  login,
  logout,
  resendToken,
  confirmationToken,
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

function getMailOptions(req, res, token) {
  const mailOptions = {
    from: 'no-reply@owndrive.com',
    to: req.body.email,
    subject: 'Account Verification Token',
    text: `${'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp://'}${
      req.headers.host
    }/api/auth/confirmation/${token.token}.\n`,
  };
  return mailOptions;
}

const NOT_VERIFIED = {
  type: 'not-verified',
  msg: 'We were unable to find a valid token. Your token my have expired.',
};

const ALREADY_VERIFIED = { type: 'already-verified', msg: 'This user has already been verified.' };
const VERIFIED_SUCCESS = {
  type: 'verified',
  msg: 'The account has been verified. Please log in.',
};

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
      res.json(401, resCodes['401']);
    } else if (user && !user.isVerified) {
      req.session.user = { id: user.email, isVerified: false };
      res.redirect('/app/verify');
    } else if (user && user.isVerified) {
      req.session.user = { id: user.email, isVerified: true };
      res.redirect('/app/dashboard');
    }
  });
}
function createUserTokenandEmail(req, res, userId, email) {
  const token = new SignupToken({
    _userId: userId,
    token: crypto.randomBytes(16).toString('hex'),
  });

  token.save(err => {
    if (err) {
      return res.json(500, { msg: err.message });
    }

    transporter.sendMail(getMailOptions(req, res, token), err => {
      if (err) {
        return res.json(500, { msg: err.message });
      }
      res.json(200, `A verification email has been sent to ${email}.`);
    });
  });
}

function register(req, res) {
  const userProps = Joi.validate(req.body, userSchema, { abortEarly: false }).value;
  userProps.hashedPassword = bcrypt.hashSync(userProps.password, 10);
  userProps.isVerified = false;
  delete userProps.password;

  const user = new User(userProps);

  user.save(error => {
    if (error) {
      res.json(500, { msg: error.message });
    }
    createUserTokenandEmail(req, res, userId, userProps.email);
  });
}

function resendToken(req, res) {
  User.findOne({ email: req.body.email }, (err, user) => {
    req.session.destroy();
    if (!user) return res.redirect('/app/verifyError');
    if (user.isVerified) {
      res.redirect('/app/verifySuccess');
      return;
    }
    createUserTokenandEmail(req, res, user._id, req.body.email);
  });
}

function confirmationToken(req, res, next) {
  SignupToken.findOne({ token: req.params.token }, (err, token) => {
    if (!token) {
      return res.redirect('/app/verifyError');
    }
    User.findOne({ _id: token._userId }, (err, user) => {
      SignupToken.remove({ token: req.params.token }, tokenError => {
        req.session.user = { id: user.email, isVerified: false };

        if (tokenError) {
          res.redirect('/app/verifyError');
          return;
        }

        if (user) {
          user.isVerified = true;

          user.save(err => {
            if (err) {
              return res.status(500).send({ msg: err.message });
            }
            req.session.user = { id: user.email, isVerified: true };

            res.redirect('/app/verifySuccess');
          });
        }
      });
    });
  });
}
