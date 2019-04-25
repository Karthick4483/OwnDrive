const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const ContactSchema = new mongoose.Schema(
  {
    userId:{
      type: ObjectId,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    middleName: {
      type: String,
      required: false
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email"
      ]
    },
    mobile: {
      type: Number,
      require: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("Contact", ContactSchema);
