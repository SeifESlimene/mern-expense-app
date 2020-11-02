const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const v1 = require("./routes/v1");
const passport = require("passport");

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
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);
// Routes
app.use("/api/v1", v1);

// Errors

app.use((req, res, next) => {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const error = err.message || "Error Processing Your Request";
  res.status(status).send({ error });
});

module.exports = app;
