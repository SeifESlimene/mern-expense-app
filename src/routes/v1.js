const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/users.controller");

router.post("/register", userController.register);
router.post("/auth", userController.login);

router.all("*", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      const error = new Error("You Are Not Authorized To Access This Area");
      error.status = 401;
      throw error;
    }
    req.user = user;
    return next();
  })(req, res, next);
});

router.get("/expense", (req, res, next) => {
  return res.send({ message: "Hi, You Are Authenticated!", user: req.user });
});
router.get(
  "/expense",

  (req, res, next) => {
    return res.send({ message: "Hi, You Are Authenticated!" });
  }
);
router.get(
  "/expense",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    return res.send({ message: "Hi, You Are Authenticated!" });
  }
);

module.exports = router;
