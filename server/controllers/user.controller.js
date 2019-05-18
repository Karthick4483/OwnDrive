const Joi = require('joi');
const User = require('../models/user.model');

const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: [Joi.string().optional(), Joi.allow(null)],
  middleName: [Joi.string().optional(), Joi.allow(null)],
  email: Joi.string().email(),
  mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/),
  password: Joi.string().required(),
  repeatPassword: Joi.string()
    .required()
    .valid(Joi.ref('password')),
  isVerified: Joi.boolean(),
});

module.exports = {
  userSchema,
  getUser,
};

function getUser(req, res, next) {
  res.json(200, req.session.user);
}
