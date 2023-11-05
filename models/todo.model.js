const mongoose = require("mongoose");

// USER SCHEMA
const todoSchema = mongoose.Schema({
  userEmail: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  dueDateTime: {
    type: Date,
  },
  priority: {
    type: Number,
    default: 0,
  },
  progress: {
    type: Number,
    default: 0,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

// USER MODEL
const Todos = mongoose.model("todos", todoSchema);

module.exports = Todos;
