const Joi = require('joi');
const File = require('../models/file.model');

const fileSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = { fileSchema };
