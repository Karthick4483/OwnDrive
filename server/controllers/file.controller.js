const Joi = require('joi');
const uploader = require('express-fileuploader');
const path = require('path');
const _ = require('lodash');
const fs = require('fs');
const queue = require('../config/kue');
const File = require('../models/file.model');
const cleanURL = require('../utils/string');
const { ObjectId } = require('mongodb');

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
  getPhotos,
  getPhoto,
  getTrashFiles,
  deleteFiles,
  restoreFiles,
  trashFiles,
  moveFiles,
  createDefaultDrive,
};

uploader.use(
  new uploader.LocalStrategy({
    uploadPath: '/uploads',
  }),
);

function getFiles(req, res, next) {
  const { folderPath = '/' } = req.query;
  const userId = req.session.user.id;

  File.find(
    {
      userId,
      isTrashed: false,
      isDeleted: false,
      folderPath,
    },
    (error, collection) => {
      res.send(JSON.stringify({ folderPath, collection }));
    },
  );
}

function getPhoto(req, res, next) {
  const userId = req.session.user.id;
  const { fileName } = req.query;

  File.find({ fileName, userId }, (error, collection) => {
    const file = collection && collection[0];
    if (file) {
      filePath = path.join(__dirname, `../../uploads/${file.fileName}`);
      const img = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': file.mimeType });
      return res.end(img, 'binary');
    }
    return res.send(404, 'File not found');
  });
}

function getPhotos(req, res, next) {
  const userId = req.session.user.id;

  File.find(
    { userId, isTrashed: false, isDeleted: false, $and: [{ mimeType: { $regex: '^image' } }] },
    (error, collection) => {
      res.send(JSON.stringify({ collection }));
    },
  );
}

function getTrashFiles(req, res, next) {
  File.find(
    {
      userId: ObjectId(req.session.user.id),
      isTrashed: true,
      isDeleted: false,
    },
    (error, collection) => {
      res.send(JSON.stringify(collection));
    },
  );
}

function trashFiles(req, res, next) {
  File.findOneAndUpdate(
    {
      userId: ObjectId(req.session.user.id),
      isTrashed: false,
      $and: [{ _id: { $eq: ObjectId(req.body.id) }, type: { $ne: 'drive' } }],
    },
    { $set: { isTrashed: true } },
    (error, collection) => {
      File.updateMany(
        {
          userId: ObjectId(req.session.user.id),
          isTrashed: false,
          $and: [
            {
              type: { $ne: 'drive' },
              path: { $regex: `^${req.body.path}` },
              _id: { $ne: ObjectId(req.body.id) },
            },
          ],
        },
        { $set: { isTrashed: true } },
        (error, collection) => {
          res.send(JSON.stringify(collection));
        },
      );
    },
  );
}

function restoreFiles(req, res, next) {
  File.updateMany(
    {
      userId: req.session.user.id,
      isTrashed: true,
      $and: [{ path: { $regex: `^${req.body.path}` }, type: { $ne: 'drive' } }],
    },
    { $set: { isTrashed: false } },
    (error, collection) => {
      res.send(JSON.stringify(collection));
    },
  );
}

function getMetaFromPath(url) {
  const path = cleanURL(url);
  const paths = _.compact(path.split('/'));
  const isFolder = path.substr(path.length - 1) == '/';
  const name = paths.pop();
  const folderPath = `/${paths.join('/')}/`;

  return { name, folderPath, path: cleanURL(url) };
}

function getCopySuffix(collection, fromMeta, toMeta) {
  let copyInc = 0;
  let toFolderItems = [];
  let duplicateItem = false;
  if (collection) {
    toFolderItems = _.map(collection, item => `${item.folderPath} - ${item.path}`);
    duplicateItem = _.find(collection, { name: fromMeta.name });

    if (duplicateItem) {
      const duplicateName = duplicateItem.name;
      const matchingItems = _.filter(collection, item => item.name.indexOf(duplicateName) == 0);
      _.each(matchingItems, ({ name }) => {
        let lastNumber = 0;
        if (name.indexOf(' ') != -1) {
          lastNumber = name.substr(name.lastIndexOf(' ') + 1);
          if (!isNaN(lastNumber)) {
            if (lastNumber > copyInc) {
              copyInc = Number(lastNumber) + 1;
            }
          }
        }
      });
      if (copyInc == 0) copyInc = 1;
    }
  }
  return copyInc;
}

