const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    throw new Error("MONGO_URL is not defined. Add it to your .env file.");
  }

  await mongoose.connect(mongoUrl);
}

module.exports = connectDB;