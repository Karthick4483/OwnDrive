const express = require('express');
const albumCtrl = require('../controllers/album.controller');

const router = express.Router();
module.exports = router;

router.post('/create', albumCtrl.createAlbum);
router.post('/add/files', albumCtrl.addAlbumFiles);
router.get('/list', albumCtrl.getAlbums);
router.get('/list/files', albumCtrl.getAlbumsFiles);
// router.delete('/trash', albumCtrl.trashAlbum);
router.delete('/delete', albumCtrl.deleteAlbum);
router.delete('/remove/files', albumCtrl.removeAlbumFiles);
