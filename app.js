// REQUIRED STUFF
require("./config/database");
require("dotenv").config();
const saltRounds = 10;
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const User = require("./models/user.model");
// const jwt = require("jsonwebtoken");
// const passport = require("passport");
// const SECRET_KEY = process.env.SECRET_KEY;
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

// USE PASSPORT
// app.use(passport.initialize());
// require("./config/passport");

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
    message: "User is logged in successfully",
  });
});

// profile route
app.get("/profile", (req, res) => {
  return res.status(200).send("Welcome to profile");
});

// LOGIN ROUTE
// app.post("/login", async (req, res) => {
//   // Destructure body data
//   const reqEmail = req.body.email;
//   const reqPassword = req.body.password;

//   const user = await User.findOne({ email: reqEmail });

//   // If user doesn't exists
//   if (!user) {
//     return res.status(404).send({
//       success: false,
//       message: `Sorry! User with email ${reqEmail} doesn't exists. Try with the correct one.`,
//     });
//   }

//   // If password is incorrect
//   if (!bcrypt.compareSync(reqPassword, user.password)) {
//     return res.status(401).send({
//       success: false,
//       message: `Sorry! This password is incoreect. Try with the correct one.`,
//     });
//   }

//   // if password is correct
//   const payload = {
//     id: user._id,
//     email: user.email,
//   };

//   // const token = jwt.sign(payload, SECRET_KEY, {
//   //   expiresIn: "7d",
//   // });

//   return res.status(200).send({
//     success: true,
//     message: "Login Successful. Welcome!",
//     // token: "Bearer " + token,
//   });
// });

// PROTECTED TODAY ROUTE - with passport
// app.get(
//   "/profile",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     return res.status(200).send({
//       success: true,
//       // user: {
//       //   id: req.user._id,
//       //   email: req.user.email,
//       // },
//     });
//   }
// );

// RESOURCE NOT FOUND
app.use((req, res, next) => {
  res.status(404).send("404 not found ");
});

// SERVER ERROR
app.use((err, req, res, next) => {
  res.status(500).send("Something broke!");
});

module.exports = app;
