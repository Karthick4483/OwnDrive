const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
  name: { type: String, required: true, default: '', minlength: 1, maxlength: 10 },
  type: { type: String, required: true, default: 'photo' },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  files: [{ type: mongoose.Schema.Types.ObjectId, required: false, default: null, ref: 'File' }],
  isTrashed: { type: Boolean, required: false, default: false },
  isDeleted: { type: Boolean, required: false, default: false },
  createdAt: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model('Album', AlbumSchema);
