const express = require('express');
const asyncHandler = require('express-async-handler');
const authCtrl = require('../controllers/auth.controller');
const config = require('../config/config');

const router = express.Router();
const resCodes = require('../config/rescodes');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.get('/logout', authCtrl.logout);
router.post('/resend', authCtrl.resendToken);
router.get('/confirmation/:token', authCtrl.confirmationToken);
router.post('/resetpassword', authCtrl.resetPassword);
router.post('/changepassword/', authCtrl.changePassword);

module.exports = router;
