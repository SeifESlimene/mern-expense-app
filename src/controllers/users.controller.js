const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const userController = {};

userController.register = async (req, res, next) => {
  const { name, email, password, joined } = req.body;
  const newUser = new User({
    name,
    email,
    password,
    joined,
  });

  try {
    const user = await newUser.save();
    return res.send({ user });
  } catch (e) {
    if (e.code === 11000 && e.name === "MongoError") {
      var error = new Error(`Email address ${newUser.email} Is Already Taken`);
      next(error);
    } else {
      next(e);
    }
  }
};

userController.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error(`The Email ${email} Not Found In Our Database!`);
      err.status = 401;
      next(err);
    }
    user.isPasswordMatch(password, user.password, (err, matched) => {
      if (matched) {
        const secret = process.env.JWT_SECRET;
        const expire = process.env.JWT_EXPIRATION;
        const token = jwt.sign({ _id: user._id }, secret, {
          expiresIn: expire,
        });
        return res.send({ token });
      }
      res
        .status(401)
        .send({ error: "Invalid Username / Password Combination" });
    });
  } catch (e) {
    next(e);
  }
};

module.exports = userController;
