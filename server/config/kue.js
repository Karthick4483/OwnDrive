const kue = require('kue');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const File = require('../models/file.model');
const { ObjectId } = require('mongodb');
const cleanURL = require('../utils/string');

const queue = kue.createQueue();

kue.app.listen(4000);
kue.app.set('title', 'Own Drive');
queue.watchStuckJobs(6000);

queue.on('ready', () => {
  console.info('Queue is ready!');
});

queue.on('error', err => {
  console.error('There was an error in the main queue!');
  console.error(err);
  console.error(err.stack);
});

function deleteFiles(files, callback) {
  const unlink = file => {
    const fPath = `${__dirname}/../../uploads/${file.fileName}`;
    fs.unlink(fPath, err => {
      getFile();
    });
  };

  const getFile = () => {
    if (files.length == 0) {
      callback(false);
      return;
    }
    unlink(files.pop());
  };

  getFile();
}

queue.process('deleteFiles', (job, done) => {
  File.find(
    { userId: ObjectId(job.data.userId), isDeleted: true, type: { $ne: 'folder' } },
    (error, collection) => {
      deleteFiles(collection, error => {
        if (error == false) {
          File.find({ userId: ObjectId(job.data.userId), isDeleted: true }, (err, collection) => {
            _.each(collection, fileItem => {
              if (fileItem.folderPath.indexOf('/trash/') === -1) {
                fileItem.folderPath = cleanURL(`/trash/${fileItem.folderPath}`);
              }
              if (fileItem.path.indexOf('/trash/') === -1) {
                fileItem.path = cleanURL(`/trash/${fileItem.path}`);
              }
              fileItem.save();
            });
            done();
          });
        } else {
          done();
        }
      });
    },
  );
});

module.exports = queue;
// app.use(methodOverride());
// app.use(helmet());
// app.use(cors());
