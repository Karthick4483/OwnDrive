const Joi = require('joi');
const Comment = require('../models/comment.model');
const { ObjectId } = require('mongodb');

const commentSchema = Joi.object({
  userId: Joi.string().required(),
  fileId: Joi.string().required(),
  comment: Joi.string().required(),
});

function getComments(req, res, next) {
  Comment.find({ userId: req.session.user.id, fileId: req.query.fileId }, (error, collection) => {
    res.json(200, collection);
  });
}

function addComment(req, res, next) {
  const comment = Joi.validate(
    {
      comment: req.body.comment,
      fileId: req.body.fileId,
      userId: req.session.user.id,
    },
    commentSchema,
  ).value;

  new Comment(comment).save((error, comment) => {
    res.json(200, comment);
  });
}

function deleteComment(req, res, next) {
  Comment.deleteOne({ userId: req.session.user.id, fileId: req.body.fileId }, error => {
    res.json(200);
  });
}

module.exports = {
  commentSchema,
  getComments,
  addComment,
  deleteComment,
};
