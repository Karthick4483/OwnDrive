const Joi = require('joi');
const Album = require('../models/album.model');
const File = require('../models/file.model');
const { ObjectId } = require('mongodb'); // or ObjectID

const albumSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  userId: Joi.string().required(),
});

function getAlbums(req, res, next) {
  Album.find({ userId: ObjectId(req.session.user.id), isDeleted: false }, (error, collection) => {
    res.json(200, collection);
  });
}
//

function getAlbumsFiles(req, res, next) {
  Album.aggregate(
    [
      { $match: { _id: ObjectId(req.query.id), userId: ObjectId(req.session.user.id) } },
      {
        $lookup: {
          from: 'files',
          localField: 'files',
          foreignField: '_id',
          as: 'albumFiles',
        },
      },
      {
        $project: {
          _id: 1,
          'albumFiles.name': 1,
          'albumFiles.path': 1,
          'albumFiles.folderPath': 1,
          'albumFiles.userId': 1,
          'albumFiles._id': 1,
          'albumFiles.type': 1,
          'albumFiles.mimeType': 1,
        },
      },
    ],

    (error, collection) => {
      if (error) return res.send(400, error);
      const files = collection && collection[0] ? collection[0].albumFiles : [];
      return res.send(200, files);
    },
  );
}

function removeAlbumFiles(req, res, next) {
  Album.findOneAndUpdate(
    { _id: req.body.albumId, userId: req.session.user.id },
    { $pull: { files: req.body.id } },
    (error, collection) => {
      if (error) return res.send(400, error);
      return res.send(200, collection);
    },
  );
}

function addAlbumFiles(req, res, next) {
  Album.findOneAndUpdate(
    { _id: req.body.id, userId: req.session.user.id },
    { $addToSet: { files: req.body.fileId } },
    (error, collection) => {
      if (error) return res.send(400, error);
      return res.send(200, collection);
    },
  );
}

function createAlbum(req, res, next) {
  const album = Joi.validate(
    {
      name: req.body.name,
      type: req.body.type,
      userId: req.session.user.id,
    },
    albumSchema,
  ).value;

  new Album(album).save((error, album) => {
    if (error) {
      res.json(400, error);
    } else {
      res.json(200, album);
    }
  });
}

// function trashAlbum(req, res, next) {
//   Album.deleteOne({ userId: req.session.user.id, _id: req.body.id, isDeleted: true }, error => {
//     if (error) return res.json(400, error);

//     File.findOneAndUpdate(
//       { userId: req.session.user.id, $and: [{ $in: [req.body.id] }] },
//       { isTrashed: true },
//       (error, collection) => {
//         if (error) return res.json(400, error);
//         res.json(200, collection);
//       },
//     );
//   });
// }

function deleteAlbum(req, res, next) {
  Album.deleteOne({ userId: req.session.user.id, _id: req.body.id, isDeleted: false }, error => {
    if (error) return res.json(400, error);
    res.json(200);
  });
}

module.exports = {
  albumSchema,
  getAlbums,
  createAlbum,
  deleteAlbum,
  addAlbumFiles,
  removeAlbumFiles,
  getAlbumsFiles,
};
