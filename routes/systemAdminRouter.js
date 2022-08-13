var express = require('express');
var router = express.Router();
var validate = require('../middleware/validator');
const SystemAdminController = require('../controller/SystemAdminController');

// system admin dashboard
router.get('/system-admin-dashboard', SystemAdminController.dashboard);

// employee
router.get('/employee', SystemAdminController.manageEmployee);

// add employee
router.post('/employee/addEmployee', validate.validateAddEmployee, SystemAdminController.addEmployee);

// view employee list
router.get('/employee/viewEmployee', SystemAdminController.viewEmployee);

// view customer info
router.get('/customer/customer-info', SystemAdminController.viewCustomerInfo);

module.exports = router;