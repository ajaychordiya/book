const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile_no: {
    type: String,
    required: true,
  },
  msg: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("contactUs", contactUsSchema);
