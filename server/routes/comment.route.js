const express = require('express');
const mutilpart = require('connect-multiparty');
const commentCtrl = require('../controllers/comment.controller');

const router = express.Router();
module.exports = router;

router.post('/add', commentCtrl.addComment);
router.get('/list', commentCtrl.getComments);
router.delete('/delete', commentCtrl.deleteComment);
