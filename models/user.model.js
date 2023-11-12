const mongoose = require("mongoose");

// USER SCHEMA
const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  lastLogin: {
    type: Date,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

// USER MODEL
const User = mongoose.model("users", userSchema);

module.exports = User;
