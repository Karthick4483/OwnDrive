const Joi = require('joi');
const uploader = require('express-fileuploader');
const path = require('path');
const queue = require('../config/kue');
const File = require('../models/file.model');
const cleanURL = require('../utils/string');

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
  File.find(
    { userId: req.session.user.id, isTrashed: false, isDeleted: false, folderPath },
    (error, collection) => {
      res.send(JSON.stringify({ folderPath, collection }));
    },
  );
}

function getTrashFiles(req, res, next) {
  File.find(
    { userId: req.session.user.id, isTrashed: true, isDeleted: false },
    (error, collection) => {
      res.send(JSON.stringify(collection));
    },
  );
}

function trashFiles(req, res, next) {
  File.updateMany(
    {
      isTrashed: false,
      isDeleted: false,
      $and: [{ path: { $regex: `^${req.body.path}` } }],
    },
    { $set: { isTrashed: true } },
    (error, collection) => {
      res.send(JSON.stringify(collection));
    },
  );
}

function restoreFiles(req, res, next) {
  File.updateMany(
    {
      isTrashed: true,
      isDeleted: false,
      $and: [{ path: { $regex: `^${req.body.path}` } }],
    },
    { $set: { isTrashed: false } },
    (error, collection) => {
      res.send(JSON.stringify(collection));
    },
  );
}

function moveFiles(req, res, next) {
  const { from, to, id } = req.body;
  const folderPath = to.substring(0, to.lastIndexOf('/'));

  File.updateOne({ _id: id }, { $set: { path: to, folderPath } }, (error, collection) => {
    res.send(JSON.stringify(collection));
  });
}

function deleteFiles(req, res, next) {
  File.updateMany(
    {
      isTrashed: true,
      isDeleted: false,
      $and: [{ path: { $regex: `^${req.body.path}` } }],
    },
    { $set: { isDeleted: true } },
    (error, collection) => {
      const userId = req.session.user.id;

      const job = queue
        .create('deleteFiles', {
          title: `job ran at ${Date.now()}`,
          userId,
        })
        .save(err => {
          if (!err) console.log(job.id);
        });

      res.send(JSON.stringify(collection));
    },
  );
}

function uploadFile(req, res, next) {
  uploader.upload('local', req.files.file, (err, files) => {
    if (err) {
      return res.send(err);
    }
    const fileMeta = files[0];
    const userId = req.session.user.id;
    const { type, name } = fileMeta;
    const { folderPath = '/' } = req.body;
    const path = `${folderPath}/${name}/`;
    const file = Joi.validate(
      { name, type, userId, folderPath: cleanURL(folderPath), path: cleanURL(path) },
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
  const path = `${folderPath}/${name}/`;
  const file = Joi.validate(
    { name, type: 'folder', path: cleanURL(path), folderPath: cleanURL(folderPath), userId },
    fileSchema,
  ).value;

  new File(file).save((err, file) => {
    if (err) {
      return res.send(JSON.stringify(err));
    }
    res.send(JSON.stringify(file));
  });
}
