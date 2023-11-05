const app = require("./app");

const User = require("./models/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
