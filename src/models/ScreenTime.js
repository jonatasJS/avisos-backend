const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  time: {
    type: Number,
    default: 30
  }
});

module.exports = mongoose.model("screentime", PostSchema);
