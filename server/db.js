const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/sneaker_hub");
    console.log("Connected successfully ");
  } catch (error) {
    console.error("Could not connect to database:", error.message);
  }
};
