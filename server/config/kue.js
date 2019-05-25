const kue = require('kue');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const File = require('../models/file.model');

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
  if (files.length == 0) callback(false);
  else {
    let filePath = files.pop();
    filePath = path.join(__dirname, `../../uploads/${filePath}`);

    fs.unlink(filePath, err => {
      if (err) callback(true);
      else {
        deleteFiles(files, callback);
      }
    });
  }
}

queue.process('deleteFiles', (job, done) => {
  File.find(
    { userId: job.data.userId, isDeleted: true, type: { $ne: 'folder' } },
    (error, collection) => {
      const paths = _.map(collection, item => item.fileName);
      deleteFiles(paths, error => {
        if (error == false) {
          File.deleteMany({ userId: job.data.userId, isDeleted: true }, (err, collection) => {
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
