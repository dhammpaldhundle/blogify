const express = require("express");
const Blog = require("../models/blogs");
const Comment = require("../models/comments");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },

  filename: function (req, file, cb) {
    const filName = `${Date.now()} -${file.originalname}`;

    cb(null, filName);
  },
});

const uplaod = multer({ storage: storage });

const router = express.Router();


router.post("/:id/comment", async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.redirect("/user/signin");
  }

  const comment = req.body.comment && req.body.comment.trim();

  if (!comment) {
    return res.redirect(`/blog/${req.params.id}`);
  }

  try {
    await Comment.create({
      comment,
      commentedBy: req.user.id,
      blogId: req.params.id,
    });

    return res.redirect(`/blog/${req.params.id}`);
  } catch (error) {
    console.error("Comment Save Error:", error);
    return res.status(500).send("Comment save nahi ho paya.");
  }
});

router.get("/new-add", (req, res) => {
  res.render("blog.ejs");
});

router.post("/new-add", uplaod.single("addThumbnail"), async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.redirect("/user/signin");
  }

  const body = req.body;
  const { title, body: blogBody } = body;

  let thumbnailURL = "";
  if (req.file) {
    thumbnailURL = `/uploads/${req.file.filename}`;
  }
  const picBody = req.file;
  console.log(picBody);

  try {
    const blog = await Blog.create({
      title,
      body: blogBody,
      thumbnailURL,
      createdBy: req.user.id,
    });
    console.log(blog);
  } catch (error) {
    console.error("Database Save Error:", error);
  }

  res.redirect("/");
});


router.get("/:id", async (req, res) => {
  const blogId = req.params.id;

  const blog = await Blog.findById(blogId).populate("createdBy");
  const comments = await Comment.find({ blogId }).populate("commentedBy");
  

  console.log(blog);
  console.log(comments);

  res.render("blogDetail.ejs", {
    user: req.user,
    blog: blog,
    comments,
  });
});
module.exports = router;
