const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'File' },
  comment: { type: String, required: true, default: '' },
  isDeleted: { type: Boolean, required: false, default: false },
  createdAt: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model('Comment', CommentSchema);
