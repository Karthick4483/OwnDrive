const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  type: { type: String, required: true },
  isDeleted: { type: Boolean, required: false, default: false },
  createdAt: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model('File', FileSchema);
