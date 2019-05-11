const express = require('express');
const asyncHandler = require('express-async-handler');
const authCtrl = require('../controllers/auth.controller');
const config = require('../config/config');

const router = express.Router();
const resCodes = require('../config/rescodes');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/resend', authCtrl.resendToken);
router.get('/logout', authCtrl.logout);
router.get('/confirmation/:token', authCtrl.confirmationToken);

module.exports = router;
