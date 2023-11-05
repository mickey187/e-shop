const express = require('express');
const router = express.Router();
const {register} = require('../controller/UserController');
const {validateUserRegistration} = require('../middleware/UserValidator');


// router.post('/register', validateUserRegistration, register);

module.exports = router;
