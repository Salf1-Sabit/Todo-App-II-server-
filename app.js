// REQUIRED STUFF
require("./config/database");
require("dotenv").config();
const saltRounds = 10;
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const Todos = require("./models/todo.model");
const User = require("./models/user.model");
const app = express();

// CROSS PLATFORM RESOURCE SHARING
app.use(cors());

// PARSE JSON PAYLOADS
app.use(express.json());

// BODY PARSER
app.use(
  express.urlencoded({
    extended: true,
  })
);

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Welcome to home");
});

// REGISTER ROUTE
app.post("/register", async (req, res) => {
  try {
    // Destructure body data
    const reqFullName = req.body.fullName;
    const reqEmail = req.body.email;
    const reqPassword = req.body.password;

    const user = await User.findOne({ email: reqEmail });

    // If user already exists
    if (user) {
      return res.status(409).send({
        success: false,
        message: `User with email ${reqEmail} already exists. Try using another one.`,
      });
    }

    // If user is unique
    bcrypt.hash(reqPassword, saltRounds, async (err, hash) => {
      // Store hash in your password DB.
      const newUser = new User({
        fullName: reqFullName,
        email: reqEmail,
        password: hash,
      });

      await newUser
        .save()
        .then((user) => {
          res.send({
            success: true,
            message: `User "${reqFullName}" is created successfully!`,
            user: {
              id: user._id,
              fullName: reqFullName,
              email: reqEmail,
            },
          });
        })
        .catch((err) => {
          res.send({
            success: false,
            message: `We regret to inform you that user "${reqFullName}" creation was unsuccessful. We encountered an issue while attempting to create a new user.`,
            error: err,
          });
        });
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// login route
app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).send({
      success: false,
      message: "User is not found",
    });
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).send({
      success: false,
      message: "Incorrect password",
    });
  }

  return res.status(200).send({
    success: true,
    id: user._id,
    email: user.email,
    fullName: user.fullName,
    message: "User is logged in successfully",
  });
});

// ADD TODO
app.post("/api/addtodo", async (req, res) => {
  try {
    // Destructure body data
    const reqUserEmail = req.body.email;
    const reqTitle = req.body.title;
    const reqDesc = req.body.desc;
    const reqDueDateTime = req.body.dueDateTime;
    const reqTodoStatus = req.body.newTodoStatus;

    const newTodo = new Todos({
      userEmail: reqUserEmail,
      title: reqTitle,
      description: reqDesc,
      dueDateTime: reqDueDateTime,
      todoStatus: reqTodoStatus,
    });

    const user = await User.findOne({ email: reqUserEmail });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User doesn't exist!",
      });
    }

    const todo = await newTodo.save();
    res.send({
      success: true,
      message: `New todo is added to the database successfully!`,
      todo: {
        todo,
      },
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET TODO
app.get("/api/gettodo", async (req, res) => {
  try {
    // Destructure query paramter data (only used in get request)
    const reqUserEmail = req.query.email;

    const user = await User.findOne({ userEmail: reqUserEmail });

    // If user not found
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User doesn't exist!",
      });
    }

    const allTodos = await Todos.find({ userEmail: reqUserEmail });
    res.send({
      success: true,
      message: `All todos are fetched from the database successfully!`,
      allTodos: allTodos,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// UPDATE TODO
app.patch("/api/updatetodo", async (req, res) => {
  try {
    // Destructure query paramter data (only used in get request)
    const reqId = req.body._id;
    const reqTitle = req.body.thisTitle;
    const reqDesc = req.body.thisDescription;
    const reqDueDateTime = req.body.editedDueTime;
    const reqProgress = req.body.progress;
    const reqPriority = req.body.priorityValue;
    const reqTodoStatus = req.body.todoStatus;

    if (reqTitle) {
      await Todos.updateOne({ _id: reqId }, { $set: { title: reqTitle } });
    }
    if (reqDesc) {
      await Todos.updateOne({ _id: reqId }, { $set: { description: reqDesc } });
    }
    if (reqDueDateTime) {
      await Todos.updateOne(
        { _id: reqId },
        { $set: { dueDateTime: reqDueDateTime } }
      );
    }
    if (reqProgress) {
      await Todos.updateOne(
        { _id: reqId },
        { $set: { progress: reqProgress } }
      );
    }
    if (reqPriority) {
      await Todos.updateOne(
        { _id: reqId },
        { $set: { priority: reqPriority } }
      );
    }
    if (reqTodoStatus === false || reqTodoStatus === true) {
      await Todos.updateOne(
        { _id: reqId },
        { $set: { todoStatus: reqTodoStatus } }
      );
    }
    const todo = await Todos.findOne({ _id: reqId });
    res.send({
      success: true,
      message: `Todo with id ${reqId} has been updated successfully!`,
      todo: todo,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// DELETE TODO
app.delete("/api/deletetodo/:_id", async (req, res) => {
  try {
    // Destructure query paramter data (only used in get request)
    const reqId = req.params._id;

    await Todos.deleteOne({ _id: reqId });
    const todos = await Todos.find();

    res.status(200).send({
      success: true,
      message: `Todo with id ${reqId} has been deleted successfully!`,
      todos: todos,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// profile route
app.get("/profile", (req, res) => {
  return res.status(200).send("Welcome to profile");
});

// RESOURCE NOT FOUND
app.use((req, res, next) => {
  res.status(404).send("404 not found ");
});

// SERVER ERROR
app.use((err, req, res, next) => {
  res.status(500).send("Something broke!");
});

module.exports = app;
