const express = require('express');
const asyncHandler = require('express-async-handler');
const passport = require('passport');
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');
const config = require('../config/config');
const jwt = require('jsonwebtoken');

const router = express.Router();
module.exports = router;

// router.post('/register', asyncHandler(register), login);
router.post('/login', loginUser);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

router.get('/me', passport.authenticate('jwt', { session: false }), protected);

async function register(req, res, next) {
  let user = await userCtrl.insert(req.body);
  user = user.toObject();
  delete user.hashedPassword;
  req.user = user;
  next();
}

function protected(eq, res) {
  const { user } = req;
  res.status(200).send({ user });
}

function loginUser(req, res) {
  passport.authenticate('local', { session: false }, (error, user) => {
    if (error || !user) {
      res.status(400).json({ error });
    }

    /** This is what ends up in our JWT */
    const payload = {
      username: user.username,
      expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_MS),
    };

    /** assigns payload to req.user */
    req.login(payload, { session: false }, error => {
      if (error) {
        res.status(400).send({ error });
      }

      /** generate a signed json web token and return it in the response */
      const token = jwt.sign(JSON.stringify(payload), 'keys.secret');

      /** assign our jwt to the cookie */
      res.cookie('jwt', token, { httpOnly: true, secure: true });
      res.status(200).send({ token });
    });
  })(req, res);
}
