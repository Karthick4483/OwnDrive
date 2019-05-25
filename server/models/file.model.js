const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true, unique: false },
  displayName: { type: String, required: false, default: '' },
  fileName: { type: String, required: false, default: '' },
  mimeType: { type: String, required: false, default: '' },
  type: { type: String, required: true },
  path: { type: String, required: true, unique: true },
  folderPath: { type: String, required: true, default: '/' },
  isDeleted: { type: Boolean, required: false, default: false },
  isTrashed: { type: Boolean, required: false, default: false },
  createdAt: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model('File', FileSchema);
