const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./../model/user");
const router = express.Router();

//@description     Register a user
//@route           GET /api/auth/register
//@access          Public

router.post("/register", async (request, res) => {
  // get user input
  const { first_name, last_name, email, password } = request.body;
  // validate user input
  if (!(first_name && last_name && email && password)) {
    res.status(400).json({
      success: false,
      error: {
        code: 400,
        message: "All input are required",
      },
    });
  }
  //check if a user exist and validate if user exist in our database
  const oldUser = await User.findOne({ email });
  if (oldUser) {
    return res.status(409).json({
      success: false,
      error: {
        code: 409,
        message: "User already exist",
      },
    });
  }
  // Encrypt user password
  const salt = await bcrypt.genSaltSync(10);
  encryptedPassword = await bcrypt.hash(password, salt);
  // Create user in our database
  const user = await User.create({
    first_name,
    last_name,
    email: email.toLowerCase(),
    password: encryptedPassword,
  });
  // create token
  const token = jwt.sign({ user_id: user._id, email }, process.env.TOKEN_KEY, {
    expiresIn: "2h",
  });
  //save user token
  user.token = token;
  // return new user
  res.status(201).json({ success: true, payload: user });
});

//@description     Login a user
//@route           GET /api/auth/login
//@access          Public
router.post("/login", (request, reponse) => {});
module.exports = router;
