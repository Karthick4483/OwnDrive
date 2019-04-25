const bcrypt = require("bcrypt");
const Joi = require("joi");
const Contact = require("../models/contact.model");
const {ObjectId} = require('mongodb'); // or ObjectID 

const contactSchema = Joi.object({
  userId: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  // middleName: Joi.string().required(),
  email: Joi.string().email(),
  mobile: Joi.string().regex(/^[1-9][0-9]{9}$/),
});

module.exports = {
  insert,
  get,
  del
};

async function insert(contact) {
  contact = await Joi.validate(contact, contactSchema, { abortEarly: false });
  return await new Contact(contact).save();
}

async function get() {
  return await Contact.find({})
}

async function del(id) {
  return await Contact.findOneAndDelete({_id:ObjectId(id)})
  // return await Contact.findOneAndDelete({id:ObjectId(id)})
}
