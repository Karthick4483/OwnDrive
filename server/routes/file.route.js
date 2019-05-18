const express = require('express');
const mutilpart = require('connect-multiparty');
const fileCtrl = require('../controllers/file.controller');

const router = express.Router();
module.exports = router;

router.use('/upload/image', mutilpart());
router.post('/upload/image', fileCtrl.uploadFile);
router.post('/create/folder', fileCtrl.createFolder);
router.post('/move', fileCtrl.moveFiles);
router.post('/restore', fileCtrl.restoreFiles);

router.get('/list/all', fileCtrl.getFiles);
router.get('/list/trash', fileCtrl.getTrashFiles);

router.delete('/delete', fileCtrl.deleteFiles);
router.delete('/trash', fileCtrl.trashFiles);
