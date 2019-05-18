const Joi = require('joi');
const uploader = require('express-fileuploader');
const path = require('path');
const File = require('../models/file.model');

const fileSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  userId: Joi.string().required(),
  path: Joi.string().required(),
  folderPath: Joi.string().required(),
});

module.exports = {
  fileSchema,
  uploadFile,
  createFolder,
  getFiles,
  getTrashFiles,
  deleteFiles,
  restoreFiles,
  trashFiles,
  moveFiles,
};

uploader.use(
  new uploader.LocalStrategy({
    uploadPath: '/uploads',
  }),
);

function getFiles(req, res, next) {
  const { folderPath = '/' } = req.query;
  File.find({ userId: req.session.user.id, isDeleted: false, folderPath }, (error, collection) => {
    res.send(JSON.stringify({ folderPath, collection }));
  });
}

function getTrashFiles(req, res, next) {
  File.find({ userId: req.session.user.id, isDeleted: true }, (error, collection) => {
    res.send(JSON.stringify(collection));
  });
}

function trashFiles(req, res, next) {
  File.updateOne({ _id: req.body.id }, { $set: { isDeleted: true } }, (error, collection) => {
    res.send('');
  });
}

function restoreFiles(req, res, next) {
  File.updateOne({ _id: req.body.id }, { $set: { isDeleted: false } }, (error, collection) => {
    res.send('');
  });
}

function moveFiles(req, res, next) {
  const { from, to, id } = req.body;
  const folderPath = to.substring(0, to.lastIndexOf('/'));

  File.updateOne({ _id: id }, { $set: { path: to, folderPath } }, (error, collection) => {
    res.send(JSON.stringify(collection));
  });
}

function deleteFiles(req, res, next) {
  File.findOneAndRemove({ _id: req.body.id, isDeleted: true }, (error, collection) => {
    const fs = require('fs');
    const filePath = path.join(__dirname, `../../uploads/${collection.name}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.send('');
  });
}

function uploadFile(req, res, next) {
  uploader.upload('local', req.files.file, (err, files) => {
    if (err) {
      return res.send(err);
      // return next(err);
    }
    const fileMeta = files[0];
    const userId = req.session.user.id;
    const { type, name } = fileMeta;
    const { folderPath = '/' } = req.body;
    const file = Joi.validate(
      { name, type, userId, folderPath, path: folderPath + name },
      fileSchema,
    ).value;

    new File(file).save((err, file) => {
      if (err) {
        return res.send(JSON.stringify(err));
      }
      res.send(JSON.stringify(file));
    });
  });
}

function createFolder(req, res, next) {
  const userId = req.session.user.id;
  const { name, folderPath = '/' } = req.body;
  const file = Joi.validate(
    { name, type: 'folder', path: `${folderPath}/${name}`, folderPath, userId },
    fileSchema,
  ).value;

  new File(file).save((err, file) => {
    if (err) {
      return res.send(JSON.stringify(err));
    }
    res.send(JSON.stringify(file));
  });
}
