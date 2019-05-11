const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SignupTokenSchema = new mongoose.Schema({
  _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 43200 },
});

SignupTokenSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.hashedPassword);
};

module.exports = mongoose.model('SignupToken', SignupTokenSchema);
