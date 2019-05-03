const express = require('express');
const asyncHandler = require('express-async-handler');
const userCtrl = require('../controllers/user.controller');
const contactCtrl = require('../controllers/contact.controller');

const router = express.Router();
module.exports = router;

router.route('/').post(asyncHandler(insertUser));
router.route('/contacts').get(asyncHandler(getContacts));
router.route('/contacts/add').post(asyncHandler(addContact));
router.route('/contact/:id').delete(asyncHandler(delContact));

router.get('/me', (req, res, next) => {
  res.json(200, req.session.user);
});

async function addContact(req, res) {
  let contact = await contactCtrl.insert(req.body);
  res.json(contact);
}

async function delContact(req, res) {
  let contact = await contactCtrl.del(req.params.id);
  res.json(contact);
}

async function getContacts(req, res) {
  let contact = await contactCtrl.get();
  res.json(contact);
}

async function insertUser(req, res) {
  let user = await userCtrl.insert(req.body);
  res.json(user);
}
