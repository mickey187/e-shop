var express = require('express');
var router = express.Router();
var validate = require('../middleware/validator');
const SystemAdminController = require('../controller/SystemAdminController');

// system admin dashboard
router.get('/dashboard', SystemAdminController.dashboard);

// employee
router.get('/employee', SystemAdminController.manageEmployee);

// add employee
router.post('/employee/addEmployee', validate.validateAddEmployee, SystemAdminController.addEmployee);

// view employee list
router.get('/employee/viewEmployee', SystemAdminController.viewEmployee);

module.exports = router;