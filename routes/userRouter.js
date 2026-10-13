const express = require("express");
const User = require("../models/user");
const router = express.Router();

const { createTokenForLoginUser } = require("../service/authentication");

router.get("/signup", (req, res) => {
  res.render("signup.ejs");
});
router.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;

  const user = await User.create({ fullname, email, password });
  console.log(user);

  res.redirect("/user/signin");
});

router.get("/signin", (req, res) => {
  res.render("signin.ejs", { error: null });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.matchPassword(email, password);

    if (!user) {
      return res.status(401).render("signin.ejs", {
        error: "Invalid email or password",
      });
    }

    const token = createTokenForLoginUser(user);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.status(401).render("signin.ejs", {
      error: error.message || "Invalid email or password",
    });
  }
});

module.exports = router;
