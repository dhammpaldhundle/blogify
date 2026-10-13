const mongoose = require("mongoose");

const { randomBytes, createHmac } = require("crypto");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userProfileImgUrl:{
      type: String,
      default: "/uploads/raw/userIMG.png"
    },
    salt: {
      type: String,
    
    },
    password: {
      type: String,
      required: true,
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true },
);

userSchema.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = randomBytes(16).toString("hex");

  const hashedPassword = createHmac("sha256", salt)
    .update(this.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
});

userSchema.statics.matchPassword = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    return null;
  }

  const hashedPassword = createHmac("sha256", user.salt)
  .update(password)
  .digest("hex");

  if (hashedPassword !== user.password) {
   throw new Error("Invalid password");
  }

  return user;

};


const User = mongoose.model("user", userSchema);
module.exports = User
