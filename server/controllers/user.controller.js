const Joi = require('joi');
const uploader = require('express-fileuploader');
const path = require('path');
const fileSchema = require('./file.controller');
const User = require('../models/user.model');
const File = require('../models/file.model');

const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: [Joi.string().optional(), Joi.allow(null)],
  middleName: [Joi.string().optional(), Joi.allow(null)],
  email: Joi.string().email(),
  mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/),
  password: Joi.string().required(),
  repeatPassword: Joi.string()
    .required()
    .valid(Joi.ref('password')),
  isVerified: Joi.boolean(),
});

module.exports = { userSchema, uploadFile, getUser, getUserFiles, deleteUserFiles };

uploader.use(
  new uploader.LocalStrategy({
    uploadPath: '/uploads',
  }),
);

function uploadFile(req, res, next) {
  uploader.upload('local', req.files.file, (err, files) => {
    if (err) {
      return res.send(err);
      // return next(err);
    }
    const fileMeta = files[0];
    const userId = req.session.user.id;
    const { type, name } = fileMeta;
    const file = Joi.validate({ name, type, userId }, fileSchema).value;

    new File(file).save((err, file) => {
      if (err) {
        return res.send(JSON.stringify(err));
      }
      res.send(JSON.stringify(file));
    });
  });
}

function getUser(req, res, next) {
  res.json(200, req.session.user);
}

function getUserFiles(req, res, next) {
  File.find({ userId: req.session.user.id, isDeleted: false }, (error, collection) => {
    res.send(JSON.stringify(collection));
  });
}

function deleteUserFiles(req, res, next) {
  File.updateOne({ _id: req.body.id }, { $set: { isDeleted: true } }, (error, collection) => {
    File.find({ _id: req.body.id }, (error, collection) => {
      const fs = require('fs');
      const filePath = path.join(__dirname, `../../uploads/${collection[0].name}`);
      fs.unlinkSync(filePath);
      res.send('');
    });
  });
}
