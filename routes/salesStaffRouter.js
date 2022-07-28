var express = require('express');
var router = express.Router();
const SalesStaffController = require('../controller/SalesStaffController');

router.get('/sales-staff-dashboard', SalesStaffController.salesStaffDashboard);

router.get('/manage-orders', SalesStaffController.manageOrders);

module.exports = router;