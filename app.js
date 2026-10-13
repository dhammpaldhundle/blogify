require('dotenv').config()
const express = require("express");

const app = express();
const path = require("path");
const connectDB = require("./config/db-connection");
const userRouter = require("./routes/userRouter");
const blogRouter = require("./routes/blogRouter");
const cookieParser = require("cookie-parser");
const { checkAuthenticationByToken } = require("./middlewares/authentication");
const Blog = require("./models/blogs");

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve("./public")));

app.use(checkAuthenticationByToken("token"));

const PORT = (process.env.PORT || process.env.PORT_URL || "3000")
  .trim()
  .replace(/;$/, "");
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.set("views", path.join(__dirname, "views"));

//middleware

//routes
app.get("/", async (req, res) => {
  const AllBlogs = await Blog.find({});

  res.render("home.ejs", {
    blogs: AllBlogs,
  });
});

app.use("/user", userRouter);
app.use("/blog", checkAuthenticationByToken("token"), blogRouter);

connectDB()
  .then(() => {
    console.log("Database Connected Successfully");
    app.listen(PORT, () => console.log(`Server Started Successfully on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });

  module.exports = app;
