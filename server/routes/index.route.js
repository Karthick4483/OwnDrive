const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');

const router = express.Router(); // eslint-disable-line new-cap
const resCodes = require('../config/rescodes');

const validateUser = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    next();
  } else {
    res.send(401, resCodes['401']);
  }
};

router.use('/auth', authRoutes);
router.use('/user', validateUser, userRoutes);

module.exports = router;