function moveFiles(req, res, next) {
  const { from, to, id } = req.body;
  const userId = req.session.user.id;
  const fromMeta = getMetaFromPath(from);
  const toMeta = getMetaFromPath(to);
  const invalidPath = "Invalid Path, can't move files to same folder, self folder or child folder";

  if (toMeta.path == fromMeta.path) {
    // return res.send(404, '');
  }

  File.find({ userId, path: toMeta.folderPath }, (error, collection) => {
    if (collection && collection[0]) {
      if (collection[0].type == 'file') {
        return res.send(404, invalidPath);
      }
    }
    File.find({ userId, folderPath: toMeta.folderPath }, (error, collection) => {
      const copyInc = getCopySuffix(collection, fromMeta, toMeta);

      File.find({ userId, _id: id, $and: [{ type: { $ne: 'drive' } }] }, (error, collection) => {
        if (collection && collection[0]) {
          const file = collection[0];
          if (file && toMeta.folderPath.indexOf(file.path) == 0) {
            return res.send(404, invalidPath);
          }
          File.find(
            {
              userId,
              $and: [{ path: { $regex: `^${file.path}` }, type: { $ne: 'drive' } }],
            },
            (error1, collection1) => {
              _.each(collection1, fileItem => {
                let newFolderPath = '';
                let newPath = '';
                let newName = cleanURL(`${toMeta.name}${copyInc ? ` ${copyInc}` : ''}`);
                const isfile = fileItem.type == 'file';
                if (fileItem.path == fromMeta.path) {
                  newFolderPath = fileItem.folderPath.replace(
                    fromMeta.folderPath,
                    `/${toMeta.folderPath}/`,
                  );
                  newPath = cleanURL(`${newFolderPath}/${newName}${isfile ? '' : '/'}`);
                } else {
                  newFolderPath = fileItem.folderPath.replace(
                    cleanURL(`/${fromMeta.folderPath}/${fromMeta.name}`),
                    cleanURL(`/${toMeta.folderPath}/${newName}`),
                  );

                  newName = fileItem.name;
                  newPath = cleanURL(`${newFolderPath}/${fileItem.name}${isfile ? '' : '/'}`);
                }

                newFolderPath = cleanURL(newFolderPath);

                console.log('---');
                console.log(fromMeta.folderPath);
                // console.log(toMeta.folderPath);
                console.log(`${newFolderPath}-`);
                console.log(`${newPath}-`);
                console.log(`${newName}-`);
                console.log('---');
                fileItem.folderPath = newFolderPath;
                fileItem.path = newPath;
                fileItem.name = newName;
                fileItem.save(saveError => {});
              });
              res.send(JSON.stringify(collection));
            },
          );
        } else {
          return res.send(404, invalidPath);
        }
      });
    });
  });
}

function deleteFiles(req, res, next) {
  File.updateMany(
    {
      isTrashed: true,
      isDeleted: false,
      userId: req.session.user.id,
      $and: [{ path: { $regex: `^${req.body.path}` }, type: { $ne: 'drive' } }],
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
  const userId = req.session.user.id;
  const { name } = req.files.file;
  const { folderPath = '/' } = req.body;
  const path = cleanURL(`${folderPath}/${name}`);
  const drive = findDrive(userId, folderPath).then(collection => {
    if (collection) {
      File.find({ path, type: 'file' }, (error, collection) => {
        if (collection.length == 0) {
          uploader.upload('local', req.files.file, (err, files) => {
            if (err) {
              return res.send(err);
            }
            const fileMeta = files[0];
            const userId = req.session.user.id;
            const { type, originalFilename } = fileMeta;

            const path = `${folderPath}/${originalFilename}`;
            const file = Joi.validate(
              {
                type: 'file',
                mimeType: type,
                name: originalFilename,
                fileName: originalFilename,
                userId,
                fileName: fileMeta.name,
                folderPath: cleanURL(folderPath),
                path: cleanURL(path),
              },
              fileSchema,
            ).value;

            new File(file).save((err, file) => {
              if (err) {
                return res.send(JSON.stringify(err));
              }
              res.send(JSON.stringify(file));
            });
          });
        } else {
          return res.send(409, 'File already exists!');
        }
      });
    } else {
      return res.send(404, 'Invalid Path');
    }
  });
}

function findDrive(userId, folderPath) {
  const folderPaths = _.compact(folderPath.split('/'));
  const drive = folderPaths[0];
  return File.findOne({ userId: ObjectId(userId), type: 'drive', name: drive }).exec();
}

function createDefaultDrive(userId) {
  File.findOne({ _id: userId, type: 'drive' }, (error, collection) => {
    if (collection == null || collection.length == 0) {
      const file = {
        name: userId,
        displayName: 'My Drive',
        type: 'drive',
        path: `/${userId}/`,
        folderPath: '/',
        userId,
      };
      new File(file).save();
    }
  });
}

function createFolder(req, res, next) {
  const userId = req.session.user.id;
  const { name, folderPath = '/' } = req.body;
  const path = `${folderPath}/${name}/`;
  const drive = findDrive(userId, folderPath).then(
    collection => {
      if (collection) {
        const file = Joi.validate(
          {
            name,
            type: 'folder',
            path: cleanURL(path),
            folderPath: cleanURL(folderPath),
            userId,
          },
          fileSchema,
        ).value;

        new File(file).save((err, file) => {
          if (err) {
            return res.send(JSON.stringify(err));
          }
          res.send(JSON.stringify(file));
        });
      } else {
        res.send(404, 'Drive Not found');
      }
    },
    error => {
      res.send(404, error);
    },
  );
}
