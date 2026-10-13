const mongoose = require("mongoose");

//schema

const blogSchema = new mongoose.Schema({
  title: { type: String, require: true },

  body: {
    type: String,
  },

  thumbnailURL: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

//model

const Blog = mongoose.model("blog", blogSchema);
module.exports = Blog;
