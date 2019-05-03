const express = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');
const config = require('../config/config');
const router = express.Router();
const resCodes = require('../config/rescodes');

router.post('/register', asyncHandler(register));
router.post('/login', login);
router.get('/logout', logout);

async function register(req, res, next) {
  let user = await userCtrl.insert(req.body);
  user = user.toObject();
  delete user.hashedPassword;
  req.user = user;
  req.session.user = { id: user.email };
  res.json(200, user);
}

function logout(req, res) {
  req.session.destroy();
  res.send(null);
}

function login(req, res) {
  const email = req.body.email,
    password = req.body.password;

  User.findOne({ email: email }).then(function(user) {
    if (!user) {
      res.json(401, resCodes['401']);
    } else if (!user.validPassword(password)) {
      res.json(401, resCodes['401']);
    } else {
      req.session.user = { id: user.email };
      res.redirect('/app/dashboard');
      // res.json(200, user);
    }
  });
}

module.exports = router;
