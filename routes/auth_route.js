const express = require("express");
const router = express.Router();
const authController = require("../controller/auth_controller");
const verifyToken = require("./../middleware/auth"); // <--- import verifyToken middleware

//@description     Register a user
//@route           GET /api/auth/register
//@access          Public

router.post("/register", authController.registerUser);

//@description     Login a user
//@route           GET /api/auth/login
//@access          Public
router.post("/login", authController.loginUser);

//@description     Logout a user
//@route           GET /api/auth/logout
//@access          Private
router.get("/logout", verifyToken, authController.logoutUser);
module.exports = router;
