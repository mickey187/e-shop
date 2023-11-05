const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controller/AuthController");
const {
  validateUserRegistration,
  loginRequestValidator,
} = require("../middleware/UserValidator");

router.post("/register", validateUserRegistration, register);
router.post("/login", loginRequestValidator, login);
router.post("/logout", logout);

module.exports = router;
