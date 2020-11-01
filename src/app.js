const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser = require("body-parser");
const app = express();

// DB Config

mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected To The Database");
});
mongoose.connection.on("error", (err) => {
  console.error(`Failed To Connected To The Database: ${err}`);
});

// Middlewares
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.post("/hello", (req, res) => {
  const name = req.body.name;
  res.send({
    message: `welcome ${name}`,
  });
});

module.exports = app;
