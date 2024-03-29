const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  screenTime: {
    type: Number,
    default: 30000,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: false
  },
  editedAt: {
    type: Date,
    required: false
  },
  editedBy: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model("messanges", PostSchema);
