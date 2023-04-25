const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./../model/user");

const registerUser = async (req, res) => {
  try {
    // get user input
    const { first_name, last_name, email, password } = req.body;
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
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "1h",
      }
    );
    //save user token
    user.token = token;
    // return new user
    res.status(201).json({ success: true, payload: user });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: "All input are required",
        },
      });
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });
    const comparePW = await bcrypt.compare(password, user.password);
    if (user && comparePW) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
      // user
      res.status(200).json({ success: true, payload: user });
    } else {
      res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: "Register failed! Check authentication credentials",
        },
      });
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const logoutUser = async (req, res) => {
  console.log(req.user);
  try {
    const { user_id } = req.user;
    const user = await User.findOne({ _id: user_id });
    if (user) {
      user.token = "";
      await user.save();
      res.status(200).json({ success: true, payload: user });
    } else {
      res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: "User not found",
        },
      });
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

module.exports = { registerUser, loginUser, logoutUser };
