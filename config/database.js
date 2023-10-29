require("dotenv").config();

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database is connected successfully!"))
  .catch((err) => {
    console.log(err.reason);
    process.exit(1);
  });
